"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, MapPin, Clock, Briefcase, Building2, CheckCircle, XCircle, Users, User } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Sample job data
const jobData = {
  id: "j1",
  title: "Plumbing Work Needed",
  employer: {
    id: "e1",
    name: "Sharma Constructions",
    rating: 4.8,
    jobsPosted: 15,
    verified: true,
  },
  location: "Delhi, India",
  wage: "₹500/day",
  duration: "3 days",
  status: "Pending",
  postedAt: "15 Oct 2023",
  applications: 5,
  description:
    "We need an experienced plumber to fix leaking pipes and install new bathroom fixtures in a residential building. The work is expected to take 3 days to complete. All tools and materials will be provided.",
  requirements: [
    "At least 2 years of experience in plumbing",
    "Knowledge of modern plumbing techniques",
    "Ability to work independently",
    "Must bring basic tools",
  ],
  applicants: [
    {
      id: "w1",
      name: "Rahul Sharma",
      skills: ["Plumbing", "Electrical"],
      rating: 4.5,
      applied: "16 Oct 2023",
    },
    {
      id: "w2",
      name: "Amit Kumar",
      skills: ["Plumbing"],
      rating: 4.2,
      applied: "16 Oct 2023",
    },
    {
      id: "w3",
      name: "Priya Patel",
      skills: ["Plumbing", "Carpentry"],
      rating: 4.7,
      applied: "17 Oct 2023",
    },
  ],
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState(jobData)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false)
  const router = useRouter()

  const handleApprove = () => {
    setJob({ ...job, status: "Approved" })
    // In a real app, this would make an API call to update the job status
    router.push("/admin/jobs")
  }

  const handleReject = () => {
    setJob({ ...job, status: "Rejected" })
    // In a real app, this would make an API call to update the job status
    setIsRejectionDialogOpen(false)
    router.push("/admin/jobs")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/jobs">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Job Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <CardDescription>
                    Posted by {job.employer.name} on {job.postedAt}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    job.status === "Approved" ? "success" : job.status === "Rejected" ? "destructive" : "outline"
                  }
                  className="text-sm"
                >
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Wage</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{job.wage}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{job.duration}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Applications</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{job.applications}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Job Description</h3>
                <p className="text-muted-foreground">{job.description}</p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Requirements</h3>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            {job.status === "Pending" && (
              <CardFooter className="flex justify-end gap-2 border-t pt-6">
                <Button variant="outline" className="text-red-600" onClick={() => setIsRejectionDialogOpen(true)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button variant="default" onClick={handleApprove}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applicants ({job.applicants.length})</CardTitle>
              <CardDescription>Workers who have applied for this job</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {job.applicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{applicant.name}</h4>
                        <div className="flex gap-2 mt-1">
                          {applicant.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>Rating: {applicant.rating}</span>
                          <span>•</span>
                          <span>Applied: {applicant.applied}</span>
                        </div>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/workers/${applicant.id}`}>
                        <User className="h-4 w-4 mr-1" />
                        View Profile
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Employer Information</CardTitle>
              <CardDescription>Details about the job poster</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl">{job.employer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{job.employer.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Rating: {job.employer.rating}</span>
                    {job.employer.verified && (
                      <Badge variant="success" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{job.employer.jobsPosted} jobs posted</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/admin/employers/${job.employer.id}`}>
                    <Building2 className="h-4 w-4 mr-2" />
                    View Employer Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Job Posting</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this job posting. This will be sent to the employer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for rejection</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

