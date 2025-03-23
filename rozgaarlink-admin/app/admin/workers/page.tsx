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
import { Search, Filter, MoreHorizontal, Eye, CheckCircle, XCircle, Star } from "lucide-react"

// Sample data for workers
const workersData = [
  {
    id: "w1",
    name: "Rahul Sharma",
    skills: ["Plumbing", "Electrical"],
    location: "Delhi",
    status: "Pending",
    rating: 4.5,
    joinedAt: "2023-09-15",
  },
  {
    id: "w2",
    name: "Priya Patel",
    skills: ["Carpentry", "Painting"],
    location: "Mumbai",
    status: "Verified",
    rating: 4.8,
    joinedAt: "2023-08-20",
  },
  {
    id: "w3",
    name: "Amit Kumar",
    skills: ["Gardening", "Cleaning"],
    location: "Bangalore",
    status: "Pending",
    rating: 0,
    joinedAt: "2023-10-05",
  },
  {
    id: "w4",
    name: "Sunita Verma",
    skills: ["Cooking", "Cleaning"],
    location: "Chennai",
    status: "Verified",
    rating: 4.2,
    joinedAt: "2023-07-12",
  },
  {
    id: "w5",
    name: "Rajesh Singh",
    skills: ["Driving", "Security"],
    location: "Hyderabad",
    status: "Rejected",
    rating: 3.9,
    joinedAt: "2023-06-30",
  },
]

export default function WorkersPage() {
  const [workers, setWorkers] = useState(workersData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      worker.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || worker.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (workerId: string, newStatus: "Verified" | "Rejected") => {
    setWorkers(workers.map((worker) => (worker.id === workerId ? { ...worker, status: newStatus } : worker)))
    // In a real app, this would make an API call to update the worker status
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workers Management</h1>
        <p className="text-muted-foreground">Manage and verify workers on the RozgaarLink platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workers</CardTitle>
          <CardDescription>View and manage all workers registered on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, skills, or location..."
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
                  <SelectItem value="verified">Verified</SelectItem>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      No workers found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium">{worker.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {worker.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{worker.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            worker.status === "Verified"
                              ? "success"
                              : worker.status === "Rejected"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {worker.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {worker.rating > 0 ? (
                          <div className="flex items-center">
                            {worker.rating}
                            <Star className="h-4 w-4 ml-1 text-yellow-500 fill-yellow-500" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{worker.joinedAt}</TableCell>
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
                              <Link href={`/admin/workers/${worker.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {worker.status === "Pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusChange(worker.id, "Verified")}>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(worker.id, "Rejected")}>
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
    </div>
  )
}

