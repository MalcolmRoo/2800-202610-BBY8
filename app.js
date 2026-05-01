require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

// middleware
app.use(cors());
app.use(express.json());

// API routes FIRST
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running" });
});

app.post("/api/identify", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const organ = req.body.organ || "leaf";
    const apiKey = process.env.PLANTNET_API_KEY;

    const form = new FormData();
    form.append("organs", organ);
    form.append("images", req.file.buffer, {
      filename: "plant.jpg",
      contentType: req.file.mimetype,
    });

    const response = await fetch(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`,
      {
        method: "POST",
        body: form,
      },
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "PlantNet API error" });
    }

    const data = await response.json();
    const top = data.results[0];

    res.json({
      scientificName: top.species.scientificNameWithoutAuthor,
      commonName: top.species.commonNames[0] || "Unknown",
      score: Math.round(top.score * 100),
      remainingCalls: data.remainingIdentificationRequests,
    });
  } catch (err) {
    console.error("Identify error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// page routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/camera", (req, res) => {
  res.sendFile(path.join(__dirname, "camera.html"));
});
app.get("/search", (req, res) => {
  res.sendFile(path.join(__dirname, "search.html"));
});
app.get("/plant", (req, res) => {
  res.sendFile(path.join(__dirname, "plant.html"));
});

// static files AFTER routes
app.use(express.static(path.join(__dirname, "styles")));
app.use(express.static(path.join(__dirname, "src")));

// 404
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
