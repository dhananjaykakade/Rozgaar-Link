"use client"

import { EmployerLayout } from "@/components/employer-layout"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { MapPin, Star, MessageSquare, CheckCircle, XCircle, Clock3, Briefcase, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// Mock application data - in a real app, this would come from the API
const MOCK_APPLICATIONS = [
  {
    id: "app1",
    jobId: "job1",
    jobTitle: "Construction Helper",
    jobLocation: "Andheri East, Mumbai",
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
    },
  },
  {
    id: "app2",
    jobId: "job1",
    jobTitle: "Construction Helper",
    jobLocation: "Andheri East, Mumbai",
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
    },
  },
  {
    id: "app3",
    jobId: "job2",
    jobTitle: "Plumbing Work",
    jobLocation: "Powai, Mumbai",
    status: "pending",
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
    },
  },
  {
    id: "app4",
    jobId: "job2",
    jobTitle: "Plumbing Work",
    jobLocation: "Powai, Mumbai",
    status: "rejected",
    appliedAt: "March 18, 2025",
    worker: {
      id: "worker4",
      name: "Priya Sharma",
      location: "Juhu, Mumbai",
      phone: "+91 65432 10987",
      rating: 4.0,
      reviews: 5,
      skills: ["Plumbing", "Repair"],
      experience: "2 years of experience in plumbing work",
      completedJobs: 8,
    },
  },
  {
    id: "app5",
    jobId: "job3",
    jobTitle: "Electrician Needed",
    jobLocation: "Bandra West, Mumbai",
    status: "accepted",
    appliedAt: "March 17, 2025",
    worker: {
      id: "worker5",
      name: "Vijay Kumar",
      location: "Dadar, Mumbai",
      phone: "+91 54321 09876",
      rating: 4.7,
      reviews: 20,
      skills: ["Electrical", "Wiring", "Installation"],
      experience: "8 years of experience in electrical work",
      completedJobs: 45,
    },
  },
]

export default function EmployerApplicationsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<typeof MOCK_APPLICATIONS>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [jobFilter, setJobFilter] = useState("all")
  const [selectedWorker, setSelectedWorker] = useState<(typeof MOCK_APPLICATIONS)[0]["worker"] | null>(null)
  const [showWorkerDetails, setShowWorkerDetails] = useState(false)
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  // Fetch applications when the component mounts
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call like:
        // const response = await fetch(`/api/employer/applications?employerId=${user?.id}`);
        // const data = await response.json();
        // setApplications(data);

        // For now, we'll simulate an API call with a timeout
        setTimeout(() => {
          setApplications(MOCK_APPLICATIONS)
          setLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error fetching applications:", error)
        toast({
          title: "Error",
          description: "Failed to fetch applications. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    if (user) {
      fetchApplications()
    }
  }, [user, toast])

  const handleAccept = async (appId: string, jobId: string, workerId: string) => {
    setProcessingAction(appId)

    try {
      // In a real app, this would be an API call like:
      // await fetch(`/api/jobs/${jobId}/hire/${workerId}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'accepted' })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setApplications(applications.map((app) => (app.id === appId ? { ...app, status: "accepted" } : app)))

      toast({
        title: "Application Accepted",
        description: "The worker has been notified",
      })
    } catch (error) {
      console.error("Error accepting application:", error)
      toast({
        title: "Error",
        description: "Failed to accept application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(null)
    }
  }

  const handleReject = async (appId: string, jobId: string, workerId: string) => {
    setProcessingAction(appId)

    try {
      // In a real app, this would be an API call like:
      // await fetch(`/api/jobs/${jobId}/hire/${workerId}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'rejected' })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setApplications(applications.map((app) => (app.id === appId ? { ...app, status: "rejected" } : app)))

      toast({
        title: "Application Rejected",
        description: "The worker has been notified",
      })
    } catch (error) {
      console.error("Error rejecting application:", error)
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(null)
    }
  }

  const viewWorkerDetails = (worker: (typeof MOCK_APPLICATIONS)[0]["worker"]) => {
    setSelectedWorker(worker)
    setShowWorkerDetails(true)
  }

  // Filter applications based on search term and job filter
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.worker.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesJobFilter = jobFilter === "all" || app.jobId === jobFilter

    return matchesSearch && matchesJobFilter
  })

  // Get unique jobs for the filter dropdown
  const uniqueJobs = Array.from(new Set(applications.map((app) => app.jobId))).map((jobId) => {
    const job = applications.find((app) => app.jobId === jobId)
    return {
      id: jobId,
      title: job?.jobTitle || "",
      location: job?.jobLocation || "",
    }
  })

  // Filter applications by status
  const pendingApplications = filteredApplications.filter((app) => app.status === "pending")
  const acceptedApplications = filteredApplications.filter((app) => app.status === "accepted")
  const rejectedApplications = filteredApplications.filter((app) => app.status === "rejected")

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

  const ApplicationCard = ({ application }: { application: (typeof MOCK_APPLICATIONS)[0] }) => (
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
          <div className="flex items-center">
            {renderStars(application.worker.rating)}
            <span className="ml-1">({application.worker.reviews})</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {application.worker.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{application.worker.completedJobs} jobs completed</span>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Applied for: </span>
          <span className="font-medium">{application.jobTitle}</span>
          <span className="text-muted-foreground"> in </span>
          <span>{application.jobLocation}</span>
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
              onClick={() => handleReject(application.id, application.jobId, application.worker.id)}
              disabled={processingAction === application.id}
            >
              {processingAction === application.id ? "Processing..." : t("employer.reject")}
            </Button>
            <Button
              size="sm"
              onClick={() => handleAccept(application.id, application.jobId, application.worker.id)}
              disabled={processingAction === application.id}
            >
              {processingAction === application.id ? "Processing..." : t("employer.accept")}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )

  // Skeleton loader for applications
  const ApplicationSkeleton = () => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 w-40 bg-muted animate-pulse rounded" />
        <div className="flex gap-1">
          <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
          <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
          <div className="h-5 w-18 bg-muted animate-pulse rounded-full" />
        </div>
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <EmployerLayout>
      <div className="space-y-6 px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Applications</h1>
            <p className="text-muted-foreground">Manage worker applications for your jobs</p>
          </div>

          <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or skill"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-[200px]"
              />
            </div>

            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {uniqueJobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} - {job.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({filteredApplications.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({acceptedApplications.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ApplicationSkeleton key={index} />
                ))}
              </div>
            ) : filteredApplications.length > 0 ? (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground mb-2">No applications found</p>
                {searchTerm || jobFilter !== "all" ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setJobFilter("all")
                    }}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Link href="/employer/job/new">
                    <Button variant="outline">Post a new job</Button>
                  </Link>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            {loading ? (
              <div className="space-y-4">
                <ApplicationSkeleton />
                <ApplicationSkeleton />
              </div>
            ) : pendingApplications.length > 0 ? (
              <div className="space-y-4">
                {pendingApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No pending applications</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="mt-4">
            {loading ? (
              <div className="space-y-4">
                <ApplicationSkeleton />
              </div>
            ) : acceptedApplications.length > 0 ? (
              <div className="space-y-4">
                {acceptedApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No accepted applications</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="mt-4">
            {loading ? (
              <div className="space-y-4">
                <ApplicationSkeleton />
              </div>
            ) : rejectedApplications.length > 0 ? (
              <div className="space-y-4">
                {rejectedApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No rejected applications</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

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
                    {renderStars(selectedWorker.rating)}
                    <span className="ml-1 text-muted-foreground">({selectedWorker.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedWorker.location}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedWorker.completedJobs} jobs completed</span>
                  </div>
                </div>
              </div>

              <Separator />

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
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowWorkerDetails(false)}>
              Close
            </Button>
            {selectedWorker && (
              <Link href={`/employer/chat/${selectedWorker.id}`}>
                <Button>Contact Worker</Button>
              </Link>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EmployerLayout>
  )
}

