"use client";

import React from "react";
import { useChannelStore } from "@/hooks/useChannel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Menu from "@/components/menu";

export default function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  const activeId = useChannelStore((state) => state.activeId);

  React.useEffect(() => {
    setOpen(false);
  }, [activeId]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="absolute rounded-full w-8 h-8 top-3 left-4 md:hidden"
          size="icon"
          variant="outline"
        >
          <span className="i-ri-menu-unfold-line" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 md:hidden">
        <Menu className="flex h-full" />
      </SheetContent>
    </Sheet>
  );
}
