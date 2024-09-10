'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ContributionDay {
  date: string
  count: number
}

interface ContributionHeatmapProps {
  data: ContributionDay[]
}

const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ data }) => {
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100'
    if (count < 5) return 'bg-green-200'
    if (count < 10) return 'bg-green-300'
    if (count < 15) return 'bg-green-400'
    return 'bg-green-500'
  }

  const weeks = data.reduce((acc, day) => {
    const weekIndex = Math.floor(new Date(day.date).getTime() / (7 * 24 * 60 * 60 * 1000))
    if (!acc[weekIndex]) acc[weekIndex] = []
    acc[weekIndex].push(day)
    return acc
  }, {} as Record<number, ContributionDay[]>)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {Object.values(weeks).map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-3 h-3 ${getColor(day.count)}`}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ContributionHeatmap