'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface ComplexityData {
  name: string
  complexity: number
}

interface CodeComplexityAnalysisProps {
  data: ComplexityData[]
}

const CodeComplexityAnalysis: React.FC<CodeComplexityAnalysisProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Code Complexity Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No complexity data available. This could be because:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>The repository doesn't contain any JavaScript files</li>
            <li>There was an error fetching or processing the data</li>
            <li>The complexity calculation returned no results</li>
          </ul>
          <p className="mt-4">Debug info:</p>
          <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
            {JSON.stringify({ dataReceived: data }, null, 2)}
          </pre>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Code Complexity Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="complexity" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default CodeComplexityAnalysis