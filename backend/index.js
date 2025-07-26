// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Import Models
import DistributionCenter from "./models/DistributionCenter.js";
import InventoryItem from "./models/InventoryItem.js";
import OrderItem from "./models/OrderItem.js";
import Order from "./models/Order.js";
import Product from "./models/Product.js";
import User from "./models/User.js";

// ✅ Express App
const app = express();
app.use(bodyParser.json());
app.use(cors());

// ------------------- AI CHAT -------------------
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const lowerMsg = message.toLowerCase();

    // Helpers
    const matchValue = (pattern) => {
      const match = message.match(pattern);
      return match ? match[1].trim() : null;
    };

    // Try to extract identifiers from message
    const id = matchValue(/id\s*(?:is\s*)?(\d+)/i);
    const email = matchValue(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const name = matchValue(/name\s*(?:is\s*)?([a-z\s]+)/i);
    const city = matchValue(/city\s*(?:is\s*)?([a-z\s]+)/i);
    const productName = matchValue(/product.*name\s*(?:is\s*)?([a-zA-Z0-9\s]+)/i);
    const orderId = matchValue(/order.*id\s*(?:is\s*)?(\d+)/i);

    // Dynamic Queries (if needed, enhance parsing logic here)
    const results = {};

    if (lowerMsg.includes("user") || email || name || city || id) {
      const query = {};
      if (email) query.email = email;
      if (name) query.first_name = new RegExp(name, "i");
      if (city) query.city = new RegExp(city, "i");
      if (id) query.id = parseInt(id);
      results.user = await User.findOne(query);
    }

    if (lowerMsg.includes("order")) {
      const query = {};
      if (orderId) query.order_id = parseInt(orderId);
      if (id) query.order_id = parseInt(id);
      results.order = await Order.findOne(query);
    }

    if (lowerMsg.includes("order item") || lowerMsg.includes("orderitems")) {
      const query = {};
      if (id) query.id = parseInt(id);
      if (orderId) query.order_id = parseInt(orderId);
      results.order_item = await OrderItem.findOne(query);
    }

    if (lowerMsg.includes("product")) {
      const query = {};
      if (productName) query.name = new RegExp(productName, "i");
      if (id) query.id = parseInt(id);
      results.product = await Product.findOne(query);
    }

    if (lowerMsg.includes("inventory")) {
      const query = {};
      if (id) query.id = parseInt(id);
      results.inventory_item = await InventoryItem.findOne(query);
    }

    if (lowerMsg.includes("distribution")) {
      const query = {};
      if (id) query.id = parseInt(id);
      results.distribution_center = await DistributionCenter.findOne(query);
    }

    // Format results
    const formatted = Object.entries(results).map(([key, value]) => {
      if (!value) return `❌ No ${key} found.\n`;
      return `📌 ${key.toUpperCase()}:\n${JSON.stringify(value, null, 2)}\n`;
    }).join("\n");

    // Build prompt for Groq
    const prompt = `
You are an assistant that answers user queries based on data from multiple collections.

📂 Database Data:
${formatted}

🧾 User's Question:
${message}

Please provide a helpful, clear, and complete answer using the data above.
`;

    // Call Groq API
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You are a helpful assistant that answers database queries." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 400,
    });

    const reply = response.choices[0]?.message?.content || "No response from Groq.";
    res.json({ response: reply });
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});