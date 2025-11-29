import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import { generateQuestApi } from "@/apis/quest.api";
import { getLiffUserProfile, getUserAvatar } from "@/services/liff.service";

type FormData = {
  age: string;
  height: string;
  weight: string;
  job: string;
  disease: string;
  help: string;
};

const NewQuestPage: NextPage<{
  liff: Liff | null;
  liffError: string | null;
}> = ({ liff }) => {
  const router = useRouter();
  const [userAvatar, setUserAvatar] = useState<string>("/img/avatar.png");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [data, setData] = useState<FormData>({
    age: "",
    height: "",
    weight: "",
    job: "",
    disease: "",
    help: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

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

  const validate = (payload: FormData) => {
    const nextErrors: Partial<Record<keyof FormData, string>> = {};
    const requiredText = (v: string) => v.trim().length === 0;
    const requiredNumber = (v: string) =>
      v.trim().length === 0 || isNaN(Number(v));

    if (requiredNumber(payload.age)) nextErrors.age = "Age is required";
    if (requiredNumber(payload.height))
      nextErrors.height = "Height is required";
    if (requiredNumber(payload.weight))
      nextErrors.weight = "Weight is required";
    if (requiredText(payload.job)) nextErrors.job = "Job is required";
    if (requiredText(payload.disease))
      nextErrors.disease = "Disease is required";
    if (requiredText(payload.help))
      nextErrors.help = "Please describe how we can help";

    return nextErrors;
  };

  const update =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      const next = { ...data, [key]: value } as FormData;
      setData(next);
      // live-validate the single field
      const fieldErrors = validate(next);
      setErrors((prev) => ({ ...prev, [key]: fieldErrors[key] }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(data);
    setErrors(nextErrors);
    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) return;

    if (!liff) {
      setErrorMessage("Unable to connect. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const profile = await getLiffUserProfile(liff);
      if (!profile) {
        setErrorMessage("Unable to get user profile. Please try again.");
        return;
      }

      // Call the generate quest API with user info
      const purposeText = `User info: Age ${data.age}, Height ${data.height}cm, Weight ${data.weight}kg, Job: ${data.job}, Health concerns: ${data.disease}, Help needed: ${data.help}`;
      const newQuest = await generateQuestApi(profile.userId, purposeText);

      setSuccessMessage(`Quest created successfully! Redirecting...`);

      // Redirect to quests page after a short delay
      setTimeout(() => {
        router.push("/quests");
      }, 2000);
    } catch (error) {
      console.error("Failed to generate quest:", error);
      setErrorMessage("Failed to create quest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>New Quest • Line Fit Quest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen text-white px-4 pt-6 pb-24 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            aria-label="Back"
            className="text-white text-2xl"
            onClick={() => router.back()}
          >
            ←
          </button>
          <h1 className="text-4xl font-extrabold tracking-widest">QUESTS</h1>
          <div className="w-10 h-10 rounded-full ring-2 ring-white overflow-hidden">
            <img
              src={userAvatar}
              alt="avatar"
              className="w-10 h-10 object-cover"
            />
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={onSubmit} className="mt-6">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 rounded-xl bg-green-500 text-white p-4 text-center font-semibold">
              ✓ {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 rounded-xl bg-red-500 text-white p-4 text-center font-semibold">
              ✗ {errorMessage}
            </div>
          )}

          <div className="rounded-3xl overflow-hidden">
            <div className="bg-[#06C755] text-white text-center py-3 font-semibold">
              INFO
            </div>
            <div className="bg-white text-black p-5 space-y-5">
              {/* age */}
              <div>
                <label className="block text-lg font-semibold mb-2">
                  age :
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={data.age}
                  onChange={update("age")}
                  className="w-full rounded-md bg-gray-300/80 h-8 px-3 outline-none"
                />
                {errors.age && (
                  <p className="mt-1 text-red-600 text-sm">{errors.age}</p>
                )}
              </div>
              {/* height */}
              <div>
                <label className="block text-lg font-semibold mb-2">
                  height:
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={data.height}
                  onChange={update("height")}
                  className="w-full rounded-md bg-gray-300/80 h-8 px-3 outline-none"
                />
                {errors.height && (
                  <p className="mt-1 text-red-600 text-sm">{errors.height}</p>
                )}
              </div>
              {/* weight */}
              <div>
                <label className="block text-lg font-semibold mb-2">
                  weight:
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={data.weight}
                  onChange={update("weight")}
                  className="w-full rounded-md bg-gray-300/80 h-8 px-3 outline-none"
                />
                {errors.weight && (
                  <p className="mt-1 text-red-600 text-sm">{errors.weight}</p>
                )}
              </div>
              {/* job */}
              <div>
                <label className="block text-lg font-semibold mb-2">job:</label>
                <input
                  type="text"
                  value={data.job}
                  onChange={update("job")}
                  className="w-full rounded-md bg-gray-300/80 h-8 px-3 outline-none"
                />
                {errors.job && (
                  <p className="mt-1 text-red-600 text-sm">{errors.job}</p>
                )}
              </div>
              {/* disease */}
              <div>
                <label className="block text-lg font-semibold mb-2">
                  disease:
                </label>
                <input
                  type="text"
                  value={data.disease}
                  onChange={update("disease")}
                  className="w-full rounded-md bg-gray-300/80 h-8 px-3 outline-none"
                />
                {errors.disease && (
                  <p className="mt-1 text-red-600 text-sm">{errors.disease}</p>
                )}
              </div>
              {/* help */}
              <div>
                <label className="block text-lg font-semibold mb-2">
                  you want us to help you to:
                </label>
                <textarea
                  value={data.help}
                  onChange={update("help")}
                  className="w-full rounded-md bg-gray-300/80 h-48 p-3 outline-none resize-none"
                />
                {errors.help && (
                  <p className="mt-1 text-red-600 text-sm">{errors.help}</p>
                )}
              </div>
              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    Object.values(errors).some(Boolean) ||
                    Object.values(data).some((v) => v.trim() === "")
                  }
                  className={`w-64 rounded-xl text-black font-bold py-3 shadow ${
                    isSubmitting ||
                    Object.values(errors).some(Boolean) ||
                    Object.values(data).some((v) => v.trim() === "")
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-400 to-amber-600"
                  }`}
                >
                  {isSubmitting ? "GENERATING..." : "+ QUEST"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewQuestPage;
