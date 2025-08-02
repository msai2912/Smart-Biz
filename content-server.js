import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

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

// POST /api/chatbot: AI-powered customer service chatbot using Gemini
app.post("/api/chatbot", async (req, res) => {
  const { message, businessInfo, conversationHistory = [] } = req.body;
  
  if (!message || !businessInfo) {
    return res.status(400).json({ 
      error: "Message and business information are required" 
    });
  }

  console.log("Chatbot request for:", businessInfo.name);
  console.log("User message:", message);

  try {
    if (!genAI || !GEMINI_API_KEY) {
      throw new Error("Gemini AI not configured");
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate comprehensive prompt with business context
    const businessPrompt = `
You are an AI customer service representative for ${businessInfo.name}. 

BUSINESS INFORMATION:
- Business Name: ${businessInfo.name}
- Business Type: ${businessInfo.type || 'Service Business'}
- Description: ${businessInfo.description}
- Location: ${businessInfo.address || 'Local area'}
- Phone: ${businessInfo.phone || 'Contact us for phone number'}
- Email: ${businessInfo.email || `info@${businessInfo.name.toLowerCase().replace(/\s+/g, '')}.com`}
- Business Hours: ${businessInfo.hours || 'Monday to Friday, 9 AM to 6 PM'}
- Services/Products: ${businessInfo.services || businessInfo.products || businessInfo.description}

CONVERSATION HISTORY:
${conversationHistory.map(msg => `${msg.isBot ? 'Assistant' : 'Customer'}: ${msg.text}`).join('\n')}

INSTRUCTIONS:
- You represent ${businessInfo.name} and should answer as their customer service representative
- Be helpful, professional, and friendly
- Provide accurate information about the business based on the details above
- If you don't know specific details not provided above, politely direct them to contact the business directly
- Keep responses concise but informative (under 150 words)
- Focus on helping customers with inquiries about products, services, hours, location, pricing, etc.
- Always stay in character as a representative of this specific business
- Use the business information provided above to answer questions accurately
- Don't make up information not provided in the business details

CUSTOMER MESSAGE: ${message}

Please provide a helpful response as a customer service representative for ${businessInfo.name}:
`;

    // Generate response
    const result = await model.generateContent(businessPrompt);
    const response = result.response;
    const responseText = response.text();

    console.log("Gemini response:", responseText);

    res.json({ 
      response: responseText,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    
    // Fallback response using basic logic
    const fallbackResponse = generateFallbackResponse(message, businessInfo);
    
    res.json({ 
      response: fallbackResponse,
      fallback: true,
      timestamp: new Date().toISOString()
    });
  }
});

// Fallback response generator for when Gemini AI is unavailable
function generateFallbackResponse(userInput, businessInfo) {
  const input = userInput.toLowerCase();
  
  if (input.includes('hours') || input.includes('open') || input.includes('time')) {
    return `We're open ${businessInfo.hours || 'Monday to Friday, 9 AM to 6 PM'}. Feel free to visit us or contact us during these hours!`;
  }
  
  if (input.includes('location') || input.includes('address') || input.includes('where')) {
    return `You can find us at ${businessInfo.address || 'our main location'}. We'd love to see you there!`;
  }
  
  if (input.includes('contact') || input.includes('phone') || input.includes('email')) {
    return `You can reach us at ${businessInfo.phone || '(555) 123-4567'} or email us at ${businessInfo.email || 'hello@' + businessInfo.name.toLowerCase().replace(/\s+/g, '') + '.com'}.`;
  }
  
  if (input.includes('service') || input.includes('offer') || input.includes('do')) {
    return `At ${businessInfo.name}, we specialize in ${businessInfo.description}. Our team is dedicated to providing excellent service. Would you like to know more about any specific service?`;
  }
  
  return `Thank you for your question about ${businessInfo.name}! We're a ${businessInfo.type || 'business'} that ${businessInfo.description}. For more information, please contact us directly and our team will be happy to help!`;
}

const PORT = process.env.PORT || 5000;

// Validate environment variables
if (!REPLICATE_API_TOKEN) {
  console.error("❌ Error: REPLICATE_API_TOKEN not found in environment variables");
  console.log("Please create a .env file with your Replicate API token:");
  console.log("REPLICATE_API_TOKEN=your_token_here");
  process.exit(1);
}

if (!GEMINI_API_KEY) {
  console.warn("⚠️  Warning: GEMINI_API_KEY not found - chatbot will use fallback responses");
  console.log("Add GEMINI_API_KEY=your_gemini_key to .env for AI-powered chatbot");
}

app.listen(PORT, () => {
  console.log(`🚀 Content generation server running on port ${PORT}`);
  console.log(`✅ Replicate API token configured`);
  console.log(`${GEMINI_API_KEY ? '🤖 Gemini AI chatbot enabled' : '⚠️  Gemini AI chatbot using fallback mode'}`);
  console.log(`📡 Ready to generate AI posters and handle chatbot queries!`);
});
