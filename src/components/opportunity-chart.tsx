'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface OpportunityChartProps {
  data: any[]
}

export function OpportunityChart({ data }: OpportunityChartProps) {
  // Process data for the chart
  const chartData = [
    { name: 'High (80-100)', value: data.filter(b => b.opportunityScore >= 80).length, color: '#10b981' },
    { name: 'Medium (60-79)', value: data.filter(b => b.opportunityScore >= 60 && b.opportunityScore < 80).length, color: '#f59e0b' },
    { name: 'Low (< 60)', value: data.filter(b => b.opportunityScore < 60).length, color: '#ef4444' },
  ].filter(item => item.value > 0)

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ value }) => `${value}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
