"use client"

import { EmployerLayout } from "@/components/employer-layout"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { MapPin, Phone, Star, MessageSquare, CheckCircle, XCircle, Clock3, Briefcase, Calendar } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock application data
const APPLICATIONS = [
  {
    id: "app1",
    status: "pending",
    appliedAt: "March 21, 2025",
    worker: {
      id: "worker1",
      name: "Rahul Kumar",
      location: "Andheri East, Mumbai",
      phone: "+91 98765 43210",
      rating: 4.8,
      reviews: 15,
      skills: ["Construction", "Painting", "Plumbing"],
      experience: "5 years of experience in construction work",
      completedJobs: 24,
      availability: "Immediate",
      pastJobs: [
        { title: "Construction Helper", employer: "XYZ Construction", duration: "15 days", completedOn: "Feb 2025" },
        { title: "Painter", employer: "ABC Interiors", duration: "7 days", completedOn: "Jan 2025" },
      ],
    },
  },
  {
    id: "app2",
    status: "accepted",
    appliedAt: "March 20, 2025",
    worker: {
      id: "worker2",
      name: "Suresh Patel",
      location: "Powai, Mumbai",
      phone: "+91 87654 32109",
      rating: 4.5,
      reviews: 12,
      skills: ["Plumbing", "Electrical", "Repair"],
      experience: "7 years of experience in plumbing and electrical work",
      completedJobs: 32,
      availability: "Within 1 week",
      pastJobs: [
        { title: "Plumber", employer: "Modern Homes", duration: "3 days", completedOn: "Mar 2025" },
        { title: "Electrician", employer: "City Services", duration: "5 days", completedOn: "Feb 2025" },
      ],
    },
  },
  {
    id: "app3",
    status: "rejected",
    appliedAt: "March 19, 2025",
    worker: {
      id: "worker3",
      name: "Amit Singh",
      location: "Bandra West, Mumbai",
      phone: "+91 76543 21098",
      rating: 4.2,
      reviews: 8,
      skills: ["Electrical", "Wiring", "Installation"],
      experience: "3 years of experience in electrical work",
      completedJobs: 15,
      availability: "Within 2 weeks",
      pastJobs: [{ title: "Electrician", employer: "Premium Builders", duration: "10 days", completedOn: "Jan 2025" }],
    },
  },
]

// Mock job data
const JOB = {
  id: "job1",
  title: "Construction Helper",
  location: "Andheri East, Mumbai",
  wage: "₹600 per day",
  duration: "15 days",
  startDate: "April 1, 2025",
  status: "active",
  applicantsCount: 3,
  description:
    "We are looking for construction helpers for a residential building project. The work involves carrying materials, assisting masons, and general labor work.",
}

export default function ApplicationsPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<typeof APPLICATIONS>([])
  const [selectedWorker, setSelectedWorker] = useState<(typeof APPLICATIONS)[0]["worker"] | null>(null)
  const [showWorkerDetails, setShowWorkerDetails] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setApplications(APPLICATIONS)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const pendingApplications = applications.filter((app) => app.status === "pending")
  const acceptedApplications = applications.filter((app) => app.status === "accepted")
  const rejectedApplications = applications.filter((app) => app.status === "rejected")

  const handleAccept = (appId: string, workerId: string) => {
    setProcessingAction(appId)

    // Simulate API call to /jobs/:id/hire/:worker_id
    setTimeout(() => {
      setApplications(applications.map((app) => (app.id === appId ? { ...app, status: "accepted" } : app)))
      setProcessingAction(null)

      toast({
        title: "Application Accepted",
        description: "The worker has been notified",
      })
    }, 1000)
  }

  const handleReject = (appId: string, workerId: string) => {
    setProcessingAction(appId)

    // Simulate API call
    setTimeout(() => {
      setApplications(applications.map((app) => (app.id === appId ? { ...app, status: "rejected" } : app)))
      setProcessingAction(null)

      toast({
        title: "Application Rejected",
        description: "The worker has been notified",
      })
    }, 1000)
  }

  const viewWorkerDetails = (worker: (typeof APPLICATIONS)[0]["worker"]) => {
    setSelectedWorker(worker)
    setShowWorkerDetails(true)
  }

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock3 className="h-3 w-3" />
            {t("worker.pending")}
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {t("worker.accepted")}
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            {t("worker.rejected")}
          </Badge>
        )
      default:
        return null
    }
  }

  const ApplicationCard = ({ application }: { application: (typeof APPLICATIONS)[0] }) => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{application.worker.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{application.worker.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {application.worker.location}
              </CardDescription>
            </div>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Star className="h-3.5 w-3.5 text-yellow-500" />
          <span>
            {application.worker.rating} ({application.worker.reviews} reviews)
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {application.worker.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <p className="text-sm line-clamp-2">{application.worker.experience}</p>

        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{application.worker.completedJobs} jobs completed</span>
        </div>

        <p className="text-xs text-muted-foreground">Applied on {application.appliedAt}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => viewWorkerDetails(application.worker)}>
            View Details
          </Button>

          <Link href={`/employer/chat/${application.worker.id}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {t("employer.message")}
            </Button>
          </Link>
        </div>

        {application.status === "pending" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() => handleReject(application.id, application.worker.id)}
              disabled={processingAction === application.id}
            >
              {processingAction === application.id ? "Processing..." : t("employer.reject")}
            </Button>
            <Button
              size="sm"
              onClick={() => handleAccept(application.id, application.worker.id)}
              disabled={processingAction === application.id}
            >
              {processingAction === application.id ? "Processing..." : t("employer.accept")}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )

  return (
    <EmployerLayout>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{JOB.title}</CardTitle>
          <CardDescription>
            {JOB.location} • {JOB.wage} • {JOB.duration}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="text-sm space-y-1">
              <p>Start Date: {JOB.startDate}</p>
              <p className="text-muted-foreground">Total Applications: {applications.length}</p>
              <p className="text-sm line-clamp-2 mt-2">{JOB.description}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/employer/job/${JOB.id}/edit`}>
                <Button variant="outline" size="sm">
                  Edit Job
                </Button>
              </Link>
              {JOB.status === "active" && (
                <Button variant="outline" size="sm" className="text-destructive">
                  Close Job
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({acceptedApplications.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-muted rounded" />
                          <div className="h-3 w-24 bg-muted rounded" />
                        </div>
                      </div>
                      <div className="h-5 w-20 bg-muted rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-4 w-40 bg-muted rounded" />
                    <div className="flex gap-1">
                      <div className="h-5 w-16 bg-muted rounded-full" />
                      <div className="h-5 w-20 bg-muted rounded-full" />
                      <div className="h-5 w-18 bg-muted rounded-full" />
                    </div>
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="h-8 w-24 bg-muted rounded" />
                    <div className="flex gap-2">
                      <div className="h-8 w-20 bg-muted rounded" />
                      <div className="h-8 w-20 bg-muted rounded" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("employer.no_applications")}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          {loading ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="h-5 w-20 bg-muted rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="flex gap-1">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                    <div className="h-5 w-20 bg-muted rounded-full" />
                  </div>
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="h-8 w-24 bg-muted rounded" />
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-muted rounded" />
                    <div className="h-8 w-20 bg-muted rounded" />
                  </div>
                </CardFooter>
              </Card>
            </div>
          ) : pendingApplications.length > 0 ? (
            <div className="space-y-4">
              {pendingApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No pending applications</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="mt-4">
          {loading ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="h-5 w-20 bg-muted rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="flex gap-1">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                    <div className="h-5 w-20 bg-muted rounded-full" />
                  </div>
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </CardContent>
                <CardFooter>
                  <div className="h-8 w-24 bg-muted rounded" />
                </CardFooter>
              </Card>
            </div>
          ) : acceptedApplications.length > 0 ? (
            <div className="space-y-4">
              {acceptedApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No accepted applications</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          {loading ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="h-5 w-20 bg-muted rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="flex gap-1">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                    <div className="h-5 w-20 bg-muted rounded-full" />
                  </div>
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </CardContent>
                <CardFooter>
                  <div className="h-8 w-24 bg-muted rounded" />
                </CardFooter>
              </Card>
            </div>
          ) : rejectedApplications.length > 0 ? (
            <div className="space-y-4">
              {rejectedApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rejected applications</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Worker Details Dialog */}
      <Dialog open={showWorkerDetails} onOpenChange={setShowWorkerDetails}>
        <DialogContent className="max-w-md md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Worker Profile</DialogTitle>
            <DialogDescription>Detailed information about the worker</DialogDescription>
          </DialogHeader>

          {selectedWorker && (
            <div className="space-y-4 mt-2">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl">{selectedWorker.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedWorker.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{selectedWorker.rating}</span>
                    <span className="text-muted-foreground">({selectedWorker.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedWorker.location}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedWorker.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Availability: {selectedWorker.availability}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedWorker.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Experience</h4>
                <p className="text-sm">{selectedWorker.experience}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Past Jobs ({selectedWorker.completedJobs} completed)</h4>
                {selectedWorker.pastJobs.length > 0 ? (
                  <div className="space-y-3">
                    {selectedWorker.pastJobs.map((job, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <h5 className="font-medium">{job.title}</h5>
                          <span className="text-sm text-muted-foreground">{job.completedOn}</span>
                        </div>
                        <p className="text-sm mt-1">
                          {job.employer} • {job.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No past jobs recorded</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowWorkerDetails(false)}>
              Close
            </Button>
            <Link href={`/employer/chat/${selectedWorker?.id}`}>
              <Button>Contact Worker</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EmployerLayout>
  )
}

