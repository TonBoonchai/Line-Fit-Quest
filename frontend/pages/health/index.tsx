import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import { getLiffUserProfile, getUserAvatar } from "@/services/liff.service";

const HealthPage: NextPage<{ liff: Liff | null; liffError: string | null }> = ({
  liff,
}) => {
  const router = useRouter();
  const [userAvatar, setUserAvatar] = useState<string>("/img/avatar.png");

  // Fetch user profile for avatar
  useEffect(() => {
    const fetchProfile = async () => {
      if (!liff) return;
      try {
        const profile = await getLiffUserProfile(liff);
        if (profile) {
          setUserAvatar(getUserAvatar(profile));
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, [liff]);

  // Mock health data
  const healthData = {
    sleep: { status: "BAD", value: "5 hrs", target: "8 hrs" },
    strength: { status: "GOOD", value: "75%" },
    heartRate: { value: "72 bpm", normal: true },
    runningProgress: { current: 3.5, total: 10, unit: "km" },
    nutrient: {
      carbs: 45,
      protein: 30,
      fats: 25,
    },
    waterDrinking: { current: 1.5, target: 2.0, unit: "L" },
    dailyMedication: { taken: 2, total: 3 },
  };

  const runningPercent =
    (healthData.runningProgress.current / healthData.runningProgress.total) *
    100;

  return (
    <>
      <Head>
        <title>Health • Line Fit Quest</title>
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
          <h1 className="text-5xl font-extrabold tracking-widest flex-1 text-center">
            HEALTH
          </h1>
          <div className="w-12 h-12 rounded-full ring-2 ring-white overflow-hidden">
            <img
              src={userAvatar}
              alt="avatar"
              className="w-12 h-12 object-cover"
            />
          </div>
        </div>

        {/* Health Status Card */}
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <div className="bg-[#06C755] text-white text-center py-3 font-bold text-lg">
            HEALTH STATUS
          </div>
          <div className="bg-white text-black p-5 space-y-4">
            {/* Sleep */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">sleep</span>
                <span className="text-red-600 font-bold">
                  ({healthData.sleep.status})
                </span>
              </div>
              <span className="text-2xl">🌙</span>
            </div>

            {/* Strength */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">strength</span>
                <span className="text-green-600 font-bold">
                  ({healthData.strength.status})
                </span>
              </div>
              <span className="text-2xl">💪</span>
            </div>

            {/* Heart Rate */}
            <div className="flex items-center justify-between">
              <span className="font-semibold">heart rate</span>
              <span className="text-2xl">❤️‍🔥</span>
            </div>

            {/* Running Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">
                  running progress of this week
                </span>
                <span className="text-2xl">🏃</span>
              </div>
              <div className="relative w-full h-8 bg-yellow-200 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-yellow-400"
                  style={{ width: `${runningPercent}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-800">
                  {healthData.runningProgress.current} /{" "}
                  {healthData.runningProgress.total}{" "}
                  {healthData.runningProgress.unit}
                </div>
              </div>
            </div>

            {/* Nutrient */}
            <div>
              <div className="font-semibold mb-3">Nutrient</div>
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {/* Carbs - Yellow */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#FCD34D"
                      strokeWidth="20"
                      strokeDasharray={`${
                        healthData.nutrient.carbs * 2.51
                      } 251`}
                    />
                    {/* Protein - Orange */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#FB923C"
                      strokeWidth="20"
                      strokeDasharray={`${
                        healthData.nutrient.protein * 2.51
                      } 251`}
                      strokeDashoffset={-healthData.nutrient.carbs * 2.51}
                    />
                    {/* Fats - Brown */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#78350F"
                      strokeWidth="20"
                      strokeDasharray={`${healthData.nutrient.fats * 2.51} 251`}
                      strokeDashoffset={
                        -(
                          healthData.nutrient.carbs +
                          healthData.nutrient.protein
                        ) * 2.51
                      }
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Water Drinking */}
            <div className="flex items-center justify-between">
              <span className="font-semibold">water drinking</span>
              <span className="text-2xl">💧</span>
            </div>

            {/* Daily Medication */}
            <div className="flex items-center justify-between">
              <span className="font-semibold">Daily Medication</span>
              <span className="text-2xl">💊</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HealthPage;
