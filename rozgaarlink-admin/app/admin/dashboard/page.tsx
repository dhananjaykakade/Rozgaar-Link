"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Briefcase,
  Building2,
  ClipboardCheck,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { DashboardChart } from "@/components/dashboard-chart";
import { PendingApprovals } from "@/components/pending-approvals";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Workers",
      value: "1,234",
      description: "Registered workers on the platform",
      icon: Users,
      change: "+12% from last month",
    },
    {
      title: "Total Employers",
      value: "567",
      description: "Registered employers on the platform",
      icon: Building2,
      change: "+8% from last month",
    },
    {
      title: "Active Jobs",
      value: "892",
      description: "Currently active job postings",
      icon: Briefcase,
      change: "+15% from last month",
    },
    {
      title: "Applications",
      value: "3,456",
      description: "Total job applications submitted",
      icon: ClipboardCheck,
      change: "+20% from last month",
    },
    {
      title: "Pending Approvals",
      value: "45",
      description: "Workers and jobs awaiting verification",
      icon: AlertTriangle,
      change: "-5% from last month",
    },
    {
      title: "Platform Growth",
      value: "18%",
      description: "Overall platform growth rate",
      icon: TrendingUp,
      change: "+3% from last month",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of RozgaarLink platform statistics and pending actions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DashboardChart />
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <PendingApprovals />
        </TabsContent>
      </Tabs>
    </div>
  );
}
