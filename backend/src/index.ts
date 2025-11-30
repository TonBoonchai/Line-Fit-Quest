import dotenv from "dotenv";
dotenv.config(); // ← Move this RIGHT after the dotenv import

import express from "express";
import cors from "cors";
import questRoute from "./routes/quest.route"; // ← Now this will have access to env vars
import imageGenRoute from "./routes/imageGen.route";
import userRoute from "./routes/user.route";
import battleRoute from "./routes/battle.route";
const app = express();

// Configure CORS for Vercel deployment
app.use(
  cors({
    origin: true, // Allow all origins in production, or specify your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use("/api/quests", questRoute);
app.use("/api/generate-image", imageGenRoute);
app.use("/api/users", userRoute);
app.use("/api/battles", battleRoute);
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("✅ API Key loaded:", !!process.env.GOOGLE_API_KEY); // Debug line
  });
}

// Export for Vercel serverless
export default app;
