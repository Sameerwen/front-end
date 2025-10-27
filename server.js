// ---------------------------
// After School Classes Backend (Node.js + Express + MongoDB)
// ---------------------------

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import expressSession from 'express-session';
import multer from 'multer';

const port = 3000;
const app = express();
const __dirname = path.resolve();

// ---------------------------
// Middleware
// ---------------------------
app.use(bodyParser.json());
app.use(express.static('public')); // static frontend assets (optional)
app.use(express.static('uploads')); // serve uploaded images
app.use(expressSession({
  secret: "cst3144_secret",
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true
}));

// ---------------------------
// MongoDB Setup
// ---------------------------
const uri = "mongodb://localhost:27017"; // change to your Atlas URI if using cloud
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true
  }
});

let db, lessonsCollection, ordersCollection;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db("afterSchoolDB");
    lessonsCollection = db.collection("lessons");
    ordersCollection = db.collection("orders");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}
connectDB();

// ---------------------------
// Routes
// ---------------------------

// GET all lessons
app.get('/lessons', async (req, res) => {
  try {
    const lessons = await lessonsCollection.find().toArray();
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// SEARCH lessons dynamically
app.get('/search', async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || '';
    const lessons = await lessonsCollection.find({
      $or: [
        { subject: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// POST new order
app.post('/order', async (req, res) => {
  try {
    const order = req.body;
    await ordersCollection.insertOne(order);
    res.json({ success: true, message: 'Order placed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order failed' });
  }
});

// PUT update lesson spaces
app.put('/update/:id', async (req, res) => {
  try {
    const lessonId = new ObjectId(req.params.id);
    const { spaces } = req.body;
    await lessonsCollection.updateOne(
      { _id: lessonId },
      { $set: { spaces: spaces } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('🎓 After School Classes API is running...');
});

// ---------------------------
// Start Server
// ---------------------------
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
