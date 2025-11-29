import express, { Request, Response, NextFunction } from "express";
import questService from "../services/quest.service";
const router = express.Router();

router.post("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { purpose } = req.body;
  try {
    const quest = await questService.generateQuest(1, purpose);
    res.status(200).json({ quest });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate quest" });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const quests = await questService.getUserQuests(1);
    res.status(200).json({ quests });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quests" });
  }
});

router.put("/update/:questId", async (req, res) => {
  const { questId } = req.params;
  const updates = req.body;
  try {
    const quest = await questService.updateQuest(Number(questId), updates);
    res.status(200).json({ quest });
  } catch (error) {
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

export default router;
