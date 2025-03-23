"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for the charts
const weeklyData = [
  { name: "Mon", workers: 12, employers: 8, jobs: 15 },
  { name: "Tue", workers: 18, employers: 10, jobs: 22 },
  { name: "Wed", workers: 15, employers: 12, jobs: 18 },
  { name: "Thu", workers: 25, employers: 15, jobs: 27 },
  { name: "Fri", workers: 30, employers: 18, jobs: 32 },
  { name: "Sat", workers: 22, employers: 14, jobs: 20 },
  { name: "Sun", workers: 10, employers: 6, jobs: 12 },
]

const monthlyData = [
  { name: "Jan", workers: 120, employers: 80, jobs: 150 },
  { name: "Feb", workers: 180, employers: 100, jobs: 220 },
  { name: "Mar", workers: 150, employers: 120, jobs: 180 },
  { name: "Apr", workers: 250, employers: 150, jobs: 270 },
  { name: "May", workers: 300, employers: 180, jobs: 320 },
  { name: "Jun", workers: 220, employers: 140, jobs: 200 },
  { name: "Jul", workers: 280, employers: 160, jobs: 240 },
  { name: "Aug", workers: 260, employers: 170, jobs: 230 },
  { name: "Sep", workers: 310, employers: 190, jobs: 280 },
  { name: "Oct", workers: 350, employers: 210, jobs: 350 },
  { name: "Nov", workers: 320, employers: 200, jobs: 310 },
  { name: "Dec", workers: 380, employers: 230, jobs: 370 },
]

export function DashboardChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Growth</CardTitle>
        <CardDescription>Track the growth of workers, employers, and jobs on the platform</CardDescription>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly">
            <ChartContainer
              config={{
                workers: {
                  label: "Workers",
                  color: "hsl(var(--chart-1))",
                },
                employers: {
                  label: "Employers",
                  color: "hsl(var(--chart-2))",
                },
                jobs: {
                  label: "Jobs",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="workers" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="employers" strokeWidth={2} />
                  <Line type="monotone" dataKey="jobs" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="monthly">
            <ChartContainer
              config={{
                workers: {
                  label: "Workers",
                  color: "hsl(var(--chart-1))",
                },
                employers: {
                  label: "Employers",
                  color: "hsl(var(--chart-2))",
                },
                jobs: {
                  label: "Jobs",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="workers" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="employers" strokeWidth={2} />
                  <Line type="monotone" dataKey="jobs" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          The chart shows the growth trends of workers, employers, and jobs on the RozgaarLink platform.
        </div>
      </CardContent>
    </Card>
  )
}

