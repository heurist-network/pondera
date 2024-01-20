import React from "react";
import { useDebounceFn } from "ahooks";
import Locale from "@/locales";
import { Button } from "@/components/ui/button";
import { useChannelStore, type ChannelListItem } from "@/hooks/useChannel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { characters, type Character } from "@/lib/character";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Character({ channel }: { channel: ChannelListItem }) {
  const [open, setOpen] = React.useState(false);
  const [list, setList] = React.useState<Character[]>([]);

  const updateCharacter = useChannelStore((state) => state.updateCharacter);
  const resetCharacter = useChannelStore((state) => state.resetCharacter);

  const onClose = () => setOpen(false);

  const onUse = (item: Character) => {
    updateCharacter(item);
    onClose();
  };

  const { run: onCollect } = useDebounceFn(
    (item: Character) => {
      console.log(item, "item");
    },
    { wait: 500 }
  );

  React.useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setList((characters as any)[lang] || []);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-96 max-w-[calc(100vw-2rem)] flex flex-col gap-2 h-auto py-3 relative"
          variant="outline"
        >
          <div className="absolute left-4 top-3 bg-sky-400 text-white px-2 rounded-full">
            {Locale.character["ai-character"]}
          </div>
          <div>{channel.channel_prompt_name}</div>
          <div className="text-muted-foreground text-xs">
            {channel.channel_prompt}
          </div>
          <span
            className="i-mingcute-refresh-3-fill h-4 w-4 text-sky-400 dark:text-sky-500 cursor-pointer absolute right-4 top-3"
            onClick={(e) => {
              e.preventDefault();
              resetCharacter();
            }}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[800px]">
        <DialogHeader>
          <DialogTitle>AI {Locale.character.character}</DialogTitle>
          <DialogDescription>
            {Locale.character["character-tip"]}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">{Locale.global.all}</TabsTrigger>
            <TabsTrigger value="mine">{Locale.character.mine}</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid md:grid-cols-2 gap-4 max-h-[calc(60vh)] overflow-y-auto">
              {list.map((item) => (
                <Card key={item.id} className="flex flex-col">
                  <CardHeader className="flex-1">
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {item.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex gap-2">
                    <Button onClick={() => onUse(item)}>
                      <span className="i-mingcute-arrow-right-line mr-2 h-4 w-4" />
                      {Locale.global.apply}
                    </Button>
                    <Button variant="outline" onClick={() => onCollect(item)}>
                      <span className="i-mingcute-star-line mr-2 h-4 w-4" />
                      {Locale.global.collect}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="mine">
            <div>我的模板</div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
