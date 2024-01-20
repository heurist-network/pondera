"use client";

import React from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import Locale from "@/locales";
import { useAIStore } from "@/hooks/useAI";
import { Button } from "@/components/ui/button";
import { useStore } from "@/components/menu/handler/Dropdown/apiConfigure/store";
import { cn } from "@/lib/utils";

const gradual = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};
const variantsBlur = {
  hidden: { filter: "blur(10px)", opacity: 0 },
  visible: { filter: "blur(0px)", opacity: 1 },
};
const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export default function Welcome() {
  const [openAIKey] = useAIStore((state) => [state.openai.apiKey]);
  const updateOpen = useStore((state) => state.updateOpen);

  const lists = [
    {
      label: Locale.features.feature1,
    },
    {
      label: Locale.features.feature2,
    },
    {
      label: Locale.features.feature3,
    },
    {
      label: Locale.features.feature4,
    },
    {
      label: Locale.features.feature5,
    },
    {
      label: Locale.features.feature6,
    },
    {
      label: Locale.features.feature7,
    },
    {
      label: Locale.features.feature8,
    },
  ];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMouseMove = React.useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - bounds.left);
      mouseY.set(clientY - bounds.top);
    },
    [mouseX, mouseY]
  );

  const background = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, var(--action-color) 0%, transparent 85%)`;

  if (openAIKey) return null;

  return (
    <div className="flex h-full justify-center items-center [--action-color:rgba(68,68,68,0.3)] dark:[--action-color:rgba(153,153,153,0.3)]">
      <div className="flex flex-col w-80 md:w-auto mb-[15%]">
        <div className="flex space-x-1 justify-center">
          <AnimatePresence>
            {Locale.welcome.welcome.split("").map((char, i) => (
              <motion.h1
                key={i}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={gradual}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-5xl font-bold tracking-[-0.02em] drop-shadow-sm"
              >
                {char === " " ? <span>&nbsp;</span> : char}
              </motion.h1>
            ))}
          </AnimatePresence>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.5 }}
          variants={variantsBlur}
          className="flex flex-col gap-6 font-extrabold text-transparent justify-center items-center select-none text-5xl my-6"
        >
          <span className="bg-clip-text animate-flow bg-logo bg-[size:400%]">
            Le-AI
          </span>
        </motion.div>
        <Button
          className={cn(
            "rounded-full h-12 px-7 gap-2 text-base group/action mt-6 relative",
            "bg-actionBtn hover:bg-actionBtn border border-[rgba(0,0,0,.1)] text-black",
            "dark:bg-actionBtnDark dark:hover:bg-actionBtnDark dark:border-[rgba(255,255,255,.1)] dark:text-white"
          )}
          onMouseMove={handleMouseMove}
          onClick={() => updateOpen(true)}
        >
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 rounded-full opacity-0 transition-opacity duration-500 group-hover/action:opacity-100"
            style={{ background }}
            aria-hidden="true"
          />
          {Locale.configure.clickToConfigure}
          <span className="i-mingcute-arrow-right-circle-line w-5 h-5 lg:w-6 lg:h-6 transition-transform group-hover/action:-rotate-45" />
        </Button>
        <motion.div
          className="flex flex-col gap-3 text-sm text-muted-foreground mt-10"
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {lists.map((item) => (
            <motion.div
              key={item.label}
              className="flex items-center"
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              <span className="i-mingcute-check-circle-fill mr-2 h-5 w-5 text-[#42c55e] flex-shrink-0" />
              <div>{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
