"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TrendingUp, GitForkIcon, Users, Star } from "lucide-react";
import {
  Label,
  Pie,
  PieChart,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { fetchRepoStats } from "@/app/actions/fetchRepoStats";
import ContributionHeatmap from "./ContributionHeatmap";
import CodeComplexityAnalysis from "./CodeComplexityAnalysis";
import PullRequestStats from "./PullRequestStats";

interface RepoStats {
  stars: number;
  forks: number;
  languages: { name: string; percentage: number }[];
  contributions: { author: string; commits: number }[];
  starsOverTime: { date: string; stars: number }[];
  forksOverTime: { date: string; forks: number }[];
  contributionHeatmap: { date: string; count: number }[];
  codeComplexity: { name: string; complexity: number }[];
  pullRequests: {
    total: number;
    open: number;
    closed: number;
    mergeTime: number;
  };
}

const languageColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function RepoStats() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("repo");
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (repoUrl) {
      setLoading(true);
      setError(null);
      fetchRepoStats(repoUrl)
        .then((data) => {
          setRepoStats(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [repoUrl]);

  if (!repoUrl) return null;
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!repoStats) return null;

  const languageChartData = repoStats.languages.map((lang, index) => ({
    name: lang.name,
    value: lang.percentage,
    fill: languageColors[index % languageColors.length],
  }));

  const languageChartConfig = repoStats.languages.reduce(
    (config, lang, index) => {
      config[lang.name] = {
        label: lang.name,
        color: languageColors[index % languageColors.length],
      };
      return config;
    },
    {} as ChartConfig
  );

  const starsChartConfig = {
    stars: {
      label: "Stars",
      color: "hsl(var(--chart-1))",
    },
  } as ChartConfig;

  const forksChartConfig = {
    forks: {
      label: "Forks",
      color: "hsl(var(--chart-2))",
    },
  } as ChartConfig;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Language Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={languageChartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={languageChartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {repoStats.languages.length}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Languages
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Star History</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={starsChartConfig}>
            <AreaChart
              data={repoStats.starsOverTime}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    year: "2-digit",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                }
              />
              <Area
                type="monotone"
                dataKey="stars"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                <Star className="h-4 w-4" />
                Total Stars: {repoStats.stars}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fork History</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={forksChartConfig}>
            <AreaChart
              data={repoStats.forksOverTime}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    year: "2-digit",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                }
              />
              <Area
                type="monotone"
                dataKey="forks"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2 text-sm">
            <GitForkIcon className="h-4 w-4" />
            Total Forks: {repoStats.forks}
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Contributors</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {repoStats.contributions.slice(0, 5).map((contributor, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{contributor.author}</span>
                <span className="font-semibold">
                  {contributor.commits} commits
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {repoStats.contributions.length} total contributors
          </div>
        </CardFooter>
      </Card>

      <ContributionHeatmap data={repoStats.contributionHeatmap} />

      <CodeComplexityAnalysis data={repoStats.codeComplexity} />

      <PullRequestStats data={repoStats.pullRequests} />
    </div>
  );
}
