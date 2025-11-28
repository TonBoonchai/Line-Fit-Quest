import React from "react";
import Navbar from "../components/Navbar";

type Props = {
  children: React.ReactNode;
};

export default function MobileLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-24 px-4 pt-6">{children}</main>
      <Navbar />
    </div>
  );
}
