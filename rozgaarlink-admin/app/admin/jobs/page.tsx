"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MoreHorizontal, Eye, CheckCircle, XCircle, Calendar, MapPin, Building2 } from "lucide-react"
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

// Sample data for jobs
const jobsData = [
  {
    id: "j1",
    title: "Plumbing Work Needed",
    employer: "Sharma Constructions",
    location: "Delhi",
    wage: "₹500/day",
    status: "Pending",
    postedAt: "2023-10-15",
    applications: 5,
  },
  {
    id: "j2",
    title: "Electrician for Office Setup",
    employer: "Tech Solutions",
    location: "Mumbai",
    wage: "₹600/day",
    status: "Approved",
    postedAt: "2023-10-10",
    applications: 12,
  },
  {
    id: "j3",
    title: "Gardener for Villa",
    employer: "Green Homes",
    location: "Bangalore",
    wage: "₹450/day",
    status: "Pending",
    postedAt: "2023-10-17",
    applications: 3,
  },
  {
    id: "j4",
    title: "Painter for New Apartment",
    employer: "Modern Homes",
    location: "Chennai",
    wage: "₹550/day",
    status: "Approved",
    postedAt: "2023-10-05",
    applications: 8,
  },
  {
    id: "j5",
    title: "Security Guard for Office",
    employer: "Secure Solutions",
    location: "Hyderabad",
    wage: "₹400/day",
    status: "Rejected",
    postedAt: "2023-10-02",
    applications: 0,
  },
]

export default function JobsPage() {
  const [jobs, setJobs] = useState(jobsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false)

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleApprove = (jobId: string) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: "Approved" } : job)))
    // In a real app, this would make an API call to update the job status
  }

  const handleReject = () => {
    if (selectedJob) {
      setJobs(jobs.map((job) => (job.id === selectedJob ? { ...job, status: "Rejected" } : job)))
      // In a real app, this would make an API call to update the job status
      setIsRejectionDialogOpen(false)
      setSelectedJob(null)
      setRejectionReason("")
    }
  }

  const openRejectionDialog = (jobId: string) => {
    setSelectedJob(jobId)
    setIsRejectionDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Jobs Management</h1>
        <p className="text-muted-foreground">Manage and approve job postings on the RozgaarLink platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
          <CardDescription>View and manage all job postings on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, employer, or location..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">Export</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Wage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                      No jobs found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {job.employer}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell>{job.wage}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            job.status === "Approved"
                              ? "success"
                              : job.status === "Rejected"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {job.postedAt}
                        </div>
                      </TableCell>
                      <TableCell>{job.applications}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/jobs/${job.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {job.status === "Pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(job.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openRejectionDialog(job.id)}>
                                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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

