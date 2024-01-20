"use client";

require("@/lib/polyfill");

import React from "react";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import Enviroment from "@/components/providers/enviroment";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState<string>("en");

  React.useEffect(() => {
    const locale = localStorage.getItem("lang") || "en";
    setLocale(locale);
  }, []);

  return (
    <NextIntlClientProvider locale={locale} timeZone="Asia/Shanghai">
      <ThemeProvider attribute="class">
        <Enviroment>{children}</Enviroment>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
