"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

interface PullRequestStatsProps {
  data: {
    total: number;
    open: number;
    closed: number;
    mergeTime: number;
  };
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

const PullRequestStats: React.FC<PullRequestStatsProps> = ({ data }) => {
  const pieData = [
    { name: "Open", value: data.open },
    { name: "Closed", value: data.closed },
  ];

  const barData = [{ name: "Average Merge Time", hours: data.mergeTime }];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Pull Request Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">PR Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Average Merge Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="hsl(var(--chart-3))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="col-span-2 text-center">
          <p className="text-2xl font-bold">{data.total}</p>
          <p className="text-sm text-muted-foreground">Total Pull Requests</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PullRequestStats;
