"use client"

import { WorkerLayout } from "@/components/worker-layout"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { Star, MapPin, Briefcase, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

// Mock employer data - in a real app, this would come from the API
const MOCK_EMPLOYER = {
  id: "emp1",
  name: "ABC Construction",
  avatar: "A",
  location: "Andheri East, Mumbai",
  description:
    "ABC Construction is a leading construction company specializing in residential and commercial projects.",
  rating: 4.5,
  reviews: 28,
  jobsPosted: 45,
  workersHired: 120,
  pastRatings: [
    {
      id: "r1",
      worker: "Suresh Patel",
      rating: 5,
      feedback: "Great employer, paid on time and provided good working conditions.",
      date: "March 15, 2025",
    },
    {
      id: "r2",
      worker: "Amit Singh",
      rating: 4,
      feedback: "Good experience working with them. Clear instructions and fair pay.",
      date: "February 28, 2025",
    },
  ],
}

// Mock job data - in a real app, this would come from the API
const MOCK_JOB = {
  id: "job1",
  title: "Construction Helper",
  location: "Andheri East, Mumbai",
  wage: "₹600 per day",
  duration: "15 days",
  startDate: "April 1, 2025",
  endDate: "April 15, 2025",
  status: "completed",
}

export default function RateEmployerPage({ params }: { params: { employer_id: string } }) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [employer, setEmployer] = useState<typeof MOCK_EMPLOYER | null>(null)
  const [job, setJob] = useState<typeof MOCK_JOB | null>(null)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  // Fetch employer and job data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real app, these would be API calls like:
        // const employerResponse = await fetch(`/api/employers/${params.employer_id}`);
        // const employerData = await employerResponse.json();
        // setEmployer(employerData);

        // const jobResponse = await fetch(`/api/jobs/completed?workerId=${user.id}&employerId=${params.employer_id}`);
        // const jobData = await jobResponse.json();
        // setJob(jobData);

        // For now, we'll simulate API calls with a timeout
        setTimeout(() => {
          setEmployer(MOCK_EMPLOYER)
          setJob(MOCK_JOB)
          setLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [params.employer_id, toast])

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // In a real app, this would be an API call like:
      // await fetch(`/api/ratings/employer/${params.employer_id}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ rating, feedback })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Rating Submitted",
        description: "Thank you for rating this employer",
      })

      // Redirect to worker dashboard
      router.push("/worker/dashboard")
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      })
      setSubmitting(false)
    }
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-64 bg-muted rounded"></div>
      <div className="h-4 w-48 bg-muted rounded"></div>

      <div className="h-[200px] bg-muted rounded-lg"></div>

      <div className="h-8 w-40 bg-muted rounded"></div>
      <div className="h-[120px] bg-muted rounded-lg"></div>

      <div className="flex justify-end">
        <div className="h-10 w-24 bg-muted rounded"></div>
      </div>
    </div>
  )

  return (
    <WorkerLayout>
      <div className="container py-6 px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              href="/worker/applications"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Applications
            </Link>

            <h1 className="text-2xl font-bold">Rate Employer</h1>
            <p className="text-muted-foreground">Share your experience working with this employer</p>
          </div>

          {loading ? (
            <SkeletonLoader />
          ) : employer && job ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                  <CardDescription>Information about the completed job</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-xl">{employer.avatar}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{employer.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(employer.rating)}
                        <span className="ml-1 text-muted-foreground">({employer.reviews} reviews)</span>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{employer.location}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {employer.jobsPosted} jobs posted • {employer.workersHired} workers hired
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">About the Employer</h4>
                    <p className="text-sm">{employer.description}</p>
                  </div>

                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Completed Job</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Job Title:</span>
                        <span className="font-medium">{job.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span>{job.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{job.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wage:</span>
                        <span>{job.wage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Period:</span>
                        <span>
                          {job.startDate} to {job.endDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Rating</CardTitle>
                  <CardDescription>Rate your experience working with {employer.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium">How would you rate your experience?</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= (hoveredRating || rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rating === 1 && "Poor"}
                      {rating === 2 && "Fair"}
                      {rating === 3 && "Good"}
                      {rating === 4 && "Very Good"}
                      {rating === 5 && "Excellent"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="feedback" className="text-sm font-medium">
                      Your Feedback
                    </label>
                    <Textarea
                      id="feedback"
                      placeholder="Share your experience working with this employer..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Rating"}
                  </Button>
                </CardFooter>
              </Card>

              {employer.pastRatings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Ratings</CardTitle>
                    <CardDescription>What other workers say about this employer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {employer.pastRatings.map((pastRating) => (
                        <div key={pastRating.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{pastRating.worker}</p>
                              <div className="flex items-center gap-1 mt-1">{renderStars(pastRating.rating)}</div>
                            </div>
                            <p className="text-sm text-muted-foreground">{pastRating.date}</p>
                          </div>

                          <div className="mt-2">
                            <p className="text-sm italic">"{pastRating.feedback}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground mb-2">Could not find employer or job details</p>
              <Link href="/worker/applications">
                <Button variant="outline">Back to Applications</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </WorkerLayout>
  )
}

