import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
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

  try {
    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: MODEL_NAME,
        input: {
          prompt,
          height: 1024,
          width: 1024,
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
    // Poll for result
    let result;
    while (true) {
      const status = await axios.get(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` },
        }
      );
      if (status.data.status === "succeeded") {
        result = status.data.output[0];
        break;
      }
      if (status.data.status === "failed") {
        throw new Error(
          "Sorry, we could not create your poster. Please try again."
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    res.json({ imageUrl: result });
  } catch (error) {
    console.error(error);
    // Friendly error for user
    res.status(500).json({
      error:
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
