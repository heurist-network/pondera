import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Locale from "@/locales";
import { useChannelStore, type ChannelListItem } from "@/hooks/useChannel";
import { useModelCacheStore } from "@/hooks/useModelCache";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Character from "./character";
import { MODLES } from "@/lib/models";
import { cn } from "@/lib/utils";

interface ChatConfigureProps {
  list: ChannelListItem[];
  channel: ChannelListItem;
}

const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export default function ChatConfigure({ list, channel }: ChatConfigureProps) {
  const model = channel.channel_model.name;

  // hooks fn
  const updateList = useChannelStore((state) => state.updateList);
  const updateType = useModelCacheStore((state) => state.updateType);
  const updateName = useModelCacheStore((state) => state.updateName);

  const onChangeModel = (value: string) => {
    const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
    const findCh = newList.find(
      (item) => item.channel_id === channel.channel_id
    );
    if (!findCh) return;

    findCh.channel_model.name = value;

    updateType(channel.channel_model.type);
    updateName(value);
    updateList(newList);
  };

  return (
    <motion.div
      className="mt-20"
      key={channel.channel_id}
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.15 } },
      }}
    >
      <motion.div
        className="w-[32.5rem] max-w-[calc(100vw-2rem)] mx-auto"
        variants={FADE_DOWN_ANIMATION_VARIANTS}
      >
        <Card>
          <CardHeader>
            <div className="grid w-full items-center gap-4">
              <div className="flex items-center space-x-2">
                <Select
                  value={channel.channel_model.name}
                  onValueChange={onChangeModel}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODLES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full flex justify-center items-center",
                              {
                                "bg-[#5bc083]": item.value.startsWith("gpt-3"),
                                "bg-[#a26bf7]": item.value.startsWith("gpt-4"),
                                "bg-[#df6b29]": item.value.startsWith("dall"),
                              }
                            )}
                          >
                            <span className="i-ri-openai-fill text-white w-4 h-4" />
                          </div>
                          <span>{item.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
      <motion.div
        className="mx-auto w-fit my-3"
        variants={FADE_DOWN_ANIMATION_VARIANTS}
      >
        <div className="flex gap-2">
          {/* <Button className="rounded-full">
            <span className="i-mingcute-gift-line mr-2 h-4 w-4" />
            {Locale.global.premium}
          </Button> */}
          <Link href="https://docs.le-ai.app" target="_blank">
            <Button className="rounded-full" variant="outline">
              <span className="i-mingcute-document-line mr-2 h-4 w-4" />
              {Locale.global.docs}
            </Button>
          </Link>
        </div>
      </motion.div>
      {model.startsWith("gpt") && (
        <motion.div
          className="mx-auto w-fit"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Character channel={channel} />
        </motion.div>
      )}
    </motion.div>
  );
}
