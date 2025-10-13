'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Search,
  BarChart3,
  Target,
  Megaphone,
  Calendar,
  Mail,
  Download,
  Brain,
  Settings,
  Menu,
  X,
  Home,
  Sparkles,
  Users,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and quick stats'
  },
  {
    name: 'Search',
    href: '/dashboard/search',
    icon: Search,
    description: 'Discover businesses'
  },
  {
    name: 'Lead Scoring',
    href: '/dashboard/leads',
    icon: Target,
    description: 'Score and prioritize leads'
  },
  {
    name: 'Campaigns',
    href: '/dashboard/campaigns',
    icon: Megaphone,
    description: 'Manage email campaigns'
  },
  {
    name: 'Follow-ups',
    href: '/dashboard/followups',
    icon: Calendar,
    description: 'Schedule and track follow-ups'
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Performance insights'
  },
  {
    name: 'AI Agent',
    href: '/dashboard/ai-agent',
    icon: Brain,
    description: 'AI-powered automation'
  },
  {
    name: 'Outreach',
    href: '/dashboard/outreach',
    icon: Mail,
    description: 'Email templates & outreach'
  },
  {
    name: 'Export',
    href: '/dashboard/export',
    icon: Download,
    description: 'Export data & integrations'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Account & preferences'
  }
]

export function MainNavigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation - Horizontal */}
      <nav className="hidden lg:block border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-black">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-black bg-clip-text text-transparent">
                FindWorkAI
              </span>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-1">
              {navigation.slice(0, 8).map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              {/* Settings - Separate */}
              <div className="ml-4 pl-4 border-l">
                <Link
                  href="/dashboard/settings"
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                    pathname === '/dashboard/settings'
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Link href="/pricing">
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Pricing
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-black">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-black bg-clip-text text-transparent">
                FindWorkAI
              </span>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <div className="flex-1">
                          <div>{item.name}</div>
                          <div className="text-xs opacity-60">{item.description}</div>
                        </div>
                      </Link>
                    )
                  })}

                  {/* Pricing Link */}
                  <Link
                    href="/pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <div className="flex-1">
                      <div>Pricing</div>
                      <div className="text-xs opacity-60">View plans and pricing</div>
                    </div>
                  </Link>
                </div>

                {/* Upgrade Section */}
                <div className="mt-8 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                  <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Unlock all features and get unlimited access
                  </p>
                  <Button className="w-full" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Breadcrumb for Desktop */}
      <div className="hidden lg:block border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
              {pathname !== '/dashboard' && (
                <>
                  <span>/</span>
                  <span className="text-foreground">
                    {navigation.find(item => pathname?.startsWith(item.href))?.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
