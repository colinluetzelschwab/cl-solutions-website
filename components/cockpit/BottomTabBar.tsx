"use client";

import { Mail, FolderKanban, Settings } from "lucide-react";

type TabId = "inbox" | "projects" | "settings";

interface BottomTabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof Mail }[] = [
  { id: "inbox", label: "Inbox", icon: Mail },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 w-full bg-background-primary/95 backdrop-blur-xl border-t border-border-subtle"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex justify-around">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center min-h-[48px] p-2 flex-1 transition-colors ${
                isActive ? "text-accent-blue" : "text-text-muted"
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[10px] mt-0.5">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
