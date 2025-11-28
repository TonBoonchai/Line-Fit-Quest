import express, { Request, Response, NextFunction } from "express";
import googleGemini from "../services/googleGemini.service";
const router = express.Router();

router.post("/", async (req, res) => {
  const { userId } = req.body;
  try {
    const response = await googleGemini.generateImage("10-year-old");
    res.status(200).json({ imageUrl: response });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate image" });
  }
});

export default router;
