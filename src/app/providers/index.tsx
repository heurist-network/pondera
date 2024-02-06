"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { ZunstandProvider } from "./zustand";

export function Provider({ children }: ThemeProviderProps) {
  return (
    <ZunstandProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </NextThemesProvider>
    </ZunstandProvider>
  );
}
