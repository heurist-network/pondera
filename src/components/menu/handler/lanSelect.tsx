"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Locale, { ALL_LOCALES_OPTIONS, getLang, type LOCALE } from "@/locales";

export default function LanSelect() {
  const [lang, setLang] = React.useState<LOCALE>();

  const onValueChange = (value: string) => {
    if (lang === value) return;
    setLang(value as LOCALE);
    localStorage.setItem("lang", value);
    location.reload();
  };

  React.useEffect(() => {
    setLang(getLang());
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <span className="i-mingcute-translate-2-line h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <span className="i-ri-global-line h-4 w-4" />
            {Locale.global.language}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={lang} onValueChange={onValueChange}>
          {Object.entries(ALL_LOCALES_OPTIONS).map(([key, value]) => (
            <DropdownMenuRadioItem key={key} value={key}>
              {value}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
