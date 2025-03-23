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
import { Search, Filter, MoreHorizontal, Eye, Ban, Calendar, MapPin, Briefcase, Star } from "lucide-react"
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

// Sample data for employers
const employersData = [
  {
    id: "e1",
    name: "Sharma Constructions",
    location: "Delhi",
    jobsPosted: 15,
    status: "Active",
    rating: 4.8,
    joinedAt: "2023-05-15",
  },
  {
    id: "e2",
    name: "Tech Solutions",
    location: "Mumbai",
    jobsPosted: 8,
    status: "Active",
    rating: 4.5,
    joinedAt: "2023-06-20",
  },
  {
    id: "e3",
    name: "Green Homes",
    location: "Bangalore",
    jobsPosted: 5,
    status: "Active",
    rating: 4.2,
    joinedAt: "2023-07-10",
  },
  {
    id: "e4",
    name: "Modern Homes",
    location: "Chennai",
    jobsPosted: 12,
    status: "Suspended",
    rating: 3.9,
    joinedAt: "2023-04-05",
  },
  {
    id: "e5",
    name: "Secure Solutions",
    location: "Hyderabad",
    jobsPosted: 3,
    status: "Active",
    rating: 4.0,
    joinedAt: "2023-08-15",
  },
]

export default function EmployersPage() {
  const [employers, setEmployers] = useState(employersData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedEmployer, setSelectedEmployer] = useState<string | null>(null)
  const [suspensionReason, setSuspensionReason] = useState("")
  const [isSuspensionDialogOpen, setIsSuspensionDialogOpen] = useState(false)

  const filteredEmployers = employers.filter((employer) => {
    const matchesSearch =
      employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || employer.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleSuspend = () => {
    if (selectedEmployer) {
      setEmployers(
        employers.map((employer) =>
          employer.id === selectedEmployer ? { ...employer, status: "Suspended" } : employer,
        ),
      )
      // In a real app, this would make an API call to update the employer status
      setIsSuspensionDialogOpen(false)
      setSelectedEmployer(null)
      setSuspensionReason("")
    }
  }

  const handleActivate = (employerId: string) => {
    setEmployers(
      employers.map((employer) => (employer.id === employerId ? { ...employer, status: "Active" } : employer)),
    )
    // In a real app, this would make an API call to update the employer status
  }

  const openSuspensionDialog = (employerId: string) => {
    setSelectedEmployer(employerId)
    setIsSuspensionDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Employers Management</h1>
        <p className="text-muted-foreground">Manage employers on the RozgaarLink platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employers</CardTitle>
          <CardDescription>View and manage all employers registered on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or location..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">Export</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Jobs Posted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      No employers found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployers.map((employer) => (
                    <TableRow key={employer.id}>
                      <TableCell className="font-medium">{employer.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {employer.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          {employer.jobsPosted}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={employer.status === "Active" ? "success" : "destructive"}>
                          {employer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {employer.rating}
                          <Star className="h-4 w-4 ml-1 text-yellow-500 fill-yellow-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {employer.joinedAt}
                        </div>
                      </TableCell>
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
                              <Link href={`/admin/employers/${employer.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {employer.status === "Active" ? (
                              <DropdownMenuItem onClick={() => openSuspensionDialog(employer.id)}>
                                <Ban className="h-4 w-4 mr-2 text-red-600" />
                                Suspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleActivate(employer.id)}>
                                <Star className="h-4 w-4 mr-2 text-green-600" />
                                Activate
                              </DropdownMenuItem>
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

      <Dialog open={isSuspensionDialogOpen} onOpenChange={setIsSuspensionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Employer</DialogTitle>
            <DialogDescription>
              Please provide a reason for suspending this employer. This will prevent them from posting new jobs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for suspension</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for suspension..."
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspensionDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspend}>
              Confirm Suspension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

