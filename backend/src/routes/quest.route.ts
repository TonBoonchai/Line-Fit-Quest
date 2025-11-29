import express, { Request, Response, NextFunction } from "express";
import questService from "../services/quest.service";
import userService from "../services/user.service";
const router = express.Router();

// More specific routes first to prevent conflicts
router.get("/today/:lineUserId", async (req, res) => {
  const { lineUserId } = req.params;
  try {
    const user = await userService.getUserByLineId(lineUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const stats = await questService.getTodayQuestStats(user.id);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch today's quest stats" });
  }
});

router.put("/update/:questId", async (req, res) => {
  const { questId } = req.params;
  const updates = req.body.updates || req.body;
  try {
    const quest = await questService.updateQuest(
      Number(questId),
      Number(updates)
    );
    res.status(200).json({ quest });
  } catch (error) {
    console.error("Update quest error:", error);
    res.status(500).json({ error: "Failed to update quest" });
  }
});

router.post("/complete/:questId", async (req, res) => {
  const { questId } = req.params;
  try {
    const quest = await questService.completeQuest(Number(questId));
    res.status(200).json({ quest });
  } catch (error) {
    res.status(500).json({ error: "Failed to complete quest" });
  }
});

router.post("/:lineUserId", async (req, res) => {
  const { lineUserId } = req.params;
  const { purpose } = req.body || {};
  try {
    console.log(lineUserId);
    const user = await userService.getUserByLineId(lineUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const quest = await questService.generateQuest(user.id, purpose || "");
    res.status(200).json({ quest });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate quest" });
  }
});

router.get("/:lineUserId", async (req, res) => {
  const { lineUserId } = req.params;
  try {
    const user = await userService.getUserByLineId(lineUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const quests = await questService.getUserQuests(user.id);
    res.status(200).json({ quests });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quests" });
  }
});

export default router;
