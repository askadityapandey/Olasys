'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchRepoStats } from '@/app/actions/fetchRepoStats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, LineChart, PieChart } from 'recharts'

export default function RepoStats() {
  const searchParams = useSearchParams()
  const repoUrl = searchParams.get('repo')
  const [repoStats, setRepoStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (repoUrl) {
      setLoading(true)
      setError(null)
      fetchRepoStats(repoUrl)
        .then((data) => {
          setRepoStats(data)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [repoUrl])

  if (!repoUrl) return null
  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!repoStats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Stars Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={repoStats.starsOverTime}
            index="date"
            categories={['stars']}
            colors={['blue']}
            yAxisWidth={40}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Language Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart
            data={repoStats.languages}
            index="name"
            category="percentage"
            colors={['red', 'green', 'blue', 'yellow', 'purple']}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Forks</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={[{ forks: repoStats.forks }]}
            index="forks"
            categories={['forks']}
            colors={['green']}
            yAxisWidth={40}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={repoStats.contributions}
            index="author"
            categories={['commits']}
            colors={['purple']}
            yAxisWidth={40}
          />
        </CardContent>
      </Card>
    </div>
  )
}