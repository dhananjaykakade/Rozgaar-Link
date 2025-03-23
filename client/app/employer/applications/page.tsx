"use client"

import { EmployerLayout } from "@/components/employer-layout"
import { selectAuth } from "@/store/slices/authSlice"
import { useSelector } from "react-redux"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { MapPin, MessageSquare, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Worker {
  Id: string
  FirstName: string
  LastName: string
  Skills: string[]
  Location?: string
  Experience?: string
  Education?: string
  Languages?: string[]
  Bio?: string
  ContactNumber?: string
  Email?: string
}

interface JobApplication {
  Id: string
  JobId: string
  WorkerId: string
  Status: string
  AppliedAt: string
  Worker: Worker
}

interface Job {
  Id: string
  Title: string
  JobApplications: JobApplication[]
}

interface JobApplicationResponse {
  data: Job[]
}

export default function EmployerApplicationsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any>([])
  const [processingAction, setProcessingAction] = useState<string | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const { user } = useSelector(selectAuth)

  const translateStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return t("pending")
      case "ACCEPTED":
        return t("accepted")
      case "REJECTED":
        return t("rejected")
      default:
        return status
    }
  }

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const response = await axios.get<JobApplicationResponse>(`http://localhost:4000/api/employer/${user?.Id}/applications`)
      
      const transformedApplications = response.data.data.flatMap(job => 
        job.JobApplications.map(app => ({
          id: app.Id,
          jobId: job.Id,
          jobTitle: t(job.Title),
          status: app.Status,
          statusTranslated: translateStatus(app.Status),
          appliedAt: new Date(app.AppliedAt).toLocaleDateString(),
          worker: {
            id: app.Worker.Id,
            name: `${app.Worker.FirstName} ${app.Worker.LastName}`,
            firstName: app.Worker.FirstName,
            lastName: app.Worker.LastName,
            skills: app.Worker.Skills.map(skill => t(skill)),
            location: app.Worker.Location ? t(app.Worker.Location) : undefined,
            experience: app.Worker.Experience ? t(app.Worker.Experience) : undefined,
            education: app.Worker.Education ? t(app.Worker.Education) : undefined,
            languages: app.Worker.Languages?.map(lang => t(lang)) || [],
            bio: app.Worker.Bio ? t(app.Worker.Bio) : undefined,
            contactNumber: app.Worker.ContactNumber,
            email: app.Worker.Email
          }
        }))
      )

      setApplications(transformedApplications)
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast({
        title: t("error"),
        description: t("failed_fetch_applications"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (appId: string, jobId: string, workerId: string) => {
    setProcessingAction(appId)
    try {
      await axios.put(`http://localhost:4000/api/job/${jobId}/application/${workerId}`, {
        Status: "ACCEPTED"
      })
      
      setApplications(applications.map((app: any) => 
        app.id === appId ? { ...app, status: "ACCEPTED", statusTranslated: t("accepted") } : app
      ))

      toast({
        title: t("success"),
        description: t("application_accepted"),
      })
    } catch (error) {
      console.error("Error accepting application:", error)
      toast({
        title: t("error"),
        description: t("failed_accept_application"),
        variant: "destructive",
      })
    } finally {
      setProcessingAction(null)
    }
  }

  const handleReject = async (appId: string, jobId: string, workerId: string) => {
    setProcessingAction(appId)
    try {
      await axios.put(`http://localhost:4000/api/job/${jobId}/application/${workerId}`, {
        Status: "REJECTED"
      })
      
      setApplications(applications.map((app: any) => 
        app.id === appId ? { ...app, status: "REJECTED", statusTranslated: t("rejected") } : app
      ))

      toast({
        title: t("success"),
        description: t("application_rejected"),
      })
    } catch (error) {
      console.error("Error rejecting application:", error)
      toast({
        title: t("error"),
        description: t("failed_reject_application"),
        variant: "destructive",
      })
    } finally {
      setProcessingAction(null)
    }
  }

  useEffect(() => {
    if (user) {
      fetchApplications()
    }
  }, [user?.Id])

  if (loading) {
    return (
      <EmployerLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </EmployerLayout>
    )
  }

  return (
    <EmployerLayout>
      <div className="space-y-4 px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("job_applications")}</h1>
        </div>

        <div className="grid gap-4">
          {applications.map((application: any) => (
            <Card 
              key={application.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedApplication(application)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{application.jobTitle}</span>
                  <Badge 
                    variant={
                      application.status === "ACCEPTED" ? "secondary" :
                      application.status === "REJECTED" ? "destructive" :
                      "default"
                    }
                  >
                    {application.statusTranslated}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="font-semibold text-lg">{application.worker.name}</p>
                      {application.worker.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{application.worker.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{t("skills")}: {application.worker.skills.join(", ")}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{t("applied_on")}: {application.appliedAt}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/employer/chat/${application.worker.id}`}>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {t("chat")}
                        </Button>
                      </Link>
                      
                      {application.status === "PENDING" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccept(application.id, application.jobId, application.worker.id);
                            }}
                            disabled={processingAction === application.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {processingAction === application.id ? t("processing") : t("accept")}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(application.id, application.jobId, application.worker.id);
                            }}
                            disabled={processingAction === application.id}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            {processingAction === application.id ? t("processing") : t("reject")}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {applications.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {t("no_applications")}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("application_details")}</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t("job_information")}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("job_title")}</p>
                    <p className="font-medium">{selectedApplication.jobTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("application_status")}</p>
                    <Badge 
                      variant={
                        selectedApplication.status === "ACCEPTED" ? "secondary" :
                        selectedApplication.status === "REJECTED" ? "destructive" :
                        "default"
                      }
                    >
                      {selectedApplication.statusTranslated}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("applied_on")}</p>
                    <p className="font-medium">{selectedApplication.appliedAt}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t("worker_information")}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("first_name")}</p>
                    <p className="font-medium">{selectedApplication.worker.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("last_name")}</p>
                    <p className="font-medium">{selectedApplication.worker.lastName}</p>
                  </div>
                  {selectedApplication.worker.location && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t("location")}</p>
                      <p className="font-medium">{selectedApplication.worker.location}</p>
                    </div>
                  )}
                  {selectedApplication.worker.experience && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t("experience")}</p>
                      <p className="font-medium">{selectedApplication.worker.experience}</p>
                    </div>
                  )}
                  {selectedApplication.worker.education && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t("education")}</p>
                      <p className="font-medium">{selectedApplication.worker.education}</p>
                    </div>
                  )}
                  {selectedApplication.worker.languages && selectedApplication.worker.languages.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t("languages")}</p>
                      <p className="font-medium">{selectedApplication.worker.languages.join(", ")}</p>
                    </div>
                  )}
                  {selectedApplication.worker.contactNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t("contact_number")}</p>
                      <p className="font-medium">{selectedApplication.worker.contactNumber}</p>
                    </div>
                  )}
                  {selectedApplication.worker.email && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t("email")}</p>
                      <p className="font-medium">{selectedApplication.worker.email}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("skills")}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedApplication.worker.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedApplication.worker.bio && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t("bio")}</p>
                    <p className="font-medium whitespace-pre-wrap">{selectedApplication.worker.bio}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Link href={`/employer/chat/${selectedApplication.worker.id}`}>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t("chat_with_worker")}
                  </Button>
                </Link>
                {selectedApplication.status === "PENDING" && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => {
                        handleAccept(selectedApplication.id, selectedApplication.jobId, selectedApplication.worker.id);
                        setSelectedApplication(null);
                      }}
                      disabled={processingAction === selectedApplication.id}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {processingAction === selectedApplication.id ? t("processing") : t("accept_application")}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleReject(selectedApplication.id, selectedApplication.jobId, selectedApplication.worker.id);
                        setSelectedApplication(null);
                      }}
                      disabled={processingAction === selectedApplication.id}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {processingAction === selectedApplication.id ? t("processing") : t("reject_application")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </EmployerLayout>
  )
}
