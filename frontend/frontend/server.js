// server.js
const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const app = express();
const PORT = 5001;

// Allow CORS from your React dev server
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin",  "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});


app.use(express.json());    

app.post("/api/face_capture", (req, res) => {
    console.log("HERE")
    const { username } = req.body;       
    const scriptPath = path.join(__dirname, "src", "FaceNet-Infer", "face_capture.py");
    const py = spawn("python", [scriptPath, username]);
    console.log("SPAWNED");
    py.on("error", err => {
        console.error("Python spawn error:", err);
        res.status(500).json({ success: false, error: err.message });
    });

    let output = "", error = "";
    py.stdout.on("data", d => (output += d.toString()));
    py.stderr.on("data", d => (error  += d.toString()));

    py.on("close", code => {
        console.log("HERE", code);
        if (code === 0) {
            res.json({ success: true, output });
        } else {
            res.status(500).json({ success: false, error });
        }
    });
});

const fs = require("fs");
const fsPromises = require("fs/promises");

app.post("/api/delete_user", async (req, res) => {
  const { username } = req.body;
  const userPath = path.join(__dirname, "src", "FaceNet-Infer", "data", "test_images", username);

  try {
    if (fs.existsSync(userPath)) {
      await fsPromises.rm(userPath, { recursive: true, force: true });
      console.log(`✅ Deleted folder: ${userPath}`);
    } else {
      console.log(`⚠️  Folder not found: ${userPath}`);
    }
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting user folder:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/user/face-login", (req, res) => {
    const scriptPath = path.join(__dirname, "src", "FaceNet-Infer", "face_recognition.py");
    const py = spawn("python", [scriptPath]);

    let output = "", error = "";

    py.stdout.on("data", (data) => {
        output += data.toString();
    });

    py.stderr.on("data", (data) => {
        error += data.toString();
    });

    py.on("error", (err) => {
        console.error("Python spawn error:", err);
        res.status(500).json({ success: false, error: err.message });
    });

    py.on("close", (code) => {
        console.log("Python process exited with code:", code);
        if (code === 0) {
            res.json({ success: true, output });
        } else {
            console.error("Face ID Error:", error || output);
            res.status(401).json({ success: false, message: "Face not recognized", error });
        }
    });
});

app.listen(PORT, () => console.log(`▶️  Python-API on port ${PORT}`));
