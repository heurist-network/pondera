import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import pkg from "../../../package.json";

export default function Logo() {
  return (
    <div className="flex h-14 items-center gap-2 text-2xl">
      <Image
        className="cursor-pointer"
        src="/logo.png"
        alt="logo"
        width={30}
        height={30}
      />
      <div className="flex font-extrabold text-transparent items-center cursor-pointer select-none">
        <span className="bg-clip-text animate-flow bg-logo bg-[size:400%]">
          Le-AI
        </span>
      </div>
      <Link
        className="flex"
        href={`https://docs.le-ai.app/change-log#v${pkg.version}`}
        target="_blank"
      >
        <Badge className="h-6 ml-3 cursor-pointer">v{pkg.version}</Badge>
      </Link>
    </div>
  );
}
