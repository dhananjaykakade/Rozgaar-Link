"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, CheckCircle, Flag, User, Briefcase } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Sample data for reports
const reportsData = [
  {
    id: "r1",
    type: "Worker",
    reportedEntity: {
      id: "w1",
      name: "Rahul Sharma",
      type: "Worker",
    },
    reportedBy: {
      id: "e1",
      name: "Sharma Constructions",
      type: "Employer",
    },
    reason: "Did not show up for work",
    status: "Pending",
    reportedAt: "2023-10-15",
    details:
      "Worker accepted the job but did not show up on the scheduled date and time. Did not respond to calls or messages.",
  },
  {
    id: "r2",
    type: "Employer",
    reportedEntity: {
      id: "e2",
      name: "Tech Solutions",
      type: "Employer",
    },
    reportedBy: {
      id: "w2",
      name: "Amit Kumar",
      type: "Worker",
    },
    reason: "Did not pay as agreed",
    status: "Resolved",
    reportedAt: "2023-10-10",
    details:
      "Employer did not pay the agreed amount after the work was completed. Paid only 70% of the agreed amount citing unsatisfactory work.",
  },
  {
    id: "r3",
    type: "Job",
    reportedEntity: {
      id: "j1",
      name: "Plumbing Work Needed",
      type: "Job",
    },
    reportedBy: {
      id: "w3",
      name: "Priya Patel",
      type: "Worker",
    },
    reason: "Fake job posting",
    status: "Pending",
    reportedAt: "2023-10-12",
    details:
      "This job posting seems to be fake. The employer is asking for money upfront as a security deposit before starting the work.",
  },
  {
    id: "r4",
    type: "Worker",
    reportedEntity: {
      id: "w4",
      name: "Sunita Verma",
      type: "Worker",
    },
    reportedBy: {
      id: "e3",
      name: "Green Homes",
      type: "Employer",
    },
    reason: "Unprofessional behavior",
    status: "Pending",
    reportedAt: "2023-10-14",
    details:
      "Worker was rude and unprofessional during the job. Did not follow instructions and left the work incomplete.",
  },
  {
    id: "r5",
    type: "Employer",
    reportedEntity: {
      id: "e4",
      name: "Modern Homes",
      type: "Employer",
    },
    reportedBy: {
      id: "w5",
      name: "Rajesh Singh",
      type: "Worker",
    },
    reason: "Unsafe working conditions",
    status: "Pending",
    reportedAt: "2023-10-16",
    details:
      "The employer did not provide proper safety equipment for working at height. The workplace was unsafe with exposed electrical wires.",
  },
]

export default function ReportsPage() {
  const [reports, setReports] = useState(reportsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<(typeof reportsData)[0] | null>(null)
  const [resolution, setResolution] = useState("")
  const [isResolutionDialogOpen, setIsResolutionDialogOpen] = useState(false)

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reportedEntity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || report.type.toLowerCase() === typeFilter.toLowerCase()
    const matchesStatus = statusFilter === "all" || report.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesType && matchesStatus
  })

  const handleResolve = () => {
    if (selectedReport) {
      setReports(
        reports.map((report) => (report.id === selectedReport.id ? { ...report, status: "Resolved" } : report)),
      )
      // In a real app, this would make an API call to update the report status
      setIsResolutionDialogOpen(false)
      setSelectedReport(null)
      setResolution("")
    }
  }

  const openResolutionDialog = (report: (typeof reportsData)[0]) => {
    setSelectedReport(report)
    setIsResolutionDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports Management</h1>
        <p className="text-muted-foreground">Manage and resolve reports and complaints on the RozgaarLink platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>View and manage all reports submitted by users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="worker">Worker</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                  <SelectItem value="job">Job</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reported Entity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      No reports found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{report.reportedEntity.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{report.reportedEntity.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report.type === "Worker" ? "default" : report.type === "Employer" ? "secondary" : "outline"
                          }
                        >
                          {report.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{report.reportedBy.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{report.reportedBy.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>
                        <Badge variant={report.status === "Resolved" ? "success" : "outline"}>{report.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {report.reportedAt}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openResolutionDialog(report)}
                          disabled={report.status === "Resolved"}
                        >
                          <Flag className="h-4 w-4 mr-2" />
                          {report.status === "Resolved" ? "Resolved" : "Resolve"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isResolutionDialogOpen} onOpenChange={setIsResolutionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>Review the report details and provide a resolution</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Reported Entity</h3>
                  <div className="flex items-center gap-2">
                    {selectedReport.reportedEntity.type === "Worker" ? (
                      <User className="h-4 w-4 text-muted-foreground" />
                    ) : selectedReport.reportedEntity.type === "Employer" ? (
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{selectedReport.reportedEntity.name}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Reported By</h3>
                  <div className="flex items-center gap-2">
                    {selectedReport.reportedBy.type === "Worker" ? (
                      <User className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{selectedReport.reportedBy.name}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">Reason</h3>
                <p>{selectedReport.reason}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Details</h3>
                <p className="text-muted-foreground">{selectedReport.details}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution</Label>
                <Textarea
                  id="resolution"
                  placeholder="Enter the resolution details..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolutionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolve}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

