import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Content generation server is running",
    timestamp: new Date().toISOString()
  });
});

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// Using the model name format that works with Replicate API
const MODEL_NAME = "black-forest-labs/flux-schnell";

// Route to generate image using Flux.1
// POST /generate-image: Generate a poster image from a prompt
app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    // Friendly error for missing prompt
    return res
      .status(400)
      .json({ error: "Please describe what you want on your poster." });
  }

  console.log("Generating image for prompt:", prompt);
  console.log("Using API token:", REPLICATE_API_TOKEN ? "Token present" : "No token");

  try {
    // First, let's get the latest version of the model
    const modelResponse = await axios.get(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell",
      {
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
        },
      }
    );
    
    const latestVersion = modelResponse.data.latest_version.id;
    console.log("Using model version:", latestVersion);

    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: latestVersion,
        input: {
          prompt: prompt,
          width: 1024,
          height: 1024,
          num_inference_steps: 4,
          guidance_scale: 0.0,
        },
      },
      {
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const prediction = response.data;
    console.log("Prediction created:", prediction.id);
    
    // Poll for result
    let result;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds timeout
    
    while (attempts < maxAttempts) {
      const status = await axios.get(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` },
        }
      );
      
      console.log("Status check:", status.data.status);
      
      if (status.data.status === "succeeded") {
        result = status.data.output[0];
        console.log("Image generated successfully:", result);
        break;
      }
      if (status.data.status === "failed") {
        console.error("Prediction failed:", status.data.error);
        throw new Error(
          "Sorry, we could not create your poster. Please try again."
        );
      }
      
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    
    if (!result) {
      throw new Error("Image generation timed out. Please try again.");
    }

    res.json({ imageUrl: result });
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
    // Friendly error for user
    res.status(500).json({
      error: error.response?.data?.detail || 
             "Sorry, something went wrong while creating your poster. Please try again in a moment.",
    });
  }
});

// POST /post-to-twitter: Pretend to post to Twitter/X (for demo)
app.post("/post-to-twitter", async (req, res) => {
  const { imageUrl, caption } = req.body;
  // In a real app, you would connect to Twitter/X here.
  // For this demo, just return a friendly confirmation.
  if (!imageUrl) {
    return res.status(400).json({ error: "No poster image found to share." });
  }
  res.json({
    message: `Your poster has been shared to Twitter/X!\nCaption: ${
      caption || "(no caption)"
    }`,
  });
});

const PORT = process.env.PORT || 5000;

// Validate environment variables
if (!REPLICATE_API_TOKEN) {
 process.exit(1);
}

app.listen(PORT, () => {
 
});
