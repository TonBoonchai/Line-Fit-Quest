import Head from "next/head";

export default function HealthPage() {
  return (
    <>
      <Head>
        <title>Health • Line Fit Quest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-black text-white px-4 pt-6 pb-24">
        <h1 className="text-2xl font-semibold">Health</h1>
        <p className="mt-2 text-sm text-gray-300">
          Template page. Add your health UI here.
        </p>

        <div className="mt-6 rounded-2xl border border-[#06C755]/60 bg-[#2B2C31] p-4">
          <p className="text-gray-200">Content block</p>
        </div>
      </div>
    </>
  );
}
