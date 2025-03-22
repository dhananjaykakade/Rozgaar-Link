"use client"

import { WorkerLayout } from "@/components/worker-layout"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  CalendarIcon,
  IndianRupeeIcon,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock3,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ApplicationSkeleton } from "@/components/application-skeleton"
import { Input } from "@/components/ui/input"
import { StarRating } from "@/components/star-rating"

// Mock application data
const APPLICATIONS = [
  {
    id: "app1",
    status: "pending",
    appliedAt: "March 21, 2025",
    job: {
      id: "job1",
      title: "Construction Helper",
      location: "Andheri East, Mumbai",
      wage: "₹600 per day",
      duration: "15 days",
      employer: {
        id: "emp1",
        name: "ABC Construction",
        rating: 4.5,
        reviews: 28,
      },
    },
  },
  {
    id: "app2",
    status: "accepted",
    appliedAt: "March 18, 2025",
    job: {
      id: "job2",
      title: "Plumbing Work",
      location: "Powai, Mumbai",
      wage: "₹800 per day",
      duration: "3 days",
      employer: {
        id: "emp2",
        name: "XYZ Maintenance",
        rating: 4.2,
        reviews: 15,
      },
    },
    completedOn: "March 25, 2025",
    isRated: false,
  },
  {
    id: "app3",
    status: "rejected",
    appliedAt: "March 15, 2025",
    job: {
      id: "job3",
      title: "Electrician Needed",
      location: "Bandra West, Mumbai",
      wage: "₹900 per day",
      duration: "2 days",
      employer: {
        id: "emp3",
        name: "Modern Interiors",
        rating: 4.7,
        reviews: 32,
      },
    },
  },
  {
    id: "app4",
    status: "completed",
    appliedAt: "March 10, 2025",
    job: {
      id: "job4",
      title: "House Painting",
      location: "Malad, Mumbai",
      wage: "₹700 per day",
      duration: "10 days",
      employer: {
        id: "emp4",
        name: "Color Masters",
        rating: 4.3,
        reviews: 20,
      },
    },
    completedOn: "March 20, 2025",
    isRated: true,
  },
]

export default function ApplicationsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<typeof APPLICATIONS>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setApplications(APPLICATIONS)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Filter applications based on search term
  const filteredApplications = applications.filter((app) => {
    return (
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.employer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const pendingApplications = filteredApplications.filter((app) => app.status === "pending")
  const acceptedApplications = filteredApplications.filter((app) => app.status === "accepted")
  const rejectedApplications = filteredApplications.filter((app) => app.status === "rejected")
  const completedApplications = filteredApplications.filter((app) => app.status === "completed")

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
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
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
          <div>
            <CardTitle>{application.job.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {application.job.location}
            </CardDescription>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="flex items-center">
            <IndianRupeeIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{application.job.wage}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{application.job.duration}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{application.job.employer.name}</p>
            <div className="flex items-center mt-1">
              <StarRating
                rating={application.job.employer.rating}
                size="sm"
                showCount={true}
                count={application.job.employer.reviews}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Applied on {application.appliedAt}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex gap-2">
          <Link href={`/worker/job/${application.job.id}`}>
            <Button variant="outline" size="sm">
              {t("worker.view_job")}
            </Button>
          </Link>
          <Link href={`/worker/chat/${application.job.employer.id}`}>
            <Button size="sm" className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {t("worker.chat")}
            </Button>
          </Link>
        </div>

        {application.status === "completed" && !application.isRated && (
          <Link href={`/worker/rate-employer/${application.job.employer.id}`}>
            <Button size="sm" variant="secondary">
              Rate Employer
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )

  return (
    <WorkerLayout>
      <div className="container py-6 px-4 md:px-8 lg:px-12">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{t("worker.applications")}</h1>
              <p className="text-muted-foreground">{t("worker.track_applications")}</p>
            </div>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-[250px]"
              />
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({filteredApplications.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
              <TabsTrigger value="accepted">Accepted ({acceptedApplications.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedApplications.length})</TabsTrigger>
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
                  <p className="text-muted-foreground">{t("worker.no_applications")}</p>
                  <Link href="/worker/dashboard">
                    <Button variant="link">{t("worker.browse_jobs_link")}</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <ApplicationSkeleton key={index} />
                  ))}
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

            <TabsContent value="completed" className="mt-4">
              {loading ? (
                <div className="space-y-4">
                  <ApplicationSkeleton />
                </div>
              ) : completedApplications.length > 0 ? (
                <div className="space-y-4">
                  {completedApplications.map((application) => (
                    <ApplicationCard key={application.id} application={application} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">No completed applications</p>
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
      </div>
    </WorkerLayout>
  )
}

