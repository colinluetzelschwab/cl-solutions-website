'use client'

import { useState } from 'react'
import {
  FolderKanban,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

type DashboardView = 'overview' | 'projects' | 'briefs' | 'settings'

interface DashboardLayoutProps {
  activeView: DashboardView
  onViewChange: (view: DashboardView) => void
  onLogout: () => void
  children: React.ReactNode
}

interface SidebarLink {
  id: DashboardView
  label: string
  icon: React.ReactNode
}

const sidebarLinks: SidebarLink[] = [
  { id: 'overview', label: 'Overview', icon: <FolderKanban className="w-4 h-4" /> },
  { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
  { id: 'briefs', label: 'Briefs', icon: <FileText className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
]

export default function DashboardLayout({
  activeView,
  onViewChange,
  onLogout,
  children,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background-primary flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 bg-background-surface border-r border-border-subtle flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border-subtle">
          <span className="text-sm font-semibold text-text-primary tracking-tight">
            CL Solutions
          </span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-text-secondary hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onViewChange(link.id)
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors ${
                activeView === link.id
                  ? 'bg-accent-blue/10 text-accent-blue'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-elevated'
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-2 py-3 border-t border-border-subtle">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-background-elevated transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Sidebar backdrop (mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-border-subtle bg-background-surface">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-text-secondary hover:text-text-primary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-medium text-text-primary">
              {sidebarLinks.find((l) => l.id === activeView)?.label ?? 'Dashboard'}
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="hidden lg:flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
