"use client"

import { WorkerLayout } from "@/components/worker-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPinIcon, CalendarIcon, IndianRupeeIcon } from "lucide-react"
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
    postedAt: "2 hours ago",
    skills: ["Construction", "Labor", "Painting"],
    employer: {
      name: "ABC Construction",
      rating: 4.5,
    },
  },
  {
    id: "job2",
    title: "Plumbing Work",
    location: "Powai, Mumbai",
    wage: "₹800 per day",
    duration: "3 days",
    postedAt: "5 hours ago",
    skills: ["Plumbing", "Repair"],
    employer: {
      name: "XYZ Maintenance",
      rating: 4.2,
    },
  },
  {
    id: "job3",
    title: "Electrician Needed",
    location: "Bandra West, Mumbai",
    wage: "₹900 per day",
    duration: "2 days",
    postedAt: "1 day ago",
    skills: ["Electrical", "Wiring", "Installation"],
    employer: {
      name: "Modern Interiors",
      rating: 4.7,
    },
  },
  {
    id: "job4",
    title: "Gardening & Landscaping",
    location: "Juhu, Mumbai",
    wage: "₹550 per day",
    duration: "7 days",
    postedAt: "2 days ago",
    skills: ["Gardening", "Landscaping"],
    employer: {
      name: "Green Spaces Inc",
      rating: 4.0,
    },
  },
  {
    id: "job5",
    title: "House Painting",
    location: "Malad, Mumbai",
    wage: "₹700 per day",
    duration: "10 days",
    postedAt: "3 days ago",
    skills: ["Painting", "Interior"],
    employer: {
      name: "Color Masters",
      rating: 4.3,
    },
  },
]

export default function WorkerDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
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

  // Filter jobs based on search term and location
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesLocation = location === "" || job.location.toLowerCase().includes(location.toLowerCase())

    return matchesSearch && matchesLocation
  })

  return (
    <WorkerLayout>
      <div className="container py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Find Jobs</h1>
            <p className="text-muted-foreground">Browse jobs matching your skills and location</p>
          </div>

          {/* Search and filter */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search jobs by title or skills"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Filter by location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full"
              />
            </div>
            <Select defaultValue="recent">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="wage-high">Highest Wage</SelectItem>
                <SelectItem value="wage-low">Lowest Wage</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job tabs */}
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <JobSkeleton key={index} />
                  ))}
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <Link href={`/worker/job/${job.id}`} key={job.id} className="block">
                      <Card className="hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{job.title}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                                {job.location}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {job.postedAt}
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
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {job.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 text-sm text-muted-foreground">
                          {job.employer.name} • {job.employer.rating} ★
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No jobs found matching your criteria</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchTerm("")
                      setLocation("")
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="recommended" className="mt-4">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Complete your profile to get job recommendations</p>
                <Link href="/worker/profile">
                  <Button variant="link">Update Profile</Button>
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="nearby" className="mt-4">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Enable location to see nearby jobs</p>
                <Button variant="link">Enable Location</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </WorkerLayout>
  )
}

