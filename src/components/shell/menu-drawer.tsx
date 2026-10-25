"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Icon } from "@/components/ui/icon";
import { SiteNav } from "./site-nav";
import { ThemeControl } from "./theme";

// Phones: the sidebar's contents in a left sheet. It closes once a link is followed.
export function MenuDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      title="Menu"
      trigger={
        <Button
          variant="quiet"
          icon
          aria-label="Menu"
          className="shell-menu shell-js"
        >
          <Icon name="menu" />
        </Button>
      }
    >
      <div className="shell-drawer">
        <SiteNav onNavigate={() => setOpen(false)} />
        <ThemeControl />
      </div>
    </Drawer>
  );
}
