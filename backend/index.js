const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("./db"); // Connect to MongoDB

// ✅ OpenAI v4 SDK
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ MongoDB Models
const DistributionCenter = require("./models/DistributionCenter");
const InventoryItem = require("./models/InventoryItem");
const OrderItem = require("./models/OrderItem");
const Order = require("./models/Order");
const Product = require("./models/Product");
const User = require("./models/User");
// const Message = require("./models/Message"); // Optional

const app = express();
app.use(bodyParser.json());
app.use(cors());

// --- USERS ---
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PRODUCTS ---
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ORDERS ---
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ORDER ITEMS ---
app.get("/api/order-items", async (req, res) => {
  try {
    const items = await OrderItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/order-items", async (req, res) => {
  try {
    const item = new OrderItem(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- INVENTORY ITEMS ---
app.get("/api/inventory-items", async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/inventory-items", async (req, res) => {
  try {
    const item = new InventoryItem(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DISTRIBUTION CENTERS ---
app.get("/api/distribution-centers", async (req, res) => {
  try {
    const centers = await DistributionCenter.find();
    res.json(centers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/distribution-centers", async (req, res) => {
  try {
    const center = new DistributionCenter(req.body);
    await center.save();
    res.json(center);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- AI CHAT ENDPOINT ---
// ✅ This exists in your code already
app.post("/api/chat", async (req, res) => {
  const { message, conversation_id = "default-session" } = req.body;

  try {
    const products = await Product.find().limit(5);
    const productList = products.map(p => `- ${p.name}: ${p.description || "No description"}`).join("\n");

    const prompt = `
Here are some products in the warehouse:
${productList}

User: ${message}
`;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful AI assistant for a warehouse system." },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const aiResponse = aiRes.choices[0].message.content;
    res.json({ response: aiResponse });
  } catch (err) {
    console.error("Error in /api/chat:", err.message);
    res.status(500).json({ error: "AI response failed." });
  }
});


// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
