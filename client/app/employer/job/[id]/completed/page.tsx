"use client"

import { EmployerLayout } from "@/components/employer-layout"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  totalPaid: "₹27,000",
  workers: [
    {
      id: "worker1",
      name: "Rahul Kumar",
      avatar: "R",
      rating: 4.8,
      completedJobs: 24,
      isRated: false,
    },
    {
      id: "worker2",
      name: "Suresh Patel",
      avatar: "S",
      rating: 4.5,
      completedJobs: 32,
      isRated: true,
    },
    {
      id: "worker3",
      name: "Amit Singh",
      avatar: "A",
      rating: 4.2,
      completedJobs: 15,
      isRated: false,
    },
  ],
}

export default function CompletedJobPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [job, setJob] = useState(JOB)

  const handleRatingSubmit = (workerId: string, rating: number, feedback: string) => {
    // In a real app, this would call an API to submit the rating
    setJob({
      ...job,
      workers: job.workers.map((worker) => (worker.id === workerId ? { ...worker, isRated: true } : worker)),
    })

    toast({
      title: "Rating Submitted",
      description: "Thank you for rating this worker",
    })
  }

  return (
    <EmployerLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Completed Job</h1>
            <p className="text-muted-foreground">Review your completed job and rate the workers</p>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <span>Workers Hired:</span>
                  <span className="font-medium">{job.workers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Wage per Worker:</span>
                  <span className="font-medium">₹600</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Days:</span>
                  <span className="font-medium">15 days</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-medium">Total Amount Paid:</span>
                  <span className="font-bold">{job.totalPaid}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Hired Workers</h3>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Workers ({job.workers.length})</TabsTrigger>
                  <TabsTrigger value="rated">Rated ({job.workers.filter((w) => w.isRated).length})</TabsTrigger>
                  <TabsTrigger value="unrated">Unrated ({job.workers.filter((w) => !w.isRated).length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <div className="space-y-4">
                    {job.workers.map((worker) => (
                      <div key={worker.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{worker.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{worker.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {worker.rating} ★ • {worker.completedJobs} jobs completed
                              </p>
                            </div>
                          </div>

                          {worker.isRated ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Rated
                            </Badge>
                          ) : (
                            <RatingDialog
                              type="worker"
                              targetId={worker.id}
                              targetName={worker.name}
                              jobTitle={job.title}
                              onRatingSubmit={(rating, feedback) => handleRatingSubmit(worker.id, rating, feedback)}
                              trigger={<Button size="sm">Rate Worker</Button>}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="rated" className="mt-4">
                  <div className="space-y-4">
                    {job.workers
                      .filter((w) => w.isRated)
                      .map((worker) => (
                        <div key={worker.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{worker.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{worker.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {worker.rating} ★ • {worker.completedJobs} jobs completed
                                </p>
                              </div>
                            </div>

                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Rated
                            </Badge>
                          </div>
                        </div>
                      ))}

                    {job.workers.filter((w) => w.isRated).length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No rated workers yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="unrated" className="mt-4">
                  <div className="space-y-4">
                    {job.workers
                      .filter((w) => !w.isRated)
                      .map((worker) => (
                        <div key={worker.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{worker.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{worker.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {worker.rating} ★ • {worker.completedJobs} jobs completed
                                </p>
                              </div>
                            </div>

                            <RatingDialog
                              type="worker"
                              targetId={worker.id}
                              targetName={worker.name}
                              jobTitle={job.title}
                              onRatingSubmit={(rating, feedback) => handleRatingSubmit(worker.id, rating, feedback)}
                              trigger={<Button size="sm">Rate Worker</Button>}
                            />
                          </div>
                        </div>
                      ))}

                    {job.workers.filter((w) => !w.isRated).length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">All workers have been rated</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/employer/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>

            <Link href="/employer/job/new">
              <Button>Post New Job</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </EmployerLayout>
  )
}

