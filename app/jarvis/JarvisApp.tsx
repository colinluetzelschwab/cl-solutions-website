"use client";

import { C } from "./lib/constants";
import { useTab, useAuth, useActiveBuild, useIsDesktop } from "./lib/hooks";
import LoginView from "./components/LoginView";
import BriefsTab from "./components/BriefsTab";
import LiveTab from "./components/LiveTab";
import SystemsTab from "./components/SystemsTab";
import SettingsTab from "./components/SettingsTab";
import { HudHeader, HudTabBar, HudSidebar } from "./components/HudElements";

export default function JarvisApp() {
  const { authed, checking, login, logout } = useAuth();
  const [tab, setTab] = useTab("briefs");
  const { build } = useActiveBuild();
  const isDesktop = useIsDesktop();

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xs lg:text-sm tracking-wider" style={{ color: `${C.primary}35` }}>CONNECTING...</span>
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
    </>
  );

  // Desktop: sidebar layout
  if (isDesktop) {
    return (
      <div className="flex h-screen hud-scanline">
        <HudSidebar active={tab} onChange={setTab} hasLiveDot={hasActiveBuild} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <HudHeader hasActiveBuild={hasActiveBuild} />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {content}
          </main>
        </div>
      </div>
    );
  }

  // Mobile: bottom tab bar
  return (
    <div className="min-h-screen flex flex-col hud-scanline"
      style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <HudHeader hasActiveBuild={hasActiveBuild} />
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {content}
      </main>
      <HudTabBar active={tab} onChange={setTab} hasLiveDot={hasActiveBuild} />
    </div>
  );
}
