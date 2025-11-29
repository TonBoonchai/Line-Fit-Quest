import express from "express";
import battleService from "../services/battle.service";

const router = express.Router();

// Create new battle
router.post("/create/:lineUserId", async (req, res) => {
  const { lineUserId } = req.params;
  try {
    const battle = await battleService.createBattle(lineUserId);
    res.status(200).json({ battle });
  } catch (error) {
    console.error("Error creating battle:", error);
    res.status(500).json({ error: "Failed to create battle" });
  }
});

// Join battle by invite code
router.post("/join/:inviteCode", async (req, res) => {
  const { inviteCode } = req.params;
  const { lineUserId } = req.body;
  try {
    const battle = await battleService.joinBattle(inviteCode, lineUserId);
    res.status(200).json({ battle });
  } catch (error: any) {
    console.error("Error joining battle:", error);
    res.status(500).json({ error: error.message || "Failed to join battle" });
  }
});

// Get user's active battle
router.get("/active/:lineUserId", async (req, res) => {
  const { lineUserId } = req.params;
  try {
    const battle = await battleService.getUserActiveBattle(lineUserId);
    res.status(200).json({ battle });
  } catch (error) {
    console.error("Error fetching active battle:", error);
    res.status(500).json({ error: "Failed to fetch active battle" });
  }
});

// Get battle rankings
router.get("/rankings/:battleId", async (req, res) => {
  const { battleId } = req.params;
  try {
    const rankings = await battleService.getBattleRankings(Number(battleId));
    res.status(200).json({ rankings });
  } catch (error) {
    console.error("Error fetching rankings:", error);
    res.status(500).json({ error: "Failed to fetch rankings" });
  }
});

// Leave battle
router.post("/leave/:lineUserId/:battleId", async (req, res) => {
  const { lineUserId, battleId } = req.params;
  try {
    const result = await battleService.leaveBattle(
      lineUserId,
      Number(battleId)
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error leaving battle:", error);
    res.status(500).json({ error: "Failed to leave battle" });
  }
});

export default router;
