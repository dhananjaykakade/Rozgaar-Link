"use client"

import { WorkerLayout } from "@/components/worker-layout"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { MapPin, Calendar, IndianRupee, Clock, CheckCircle } from "lucide-react"
import { RatingDialog } from "@/components/rating-dialog"
import Link from "next/link"

// Mock job data
const JOB = {
  id: "job1",
  title: "Construction Helper",
  description:
    "We are looking for construction helpers for a residential building project. The work involves carrying materials, assisting masons, and general labor work.",
  location: "Andheri East, Mumbai",
  address: "Near Metro Station, Andheri East, Mumbai - 400069",
  wage: "₹600 per day",
  duration: "15 days",
  startDate: "April 1, 2025",
  endDate: "April 15, 2025",
  workingHours: "8 AM - 5 PM",
  status: "completed",
  completedOn: "April 15, 2025",
  totalEarnings: "₹9,000",
  employer: {
    id: "emp1",
    name: "ABC Construction",
    rating: 4.5,
    jobsPosted: 24,
  },
  isRated: false,
}

export default function CompletedJobPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [job, setJob] = useState(JOB)

  const handleRatingSubmit = (rating: number, feedback: string) => {
    // In a real app, this would call an API to submit the rating
    setJob({
      ...job,
      isRated: true,
    })

    toast({
      title: "Rating Submitted",
      description: "Thank you for rating this employer",
    })
  }

  return (
    <WorkerLayout>
      <div className="container py-6 px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Completed Job</h1>
              <p className="text-muted-foreground">Review your completed job and rate the employer</p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{job.wage}</p>
                    <p className="text-xs text-muted-foreground">Daily wage</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{job.duration}</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{job.workingHours}</p>
                    <p className="text-xs text-muted-foreground">Working hours</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{job.completedOn}</p>
                    <p className="text-xs text-muted-foreground">Completed on</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Job Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Days Worked:</span>
                    <span className="font-medium">15 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Wage:</span>
                    <span className="font-medium">₹600</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-medium">Total Earnings:</span>
                    <span className="font-bold">{job.totalEarnings}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Employer</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{job.employer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{job.employer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.employer.rating} ★ • {job.employer.jobsPosted} jobs posted
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/worker/applications">
                <Button variant="outline">View All Applications</Button>
              </Link>

              {!job.isRated ? (
                <RatingDialog
                  type="employer"
                  targetId={job.employer.id}
                  targetName={job.employer.name}
                  jobTitle={job.title}
                  onRatingSubmit={handleRatingSubmit}
                  trigger={<Button>Rate Employer</Button>}
                />
              ) : (
                <Button disabled>Already Rated</Button>
              )}
            </CardFooter>
          </Card>

          <div className="text-center">
            <p className="text-muted-foreground mb-2">Looking for more work?</p>
            <Link href="/worker/dashboard">
              <Button variant="outline">Browse Available Jobs</Button>
            </Link>
          </div>
        </div>
      </div>
    </WorkerLayout>
  )
}

