"use client"

import { WorkerLayout } from "@/components/worker-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MapPinIcon,
  CalendarIcon,
  IndianRupeeIcon,
  Clock,
  BriefcaseIcon,
  CheckCircle,
  MessageSquare,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import Link from "next/link"

// Mock job data
const JOB = {
  id: "job1",
  title: "Construction Helper",
  description:
    "We are looking for construction helpers for a residential building project. The work involves carrying materials, assisting masons, and general labor work. Experience in construction is preferred but not mandatory.",
  location: "Andheri East, Mumbai",
  address: "Near Metro Station, Andheri East, Mumbai - 400069",
  wage: "₹600 per day",
  duration: "15 days",
  startDate: "April 1, 2025",
  workingHours: "8 AM - 5 PM",
  postedAt: "March 20, 2025",
  skills: ["Construction", "Labor", "Painting"],
  requirements: [
    "Ability to lift heavy objects up to 20kg",
    "Basic understanding of construction tools",
    "Willingness to work in all weather conditions",
    "Punctuality and reliability",
  ],
  employer: {
    id: "emp1",
    name: "ABC Construction",
    rating: 4.5,
    jobsPosted: 24,
    hiredCount: 120,
  },
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleApply = () => {
    setApplying(true)

    // Simulate API call
    setTimeout(() => {
      setApplying(false)
      setApplied(true)
      toast({
        title: "Application Submitted",
        description: "Your application has been sent to the employer",
      })
    }, 1500)
  }

  return (
    <WorkerLayout>
      <div className="container py-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{JOB.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {JOB.location}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">Posted on {JOB.postedAt}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <IndianRupeeIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{JOB.wage}</p>
                      <p className="text-xs text-muted-foreground">Daily wage</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{JOB.duration}</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{JOB.workingHours}</p>
                      <p className="text-xs text-muted-foreground">Working hours</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BriefcaseIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{JOB.startDate}</p>
                      <p className="text-xs text-muted-foreground">Start date</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Job Description</h3>
                  <p className="text-sm text-muted-foreground">{JOB.description}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {JOB.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Requirements</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {JOB.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Job Location</h3>
                  <p className="text-sm text-muted-foreground">{JOB.address}</p>
                  <div className="mt-2 h-40 bg-muted rounded-md flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Map view will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Job</CardTitle>
                <CardDescription>Send your application to the employer</CardDescription>
              </CardHeader>
              <CardContent>
                {applied ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <h3 className="font-medium text-lg">Application Sent!</h3>
                    <p className="text-sm text-muted-foreground mt-1">The employer will review your application soon</p>
                  </div>
                ) : (
                  <Button className="w-full" onClick={handleApply} disabled={applying}>
                    {applying ? "Sending Application..." : "Apply Now"}
                  </Button>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                {applied && (
                  <Link href="/worker/applications">
                    <Button variant="link">View My Applications</Button>
                  </Link>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About the Employer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{JOB.employer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{JOB.employer.name}</p>
                    <p className="text-sm text-muted-foreground">{JOB.employer.rating} ★ • Member since 2023</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium">{JOB.employer.jobsPosted}</span>
                    <span className="text-muted-foreground">Jobs Posted</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{JOB.employer.hiredCount}</span>
                    <span className="text-muted-foreground">Workers Hired</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contact Employer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    Complete your profile to see similar job recommendations
                  </p>
                  <Link href="/worker/profile">
                    <Button variant="link" className="mt-2">
                      Update Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WorkerLayout>
  )
}

