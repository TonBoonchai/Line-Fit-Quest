import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { text } from "stream/consumers";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const IconHome = (
  <svg
    className="text-white"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 10.5L12 4L21 10.5V20C21 20.8284 20.3284 21.5 19.5 21.5H4.5C3.67157 21.5 3 20.8284 3 20V10.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 21.5V12.5H15V21.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconHealth = (
  <svg
    className="text-white"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 21s-6-4.35-8.5-7.5C1.5 11.3 2 8 5 7c2-.7 3.5.5 4.5 1.8C10.5 7.5 12 6.3 14 7c3 .9 3.5 4.3 1.5 6.5C18 16.65 12 21 12 21z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconBattle = (
  <svg
    className="text-white"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 20L10 14M14 10L20 4M10 10L4 4M20 20L14 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPrize = (
  <svg
    className="text-white"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
    <path
      d="M8 14h8l-2 6H10l-2-6z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const items: NavItem[] = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/health", label: "Health", icon: IconHealth },
  { href: "/battle", label: "Battle", icon: IconBattle },
  { href: "/exchange", label: "Exchange", icon: IconPrize },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav
      role="navigation"
      aria-label="Bottom Navigation"
      className="fixed left-1/2 -translate-x-1/2 bottom-5 z-50 w-[90%] grid grid-cols-4 items-center bg-[#2B2C31] border-3 border-[#06C755] pb-[calc(10px+var(--safe-bottom))] p-2 md:max-w-[600px] md:mx-auto md:border-x-2 md:rounded-b-[20px] rounded-full"
    >
      {items.map((item) => {
        const active = router.pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center justify-center text-center gap-1 text-white no-underline py-2 px-1 min-h-14 rounded-full ${
              active ? "bg-[#000000] " : ""
            }`}
          >
            <span className="[&>svg]:size-6" aria-hidden>
              {item.icon}
            </span>
            <span
              className={`text-[12px] tracking-[0.2px] ${
                active ? "text-[#06C755]" : "text-white"
              }`}
            >
              {item.label}
            </span>
            {/* <p>Hello</p> */}
          </Link>
        );
      })}
    </nav>
  );
}
