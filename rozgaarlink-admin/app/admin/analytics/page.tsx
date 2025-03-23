"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

// Sample data for analytics
const userGrowthData = [
  { month: "Jan", workers: 120, employers: 80 },
  { month: "Feb", workers: 180, employers: 100 },
  { month: "Mar", workers: 150, employers: 120 },
  { month: "Apr", workers: 250, employers: 150 },
  { month: "May", workers: 300, employers: 180 },
  { month: "Jun", workers: 220, employers: 140 },
  { month: "Jul", workers: 280, employers: 160 },
  { month: "Aug", workers: 260, employers: 170 },
  { month: "Sep", workers: 310, employers: 190 },
  { month: "Oct", workers: 350, employers: 210 },
  { month: "Nov", workers: 320, employers: 200 },
  { month: "Dec", workers: 380, employers: 230 },
]

const jobsData = [
  { month: "Jan", posted: 80, filled: 65 },
  { month: "Feb", posted: 100, filled: 80 },
  { month: "Mar", posted: 120, filled: 90 },
  { month: "Apr", posted: 150, filled: 120 },
  { month: "May", posted: 180, filled: 150 },
  { month: "Jun", posted: 140, filled: 110 },
  { month: "Jul", posted: 160, filled: 130 },
  { month: "Aug", posted: 170, filled: 140 },
  { month: "Sep", posted: 190, filled: 160 },
  { month: "Oct", posted: 210, filled: 180 },
  { month: "Nov", posted: 200, filled: 170 },
  { month: "Dec", posted: 230, filled: 200 },
]

const skillsDistributionData = [
  { name: "Plumbing", value: 25 },
  { name: "Electrical", value: 20 },
  { name: "Carpentry", value: 15 },
  { name: "Painting", value: 12 },
  { name: "Cleaning", value: 10 },
  { name: "Gardening", value: 8 },
  { name: "Driving", value: 7 },
  { name: "Others", value: 3 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#6B66FF"]

const locationData = [
  { name: "Delhi", workers: 350, employers: 180, jobs: 250 },
  { name: "Mumbai", workers: 300, employers: 220, jobs: 280 },
  { name: "Bangalore", workers: 280, employers: 200, jobs: 240 },
  { name: "Chennai", workers: 220, employers: 150, jobs: 180 },
  { name: "Hyderabad", workers: 200, employers: 130, jobs: 160 },
  { name: "Kolkata", workers: 180, employers: 120, jobs: 140 },
  { name: "Pune", workers: 150, employers: 100, jobs: 120 },
  { name: "Ahmedabad", workers: 120, employers: 80, jobs: 100 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("yearly")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Platform statistics and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Last 30 Days</SelectItem>
            <SelectItem value="quarterly">Last Quarter</SelectItem>
            <SelectItem value="yearly">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Growth of workers and employers over time</CardDescription>
          </CardHeader>
          <CardContent>
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
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="workers" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="employers" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jobs Statistics</CardTitle>
            <CardDescription>Jobs posted and filled over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                posted: {
                  label: "Jobs Posted",
                  color: "hsl(var(--chart-1))",
                },
                filled: {
                  label: "Jobs Filled",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobsData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="posted" fill="var(--color-posted)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="filled" fill="var(--color-filled)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Distribution</CardTitle>
            <CardDescription>Distribution of workers by skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillsDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {skillsDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} workers`, "Count"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Analysis</CardTitle>
            <CardDescription>Distribution by location</CardDescription>
          </CardHeader>
          <CardContent>
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
                <BarChart data={locationData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="workers" fill="var(--color-workers)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="employers" fill="var(--color-employers)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="jobs" fill="var(--color-jobs)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>Comprehensive platform statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full max-w-[600px] grid-cols-3">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="space-y-4 mt-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="workers" stroke="#8884d8" strokeWidth={2} name="Workers" />
                    <Line type="monotone" dataKey="employers" stroke="#82ca9d" strokeWidth={2} name="Employers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="jobs" className="space-y-4 mt-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={jobsData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="posted" fill="#8884d8" name="Jobs Posted" />
                    <Bar dataKey="filled" fill="#82ca9d" name="Jobs Filled" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="engagement" className="space-y-4 mt-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: "Jan", applications: 150, hires: 65, ratings: 4.2 },
                      { month: "Feb", applications: 180, hires: 80, ratings: 4.3 },
                      { month: "Mar", applications: 200, hires: 90, ratings: 4.1 },
                      { month: "Apr", applications: 250, hires: 120, ratings: 4.4 },
                      { month: "May", applications: 300, hires: 150, ratings: 4.5 },
                      { month: "Jun", applications: 280, hires: 110, ratings: 4.3 },
                      { month: "Jul", applications: 320, hires: 130, ratings: 4.4 },
                      { month: "Aug", applications: 340, hires: 140, ratings: 4.6 },
                      { month: "Sep", applications: 360, hires: 160, ratings: 4.5 },
                      { month: "Oct", applications: 400, hires: 180, ratings: 4.7 },
                      { month: "Nov", applications: 380, hires: 170, ratings: 4.6 },
                      { month: "Dec", applications: 420, hires: 200, ratings: 4.8 },
                    ]}
                  >
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="applications" stroke="#8884d8" name="Applications" />
                    <Line yAxisId="left" type="monotone" dataKey="hires" stroke="#82ca9d" name="Hires" />
                    <Line yAxisId="right" type="monotone" dataKey="ratings" stroke="#ff7300" name="Avg. Rating" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

