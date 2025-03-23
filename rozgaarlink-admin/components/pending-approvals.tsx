"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Eye } from "lucide-react"
import Link from "next/link"

// Sample data for pending approvals
const pendingWorkers = [
  {
    id: "w1",
    name: "Rahul Sharma",
    skills: ["Plumbing", "Electrical"],
    location: "Delhi",
    submittedAt: "2023-10-15",
  },
  {
    id: "w2",
    name: "Priya Patel",
    skills: ["Carpentry", "Painting"],
    location: "Mumbai",
    submittedAt: "2023-10-16",
  },
  {
    id: "w3",
    name: "Amit Kumar",
    skills: ["Gardening", "Cleaning"],
    location: "Bangalore",
    submittedAt: "2023-10-17",
  },
]

const pendingJobs = [
  {
    id: "j1",
    title: "Plumbing Work Needed",
    employer: "Sharma Constructions",
    location: "Delhi",
    wage: "₹500/day",
    postedAt: "2023-10-15",
  },
  {
    id: "j2",
    title: "Electrician for Office Setup",
    employer: "Tech Solutions",
    location: "Mumbai",
    wage: "₹600/day",
    postedAt: "2023-10-16",
  },
  {
    id: "j3",
    title: "Gardener for Villa",
    employer: "Green Homes",
    location: "Bangalore",
    wage: "₹450/day",
    postedAt: "2023-10-17",
  },
]

export function PendingApprovals() {
  const [workers, setWorkers] = useState(pendingWorkers)
  const [jobs, setJobs] = useState(pendingJobs)

  const handleWorkerAction = (id: string, action: "approve" | "reject") => {
    setWorkers(workers.filter((worker) => worker.id !== id))
    // In a real app, this would make an API call to update the worker status
  }

  const handleJobAction = (id: string, action: "approve" | "reject") => {
    setJobs(jobs.filter((job) => job.id !== id))
    // In a real app, this would make an API call to update the job status
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
        <CardDescription>Workers and jobs awaiting verification and approval</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="workers" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="workers">Workers ({workers.length})</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="workers" className="space-y-4 mt-4">
            {workers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No pending worker approvals</div>
            ) : (
              workers.map((worker) => (
                <div key={worker.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{worker.name}</h4>
                      <div className="flex gap-2 mt-1">
                        {worker.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {worker.location} • Submitted on {worker.submittedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/workers/${worker.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600"
                      onClick={() => handleWorkerAction(worker.id, "approve")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleWorkerAction(worker.id, "reject")}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
          <TabsContent value="jobs" className="space-y-4 mt-4">
            {jobs.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No pending job approvals</div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm">
                      {job.employer} • {job.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {job.wage} • Posted on {job.postedAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/jobs/${job.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600"
                      onClick={() => handleJobAction(job.id, "approve")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleJobAction(job.id, "reject")}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

