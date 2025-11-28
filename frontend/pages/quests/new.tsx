import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

type FormData = {
  age: string;
  height: string;
  weight: string;
  job: string;
  disease: string;
  help: string;
};

export default function NewQuestPage() {
  const router = useRouter();
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(data);
    setErrors(nextErrors);
    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) return;

    // Placeholder: send to backend later
    alert(`Submitted data:\n${JSON.stringify(data, null, 2)}`);
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
              src="/img/avatar.png"
              alt="avatar"
              className="w-10 h-10 object-cover"
            />
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={onSubmit} className="mt-6">
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
                    Object.values(errors).some(Boolean) ||
                    Object.values(data).some((v) => v.trim() === "")
                  }
                  className={`w-64 rounded-xl text-black font-bold py-3 shadow ${
                    Object.values(errors).some(Boolean) ||
                    Object.values(data).some((v) => v.trim() === "")
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-400 to-amber-600"
                  }`}
                >
                  + QUEST
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
