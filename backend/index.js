const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
    
const cors = require("cors");

const DistributionCenter = require("./models/DistributionCenter");
const InventoryItem = require("./models/InventoryItem");
const OrderItem = require("./models/OrderItem");
const Order = require("./models/Order");
const Product = require("./models/Product");
const User = require("./models/User");

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ROUTES EXAMPLES

// USERS
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/api/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// PRODUCTS
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/api/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// ORDERS
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.post("/api/orders", async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json(order);
});

// ORDER ITEMS
app.get("/api/order-items", async (req, res) => {
  const orderItems = await OrderItem.find();
  res.json(orderItems);
});

app.post("/api/order-items", async (req, res) => {
  const orderItem = new OrderItem(req.body);
  await orderItem.save();
  res.json(orderItem);
});

// INVENTORY ITEMS
app.get("/api/inventory-items", async (req, res) => {
  const inventoryItems = await InventoryItem.find();
  res.json(inventoryItems);
});

app.post("/api/inventory-items", async (req, res) => {
  const inventoryItem = new InventoryItem(req.body);
  await inventoryItem.save();
  res.json(inventoryItem);
});

// DISTRIBUTION CENTERS
app.get("/api/distribution-centers", async (req, res) => {
  const dcs = await DistributionCenter.find();
  res.json(dcs);
});

app.post("/api/distribution-centers", async (req, res) => {
  const dc = new DistributionCenter(req.body);
  await dc.save();
  res.json(dc);
});

// SERVER LISTEN
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const cors = require('cors');
app.use(cors());



