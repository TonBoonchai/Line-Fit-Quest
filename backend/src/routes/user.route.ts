import express, { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
import UserService from "../services/user.service";
const router = express.Router();

router.post("/init", async (req, res) => {
  try {
    const { lineUserId, displayName, pictureUrl } = req.body;

    if (!lineUserId || !displayName) {
      return res
        .status(400)
        .json({ error: "lineUserId and displayName are required" });
    }

    const user = await UserService.findOrCreateUser(
      lineUserId,
      displayName,
      pictureUrl
    );
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error initializing user:", error);
    res.status(500).json({ error: "Failed to initialize user" });
  }
});

router.get("/:lineUserId", async (req, res) => {
  try {
    const { lineUserId } = req.params;
    const user = await UserService.getUserByLineId(lineUserId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

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

export default router;
