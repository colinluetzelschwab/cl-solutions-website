"use client";

import { useState, useEffect } from "react";
import CockpitLogin from "./CockpitLogin";
import BottomTabBar from "./BottomTabBar";
import InboxTab from "./InboxTab";
import ProjectsTab from "./ProjectsTab";
import SettingsTab from "./SettingsTab";

type TabId = "inbox" | "projects" | "settings";

export default function CockpitApp() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("inbox");

  useEffect(() => {
    fetch("/api/dashboard/projects")
      .then((res) => {
        if (res.ok) {
          setIsAuthed(true);
        }
      })
      .catch(() => {})
      .finally(() => setIsChecking(false));
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthed) {
    return <CockpitLogin onLogin={() => setIsAuthed(true)} />;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === "inbox" && <InboxTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "settings" && (
          <SettingsTab
            onLogout={() => {
              setIsAuthed(false);
              setActiveTab("inbox");
            }}
          />
        )}
      </div>
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
