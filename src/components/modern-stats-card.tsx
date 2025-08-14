'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface ModernStatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: string
  color: string
}

export default function ModernStatsCard({ title, value, icon, trend, color }: ModernStatsCardProps) {
  const isPositiveTrend = trend?.includes('+') || trend?.includes('High') || trend?.includes('opportunity')
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-16 -mt-16`} />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${isPositiveTrend ? 'text-green-600' : 'text-gray-600'}`}>
              {isPositiveTrend ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </motion.div>
  )
}
