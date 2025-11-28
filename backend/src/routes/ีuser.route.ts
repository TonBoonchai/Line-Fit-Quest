import express, { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
import UserService from "../services/user.service";
const router = express.Router();

router.post("/api/verify-token", async (req, res) => {
  try {
    const { token } = req.body;

    // Verify with LINE API
    const response = await fetch(
      `https://api.line.me/oauth2/v2.1/verify?access_token=${token}`
    );

    const data = await response.json();

    // Return sanitized data to frontend
    res.json({ valid: true, data });
  } catch (error) {
    res.status(401).json({ valid: false, error: "Invalid token" });
  }
});
