'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Search, Target, Send, Mail, Calendar, BarChart3, Brain,
  Settings, LogOut, Menu, X, Home, Sparkles, Bell, User,
  FileDown, Filter, Zap, ChevronDown, Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/hooks/use-auth'
import { Skeleton } from '@/components/ui/skeleton'
import { Footer } from './Footer'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string | number
  description?: string
}

// Split navigation into logical groups for better organization
const mainNavigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and metrics'
  },
  {
    title: 'Search Leads',
    href: '/dashboard/search',
    icon: Search,
    description: 'Find new businesses'
  },
  {
    title: 'Lead Scoring',
    href: '/dashboard/leads',
    icon: Target,
    badge: 'HOT',
    description: 'Score and prioritize leads'
  },
  {
    title: 'Campaigns',
    href: '/dashboard/campaigns',
    icon: Send,
    description: 'Manage email campaigns'
  },
  {
    title: 'Email Outreach',
    href: '/dashboard/outreach',
    icon: Mail,
    description: 'Generate and send emails'
  },
  {
    title: 'Follow-ups',
    href: '/dashboard/followups',
    icon: Calendar,
    badge: '3',
    description: 'Manage follow-up sequences'
  },
]

const analyticsNavigation: NavItem[] = [
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Performance insights'
  },
  {
    title: 'AI Analysis',
    href: '/dashboard/analysis',
    icon: Brain,
    description: 'AI-powered insights'
  },
  {
    title: 'AI Agents',
    href: '/dashboard/ai-agents',
    icon: Sparkles,
    badge: 'NEW',
    description: 'Autonomous builders'
  },
]

const toolsNavigation: NavItem[] = [
  {
    title: 'Export & Sync',
    href: '/dashboard/export',
    icon: FileDown,
    description: 'Export data and CRM sync'
  },
  {
    title: 'Advanced Search',
    href: '/dashboard/advanced-search',
    icon: Filter,
    description: 'Filters and saved searches'
  },
  {
    title: 'Bulk Operations',
    href: '/dashboard/bulk',
    icon: Zap,
    description: 'Bulk actions on leads'
  },
]

const accountNavigation: NavItem[] = [
  {
    title: 'Pricing Plans',
    href: '/pricing',
    icon: Users,
    description: 'View pricing and upgrade',
    badge: 'PRO'
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()
  const [notifications] = useState(3) // TODO: Connect to real notifications API

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/')
  }

  // Combine all navigation items
  const allNavigation = [...mainNavigation, ...analyticsNavigation, ...toolsNavigation, ...accountNavigation]

  // Show loading state while auth is loading
  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <aside className="w-64 bg-card border-r">
          <div className="p-6">
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="space-y-2 px-3">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </aside>
        <div className="flex-1">
          <header className="h-16 border-b bg-card px-6 flex items-center">
            <Skeleton className="h-6 w-32" />
          </header>
          <main className="p-6">
            <Skeleton className="h-64 w-full" />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200
          lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">FindWorkAI</span>
                <span className="text-xs text-muted-foreground">by Pheelymon</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {allNavigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg transition-colors
                      ${active 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{item.title}</span>
                        {item.description && (
                          <span className="text-xs opacity-70">{item.description}</span>
                        )}
                      </div>
                    </div>
                    {item.badge && (
                      <Badge variant={active ? "secondary" : "default"} className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings/billing">
                    <Users className="mr-2 h-4 w-4" />
                    Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">
              {allNavigation.find(item => isActive(item.href))?.title || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">3 new hot leads found</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Campaign "Summer Sale" completed</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Weekly report ready</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center">
                  <span className="text-sm text-primary">View all notifications</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick actions */}
            <Button size="sm" className="hidden sm:flex">
              <Search className="mr-2 h-4 w-4" />
              Quick Search
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
