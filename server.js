// Main entry point: configures Express, serves the frontend, and starts the server.
require("dotenv").config();

const express = require("express");
const path = require("path");
const studentRoutes = require("./src/routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Convert incoming JSON request bodies into JavaScript objects.
app.use(express.json());

// Serve files such as index.html, styles.css, and app.js from /public.
app.use(express.static(path.join(__dirname, "public")));

// All student-related API routes begin with /api/students.
app.use("/api/students", studentRoutes);

// Return a helpful message for API routes that do not exist.
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API endpoint not found." });
});

// General error handler: log details on the server, send a safe message to clients.
app.use((err, req, res, next) => {
  console.error("Unexpected server error:", err);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

app.listen(PORT, () => {
  console.log(`College Management System running at http://localhost:${PORT}`);
});
