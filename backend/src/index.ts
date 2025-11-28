import dotenv from "dotenv";
dotenv.config(); // ← Move this RIGHT after the dotenv import

import express from "express";
import cors from "cors";
import questRoute from "./routes/quest.route"; // ← Now this will have access to env vars
import imageGenRoute from "./routes/imageGen.route";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/quests", questRoute);
app.use("/generate-image", imageGenRoute);
app.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("✅ API Key loaded:", !!process.env.GOOGLE_API_KEY); // Debug line
});
