import React from "react";
import { cn } from "@/lib/utils";
import Title from "./title";
import MobileMenu from "./mobileMenu";

export default function Navbar() {
  return (
    <div
      className={cn(
        "h-14 backdrop-blur shadow-sm absolute left-0 w-full z-50",
        "bg-white/80 dark:bg-gray-900/50"
      )}
    >
      <MobileMenu />
      <Title />
    </div>
  );
}
