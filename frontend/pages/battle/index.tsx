import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import { getLiffUserProfile, getUserAvatar } from "@/services/liff.service";
import { joinBattleApi } from "@/apis/battle.api";
import {
  createBattleApi,
  getActiveBattleApi,
  getBattleRankingsApi,
  leaveBattleApi,
  type Battle,
  type BattleRanking,
} from "@/apis/battle.api";

const BattlePage: NextPage<{ liff: Liff | null; liffError: string | null }> = ({
  liff,
}) => {
  const router = useRouter();
  const [userAvatar, setUserAvatar] = useState<string>("/img/avatar.png");
  const [userLineId, setUserLineId] = useState<string>("");
  const [activeBattle, setActiveBattle] = useState<Battle | null>(null);
  const [rankings, setRankings] = useState<BattleRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  // Fetch user profile and active battle
  useEffect(() => {
    const fetchData = async () => {
      if (!liff) return;
      try {
        const profile = await getLiffUserProfile(liff);
        if (profile) {
          setUserAvatar(getUserAvatar(profile));
          setUserLineId(profile.userId);

          // Check for active battle
          const battle = await getActiveBattleApi(profile.userId);
          setActiveBattle(battle);

          if (battle) {
            // Fetch rankings
            const battleRankings = await getBattleRankingsApi(battle.id);
            setRankings(battleRankings);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [liff]);

  // Check for invite code in URL
  useEffect(() => {
    const { inviteCode } = router.query;
    if (inviteCode && userLineId && !activeBattle && !loading) {
      handleJoinBattle(inviteCode as string);
    }
  }, [router.query, userLineId, activeBattle, loading]);

  const handleCreateBattle = async () => {
    if (!userLineId) return;
    try {
      const battle = await createBattleApi(userLineId);
      setActiveBattle(battle);
      const battleRankings = await getBattleRankingsApi(battle.id);
      setRankings(battleRankings);
    } catch (error) {
      console.error("Failed to create battle:", error);
      alert("Failed to create battle");
    }
  };

  const handleJoinBattle = async (inviteCode: string) => {
    if (!userLineId) return;
    try {
      const battle = await joinBattleApi(inviteCode, userLineId);
      setActiveBattle(battle);
      const battleRankings = await getBattleRankingsApi(battle.id);
      setRankings(battleRankings);
      router.replace("/battle", undefined, { shallow: true });
    } catch (error: any) {
      console.error("Failed to join battle:", error);
      alert(error.response?.data?.error || "Failed to join battle");
    }
  };

  const handleInviteFriends = async () => {
    if (!liff || !activeBattle) return;
    try {
      const inviteUrl = `${window.location.origin}/battle?inviteCode=${activeBattle.inviteCode}`;
      await liff.shareTargetPicker([
        {
          type: "text",
          text: `Join my fitness battle! Let's compete for 7 days!\n${inviteUrl}`,
        },
      ]);
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  const handleLeaveBattle = async () => {
    if (!userLineId || !activeBattle) return;
    try {
      await leaveBattleApi(userLineId, activeBattle.id);
      setActiveBattle(null);
      setRankings([]);
      setShowConfirmLeave(false);
    } catch (error) {
      console.error("Failed to leave battle:", error);
      alert("Failed to leave battle");
    }
  };

  const getDaysRemaining = () => {
    if (!activeBattle) return 0;
    const end = new Date(activeBattle.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      <Head>
        <title>Battle • Line Fit Quest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen text-white px-4 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            aria-label="Back"
            className="text-white text-2xl"
            onClick={() => router.back()}
          >
            ←
          </button>
          <div className="w-10 h-10 rounded-full ring-2 ring-white overflow-hidden">
            <img
              src={userAvatar}
              alt="avatar"
              className="w-10 h-10 object-cover"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : !activeBattle ? (
          /* No Active Battle - Show Create Button */
          <div className="bg-[#2B2828]/80 px-5 py-8 rounded-3xl text-center">
            <h1 className="text-3xl font-bold mb-4">Ready to Battle?</h1>
            <p className="text-gray-300 mb-6">
              Create a new battle and invite your friends to compete for 7 days!
            </p>
            <button
              onClick={handleCreateBattle}
              className="bg-[#06C755] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-[#05b84b] transition"
            >
              Create New Battle
            </button>
          </div>
        ) : (
          /* Active Battle - Show Rankings */
          <>
            <div className="bg-[#2B2828]/80 px-5 py-4 rounded-3xl">
              {/* Title */}
              <h1 className="text-3xl font-bold mb-2 text-center">
                Now in progress
              </h1>
              <p className="text-center text-gray-300 text-sm mb-4">
                {getDaysRemaining()} days remaining
              </p>

              {/* Battle Rankings */}
              <div className="space-y-3 mb-6">
                {rankings.map((user, index) => (
                  <div
                    key={user.userId}
                    className="bg-white rounded-full flex items-center px-4 py-3 shadow-lg"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-300">
                      {user.pictureUrl ? (
                        <img
                          src={user.pictureUrl}
                          alt={user.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <span className="font-bold text-black text-lg flex-1">
                      {user.displayName}
                    </span>
                    <span
                      className={`font-bold text-lg pr-4 ${
                        index === 0 ? "text-[#D40A0A]" : "text-black"
                      }`}
                    >
                      +{user.expGained} exp
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Text */}
              <p className="text-center text-white text-sm">
                Battle ends on{" "}
                {new Date(activeBattle.endDate).toLocaleDateString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={handleInviteFriends}
                className="bg-white text-[#06C755] font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-gray-100 transition"
              >
                <span className="text-xl">✉️</span>
                <span>Invite friends</span>
              </button>
              <button
                onClick={() => setShowConfirmLeave(true)}
                className="bg-red-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-red-600 transition"
              >
                Leave Battle
              </button>
            </div>
          </>
        )}

        {/* Confirm Leave Modal */}
        {showConfirmLeave && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h2 className="text-xl font-bold text-black mb-2">
                Leave Battle?
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to leave this battle? You won't be able to
                rejoin.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmLeave(false)}
                  className="flex-1 bg-gray-200 text-black font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeaveBattle}
                  className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BattlePage;
