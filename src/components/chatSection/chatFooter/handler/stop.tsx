import React from "react";
import { Button } from "@/components/ui/button";
import Locale from "@/locales";

export default function Stop({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex justify-between items-center mb-1.5">
      <Button
        className="rounded-full w-7 lg:w-auto lg:px-[10px] h-7 text-xs"
        size="icon"
        variant="destructive"
        onClick={onCancel}
      >
        <span className="i-mingcute-stop-fill h-4 w-4" />
        <span className="hidden lg:inline-block ml-1.5">
          {Locale.global.stop}
        </span>
      </Button>
    </div>
  );
}
