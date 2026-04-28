"use client";

import { useTab, useAuth, useActiveBuild, useIsDesktop, useInbox, useCommandBar } from "./lib/hooks";
import LoginView from "./components/LoginView";
import TodayTab from "./components/TodayTab";
import DealsTab from "./components/DealsTab";
import InboxTab from "./components/InboxTab";
import AgentsTab from "./components/AgentsTab";
import OpsTab from "./components/OpsTab";
import MoneyTab from "./components/MoneyTab";
import ConfigTab from "./components/ConfigTab";
import CommandBar from "./components/CommandBar";
import { HudHeader, HudTabBar, HudSidebar } from "./components/HudElements";

export default function JarvisApp() {
  const { authed, checking, login, logout } = useAuth();
  const [surface, setSurface] = useTab("today");
  const { build } = useActiveBuild();
  const isDesktop = useIsDesktop();
  const { unread } = useInbox();
  const cmd = useCommandBar();

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
      {surface === "today"  && <TodayTab onNavigate={setSurface} />}
      {surface === "deals"  && <DealsTab />}
      {surface === "inbox"  && <InboxTab />}
      {surface === "agents" && <AgentsTab />}
      {surface === "ops"    && <OpsTab />}
      {surface === "money"  && <MoneyTab />}
      {surface === "config" && <ConfigTab onLogout={logout} />}
    </>
  );

  if (isDesktop) {
    return (
      <>
        <div className="flex h-screen">
          <HudSidebar
            active={surface}
            onChange={setSurface}
            hasLiveDot={hasActiveBuild}
            unreadInbox={unread}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <HudHeader
              hasActiveBuild={hasActiveBuild}
              unreadInbox={unread}
              onCommandBar={cmd.toggle}
            />
            <main className="flex-1 overflow-y-auto px-8 py-8 lg:px-12 lg:py-10">
              <div className="max-w-[1600px] mx-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
        <CommandBar
          open={cmd.open}
          setOpen={cmd.setOpen}
          surface={surface}
          onNavigate={setSurface}
        />
      </>
    );
  }

  // Mobile: bottom tab bar + FAB for ⌘K
  return (
    <>
      <div className="min-h-screen flex flex-col" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <HudHeader hasActiveBuild={hasActiveBuild} unreadInbox={unread} />
        <main className="flex-1 overflow-y-auto px-5 pt-5 pb-24">
          {content}
        </main>
        <HudTabBar
          active={surface}
          onChange={setSurface}
          hasLiveDot={hasActiveBuild}
          unreadInbox={unread}
        />
      </div>

      {/* Mobile FAB → ⌘K */}
      <button
        onClick={cmd.toggle}
        className="md:hidden fixed bottom-[88px] right-5 z-40 w-14 h-14 rounded-full text-[24px] font-semibold flex items-center justify-center"
        style={{
          background: "var(--jarvis-accent)",
          color: "#fff",
          boxShadow: "0 8px 24px rgba(220, 34, 34, 0.4)",
        }}
        aria-label="Open command palette"
      >
        +
      </button>

      <CommandBar
        open={cmd.open}
        setOpen={cmd.setOpen}
        surface={surface}
        onNavigate={setSurface}
      />
    </>
  );
}
