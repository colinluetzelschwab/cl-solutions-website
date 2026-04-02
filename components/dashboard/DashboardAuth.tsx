'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLogin from './DashboardLogin'
import DashboardLayout from './DashboardLayout'
import OverviewPanel from './OverviewPanel'
import ProjectsPanel from './ProjectsPanel'
import BriefsPanel from './BriefsPanel'
import SettingsPanel from './SettingsPanel'

type DashboardView = 'overview' | 'projects' | 'briefs' | 'settings'

/**
 * DashboardAuth is the top-level client component for the dashboard.
 * It checks authentication by attempting an API call — if the
 * dashboard_auth cookie is present and valid, the API returns data;
 * otherwise it returns 401 and we show the login form.
 */
export default function DashboardAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [activeView, setActiveView] = useState<DashboardView>('overview')

  useEffect(() => {
    async function checkAuth() {
      try {
        // Use the projects endpoint as an auth check — it returns 401 if not authed
        const response = await fetch('/api/dashboard/projects')
        setIsAuthenticated(response.ok)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsChecking(false)
      }
    }
    void checkAuth()
  }, [])

  const handleLogout = useCallback(async () => {
    await fetch('/api/dashboard/auth', { method: 'DELETE' })
    setIsAuthenticated(false)
  }, [])

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true)
  }, [])

  // Show nothing while checking auth to avoid flash
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-accent-blue border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <DashboardLogin onSuccess={handleLoginSuccess} />
  }

  return (
    <DashboardLayout
      activeView={activeView}
      onViewChange={setActiveView}
      onLogout={() => void handleLogout()}
    >
      {activeView === 'overview' && <OverviewPanel />}
      {activeView === 'projects' && <ProjectsPanel />}
      {activeView === 'briefs' && <BriefsPanel />}
      {activeView === 'settings' && <SettingsPanel />}
    </DashboardLayout>
  )
}
