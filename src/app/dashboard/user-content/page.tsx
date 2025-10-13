'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FolderOpen,
  Globe,
  FileText,
  TrendingUp,
  Clock,
  Star,
  Search,
  Filter,
  Plus,
  LayoutDashboard,
  History
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserContentHistory } from '@/components/user/UserContentHistory'
import Link from 'next/link'

export default function UserContentPage() {
  const [activeTab, setActiveTab] = useState('content')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Your Content</h1>
                <p className="text-sm text-gray-500">Manage all your generated content</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/search">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
              <Link href="/dashboard/search">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Build Website</h3>
                      <p className="text-sm text-gray-600">Create a new AI-generated website</p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
              <Link href="/dashboard/search">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Generate Content</h3>
                      <p className="text-sm text-gray-600">Create marketing copy and content</p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
              <Link href="/dashboard/search">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Marketing Kit</h3>
                      <p className="text-sm text-gray-600">Build marketing campaigns</p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </motion.div>
        </div>

        {/* User Content History */}
        <UserContentHistory />
      </main>
    </div>
  )
}