"use client"

import { EmployerLayout } from "@/components/employer-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon, CalendarIcon, IndianRupeeIcon, Users, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { JobSkeleton } from "@/components/job-skeleton"

// Mock job data
const JOBS = [
  {
    id: "job1",
    title: "Construction Helper",
    location: "Andheri East, Mumbai",
    wage: "₹600 per day",
    duration: "15 days",
    postedAt: "2 days ago",
    status: "active",
    applicants: 12,
    views: 45,
  },
  {
    id: "job2",
    title: "Plumbing Work",
    location: "Powai, Mumbai",
    wage: "₹800 per day",
    duration: "3 days",
    postedAt: "5 days ago",
    status: "active",
    applicants: 8,
    views: 32,
  },
  {
    id: "job3",
    title: "Electrician Needed",
    location: "Bandra West, Mumbai",
    wage: "₹900 per day",
    duration: "2 days",
    postedAt: "1 week ago",
    status: "closed",
    applicants: 15,
    views: 67,
  },
]

export default function EmployerDashboard() {
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<typeof JOBS>([])

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setJobs(JOBS)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const activeJobs = jobs.filter((job) => job.status === "active")
  const closedJobs = jobs.filter((job) => job.status === "closed")

  return (
    <EmployerLayout>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs Posted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : jobs.reduce((sum, job) => sum + job.applicants, 0)}
            </div>
            <p className="text-xs text-muted-foreground">+15 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs.length}</div>
            <p className="text-xs text-muted-foreground">-1 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Jobs ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="closed">Closed Jobs ({closedJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <JobSkeleton key={index} />
                ))}
              </div>
            ) : activeJobs.length > 0 ? (
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <Card key={job.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{job.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                            {job.location}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div className="flex items-center">
                          <IndianRupeeIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{job.wage}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{job.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{job.applicants} Applicants</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{job.views} Views</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Posted {job.postedAt}</p>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-end gap-2">
                      <Link href={`/employer/job/${job.id}/applications`}>
                        <Button size="sm" variant="outline">
                          View Applicants
                        </Button>
                      </Link>
                      <Link href={`/employer/job/${job.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="text-destructive">
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Close
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">You don't have any active jobs</p>
                <Link href="/employer/job/new">
                  <Button variant="link">Post a New Job</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="closed" className="mt-4">
            {loading ? (
              <div className="space-y-4">
                <JobSkeleton />
              </div>
            ) : closedJobs.length > 0 ? (
              <div className="space-y-4">
                {closedJobs.map((job) => (
                  <Card key={job.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{job.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                            {job.location}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">Closed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div className="flex items-center">
                          <IndianRupeeIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{job.wage}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{job.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{job.applicants} Applicants</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{job.views} Views</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Posted {job.postedAt}</p>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-end gap-2">
                      <Link href={`/employer/job/${job.id}/applications`}>
                        <Button size="sm" variant="outline">
                          View Applicants
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Repost
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">You don't have any closed jobs</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </EmployerLayout>
  )
}

