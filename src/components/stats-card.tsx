import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number | string
  icon: ReactNode
  trend?: string
  trendUp?: boolean
}

export function StatsCard({ title, value, icon, trend, trendUp }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center text-gray-500 mb-2">
            {icon}
            <span className="ml-2 text-sm font-medium">{title}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {trend && (
            <div className="flex items-center mt-2">
              {trendUp ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trend}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
