import React from "react";
import Navbar from "../components/Navbar";

type Props = {
  children: React.ReactNode;
};

export default function MobileLayout({ children }: Props) {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Background Image */}
      <div
        className="
          absolute inset-0
          bg-[url('/img/bg.png')] bg-cover bg-center
          opacity-40
          z-1
        "
      />
      <main className="flex-1 z-2">{children}</main>
      <Navbar />
    </div>
  );
}
