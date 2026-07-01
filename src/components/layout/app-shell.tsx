"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { AiAssistant } from "@/components/ai/ai-assistant";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full max-w-full">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobile={() => setMobileOpen(true)} onOpenAi={() => setAiOpen(true)} />
        <main className="min-w-0 flex-1 bg-canvas px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <AiAssistant open={aiOpen} onOpenChange={setAiOpen} />
    </div>
  );
}
