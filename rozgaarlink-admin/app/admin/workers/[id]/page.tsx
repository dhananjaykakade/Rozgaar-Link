"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, MapPin, Phone, Mail, Calendar, Star, CheckCircle, XCircle } from "lucide-react"
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

// Sample worker data
const workerData = {
  id: "w1",
  name: "Rahul Sharma",
  skills: ["Plumbing", "Electrical", "Carpentry"],
  location: "Delhi, India",
  status: "Pending",
  rating: 4.5,
  phone: "+91 9876543210",
  email: "rahul.sharma@example.com",
  joinedAt: "15 Sep 2023",
  completedJobs: 28,
  bio: "Experienced plumber and electrician with 5 years of work experience in residential and commercial projects.",
  documents: [
    {
      type: "ID Proof",
      name: "Aadhar Card",
      verified: false,
      url: "/placeholder.svg?height=300&width=400",
    },
    {
      type: "Address Proof",
      name: "Electricity Bill",
      verified: false,
      url: "/placeholder.svg?height=300&width=400",
    },
    {
      type: "Skill Certificate",
      name: "Plumbing Certificate",
      verified: false,
      url: "/placeholder.svg?height=300&width=400",
    },
  ],
  workHistory: [
    {
      id: "job1",
      title: "Bathroom Plumbing Repair",
      employer: "Sharma Residence",
      date: "10 Aug 2023",
      rating: 5,
      feedback: "Excellent work, very professional and timely.",
    },
    {
      id: "job2",
      title: "Electrical Wiring Installation",
      employer: "ABC Office Complex",
      date: "25 Jul 2023",
      rating: 4,
      feedback: "Good work, completed on time.",
    },
    {
      id: "job3",
      title: "Kitchen Sink Installation",
      employer: "Patel Residence",
      date: "15 Jul 2023",
      rating: 4.5,
      feedback: "Very satisfied with the work quality.",
    },
  ],
}

export default function WorkerDetailPage({ params }: { params: { id: string } }) {
  const [worker, setWorker] = useState(workerData)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false)
  const router = useRouter()

  const handleApprove = () => {
    setWorker({ ...worker, status: "Verified" })
    // In a real app, this would make an API call to update the worker status
    router.push("/admin/workers")
  }

  const handleReject = () => {
    setWorker({ ...worker, status: "Rejected" })
    // In a real app, this would make an API call to update the worker status
    setIsRejectionDialogOpen(false)
    router.push("/admin/workers")
  }

  const handleDocumentVerify = (index: number) => {
    const updatedDocuments = [...worker.documents]
    updatedDocuments[index] = { ...updatedDocuments[index], verified: true }
    setWorker({ ...worker, documents: updatedDocuments })
    // In a real app, this would make an API call to update the document status
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/workers">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Worker Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Personal and contact details of the worker</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">{worker.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{worker.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{worker.location}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {worker.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{worker.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{worker.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined on {worker.joinedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span>
                  {worker.rating} Rating ({worker.completedJobs} jobs completed)
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">About</h3>
              <p className="text-muted-foreground">{worker.bio}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <div>
              <Badge
                variant={
                  worker.status === "Verified" ? "success" : worker.status === "Rejected" ? "destructive" : "outline"
                }
                className="text-sm"
              >
                {worker.status}
              </Badge>
            </div>
            {worker.status === "Pending" && (
              <div className="flex gap-2">
                <Button variant="outline" className="text-red-600" onClick={() => setIsRejectionDialogOpen(true)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button variant="default" onClick={handleApprove}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Verification</CardTitle>
              <CardDescription>Verify the worker's identity and qualification documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {worker.documents.map((doc, index) => (
                  <div key={doc.type} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{doc.type}</h3>
                        <p className="text-sm text-muted-foreground">{doc.name}</p>
                      </div>
                      {doc.verified ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleDocumentVerify(index)}>
                          Verify
                        </Button>
                      )}
                    </div>
                    <div className="mt-2 border rounded-md overflow-hidden">
                      <img src={doc.url || "/placeholder.svg"} alt={doc.name} className="w-full h-auto object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Work History</CardTitle>
              <CardDescription>Previous jobs completed by the worker</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {worker.workHistory.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{job.title}</h3>
                      <div className="flex items-center">
                        <span className="mr-1">{job.rating}</span>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                    <p className="text-sm">{job.employer}</p>
                    <p className="text-sm text-muted-foreground">{job.date}</p>
                    <p className="text-sm mt-2 italic">"{job.feedback}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Worker Verification</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this worker's verification. This will be sent to the worker.
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

