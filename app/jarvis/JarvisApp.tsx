"use client";

import { C } from "./lib/constants";
import { useTab, useAuth, useActiveBuild, useIsDesktop } from "./lib/hooks";
import LoginView from "./components/LoginView";
import BriefsTab from "./components/BriefsTab";
import LiveTab from "./components/LiveTab";
import SystemsTab from "./components/SystemsTab";
import SettingsTab from "./components/SettingsTab";
import PipelineTab from "./components/PipelineTab";
import MoneyTab from "./components/MoneyTab";
import ActionsTab from "./components/ActionsTab";
import { HudHeader, HudTabBar, HudSidebar } from "./components/HudElements";

export default function JarvisApp() {
  const { authed, checking, login, logout } = useAuth();
  // Default landing tab is Actions (the "what should I do today?" view).
  const [tab, setTab] = useTab("actions");
  const { build } = useActiveBuild();
  const isDesktop = useIsDesktop();

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-sm" style={{ color: "var(--jarvis-text-muted)" }}>Connecting…</span>
      </div>
    );
  }

  if (!authed) {
    return <LoginView onAuth={login} />;
  }

  const hasActiveBuild = !!build;

  const content = (
    <>
      {tab === "briefs" && (
        <BriefsTab onBuildStarted={() => setTab("live")} />
      )}
      {tab === "live" && <LiveTab />}
      {tab === "systems" && <SystemsTab />}
      {tab === "settings" && <SettingsTab onLogout={logout} />}
      {tab === "pipeline" && <PipelineTab />}
      {tab === "money" && <MoneyTab />}
      {tab === "actions" && (
        <ActionsTab onNavigate={({ tab: target }) => setTab(target)} />
      )}
    </>
  );

  // Desktop: sidebar layout
  if (isDesktop) {
    return (
      <div className="flex h-screen">
        <HudSidebar active={tab} onChange={setTab} hasLiveDot={hasActiveBuild} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <HudHeader hasActiveBuild={hasActiveBuild} />
          <main className="flex-1 overflow-y-auto px-8 py-8 lg:px-12 lg:py-10">
            <div className="max-w-[1600px] mx-auto">
              {content}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Mobile: bottom tab bar
  return (
    <div className="min-h-screen flex flex-col" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <HudHeader hasActiveBuild={hasActiveBuild} />
      <main className="flex-1 overflow-y-auto px-5 pt-5 pb-24">
        {content}
      </main>
      <HudTabBar active={tab} onChange={setTab} hasLiveDot={hasActiveBuild} />
    </div>
  );
}
