"use client"

import type React from "react"

import { EmployerLayout } from "@/components/employer-layout"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Camera, MapPin, Phone, Mail, Star, Briefcase, Edit, Building, Calendar, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

// Mock employer data
const EMPLOYER = {
  id: "emp1",
  name: "Employer User",
  companyName: "ABC Construction",
  contactPerson: "John Smith",
  phone: "+91 98765 43210",
  email: "employer@example.com",
  address: "Andheri East, Mumbai, Maharashtra",
  city: "Mumbai",
  pincode: "400069",
  website: "https://abcconstruction.example.com",
  description:
    "ABC Construction is a leading construction company specializing in residential and commercial projects. We have been in business for over 10 years and have completed more than 100 projects.",
  rating: 4.6,
  reviews: 28,
  memberSince: "March 2025",
  jobsPosted: 15,
  activeJobs: 3,
  hiredCount: 42,
  verificationStatus: {
    businessProof: "verified",
    addressProof: "verified",
  },
  postedJobs: [
    {
      id: "job1",
      title: "Construction Helper",
      location: "Andheri East, Mumbai",
      wage: "₹600 per day",
      duration: "15 days",
      postedOn: "March 20, 2025",
      status: "active",
      applicants: 12,
      hired: 3,
    },
    {
      id: "job2",
      title: "Plumbing Work",
      location: "Powai, Mumbai",
      wage: "₹800 per day",
      duration: "3 days",
      postedOn: "March 15, 2025",
      status: "active",
      applicants: 8,
      hired: 1,
    },
    {
      id: "job3",
      title: "Electrician Needed",
      location: "Bandra West, Mumbai",
      wage: "₹900 per day",
      duration: "2 days",
      postedOn: "March 10, 2025",
      status: "completed",
      applicants: 15,
      hired: 2,
    },
    {
      id: "job4",
      title: "Gardening & Landscaping",
      location: "Juhu, Mumbai",
      wage: "₹550 per day",
      duration: "7 days",
      postedOn: "February 25, 2025",
      status: "completed",
      applicants: 6,
      hired: 1,
    },
    {
      id: "job5",
      title: "House Painting",
      location: "Malad, Mumbai",
      wage: "₹700 per day",
      duration: "10 days",
      postedOn: "February 15, 2025",
      status: "completed",
      applicants: 10,
      hired: 3,
    },
  ],
  ratings: [
    {
      id: "rating1",
      worker: "Rahul Kumar",
      rating: 5,
      feedback: "Great employer, paid on time and provided good working conditions.",
      date: "March 12, 2025",
    },
    {
      id: "rating2",
      worker: "Suresh Patel",
      rating: 4,
      feedback: "Good experience working with them. Clear instructions and fair pay.",
      date: "February 28, 2025",
    },
    {
      id: "rating3",
      worker: "Amit Singh",
      rating: 5,
      feedback: "Very professional and respectful. Would work for them again.",
      date: "February 20, 2025",
    },
    {
      id: "rating4",
      worker: "Priya Sharma",
      rating: 4,
      feedback: "Good employer, but sometimes communication could be better.",
      date: "January 15, 2025",
    },
  ],
}

export default function EmployerProfilePage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({
    companyName: EMPLOYER.companyName,
    contactPerson: EMPLOYER.contactPerson,
    address: EMPLOYER.address,
    city: EMPLOYER.city,
    pincode: EMPLOYER.pincode,
    website: EMPLOYER.website,
    description: EMPLOYER.description,
  })
  const [showRatingDetails, setShowRatingDetails] = useState(false)
  const [selectedRating, setSelectedRating] = useState<(typeof EMPLOYER.ratings)[0] | null>(null)

  const handleSaveProfile = () => {
    setSaving(true)

    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      setEditMode(false)
      toast({
        title: "Profile Updated",
        description: "Your company profile has been updated successfully",
      })
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setProfileData({
      ...profileData,
      [id]: value,
    })
  }

  const viewRatingDetails = (rating: (typeof EMPLOYER.ratings)[0]) => {
    setSelectedRating(rating)
    setShowRatingDetails(true)
  }

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0
    const total = 4 // Total number of sections to complete

    if (profileData.companyName && profileData.contactPerson) completed++
    if (profileData.address && profileData.city && profileData.pincode) completed++
    if (profileData.description) completed++
    if (EMPLOYER.verificationStatus.businessProof === "verified") completed++

    return (completed / total) * 100
  }

  const profileCompletionPercentage = calculateProfileCompletion()

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

  return (
    <EmployerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Company Profile</h1>
            <p className="text-muted-foreground">Manage your company information and job history</p>
          </div>
          <Button
            onClick={() => setEditMode(!editMode)}
            variant={editMode ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {editMode ? "Cancel Editing" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-xl">{EMPLOYER.companyName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Upload logo</span>
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold">{EMPLOYER.companyName}</h2>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{EMPLOYER.rating}</span>
                    <span className="text-muted-foreground">({EMPLOYER.reviews} reviews)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Member since {EMPLOYER.memberSince}</p>

                  <div className="mt-4 w-full space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{EMPLOYER.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{EMPLOYER.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{EMPLOYER.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{EMPLOYER.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profile completion</span>
                      <span className="font-medium">{Math.round(profileCompletionPercentage)}%</span>
                    </div>
                    <Progress value={profileCompletionPercentage} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>Jobs Posted</span>
                      </div>
                      <p className="font-medium text-lg">{EMPLOYER.jobsPosted}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Active Jobs</span>
                      </div>
                      <p className="font-medium text-lg">{EMPLOYER.activeJobs}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Workers Hired</span>
                      </div>
                      <p className="font-medium text-lg">{EMPLOYER.hiredCount}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span>Rating</span>
                      </div>
                      <p className="font-medium text-lg">{EMPLOYER.rating}/5</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile form */}
          <div className="md:col-span-2">
            <Tabs defaultValue="company">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="company">Company Info</TabsTrigger>
                <TabsTrigger value="jobs">Job History</TabsTrigger>
                <TabsTrigger value="ratings">Ratings</TabsTrigger>
              </TabsList>

              <TabsContent value="company" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Update your company details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={profileData.companyName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input
                        id="contactPerson"
                        value={profileData.contactPerson}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={EMPLOYER.phone} disabled />
                      <p className="text-xs text-muted-foreground">Phone number cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={EMPLOYER.email} disabled />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profileData.website}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={profileData.city} onChange={handleInputChange} disabled={!editMode} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input
                          id="pincode"
                          value={profileData.pincode}
                          onChange={handleInputChange}
                          disabled={!editMode}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Company Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your company"
                        className="min-h-32"
                        value={profileData.description}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                  </CardContent>
                  {editMode && (
                    <CardFooter>
                      <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="jobs" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Job History</CardTitle>
                    <CardDescription>Jobs you have posted</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {EMPLOYER.postedJobs.length > 0 ? (
                      <div className="space-y-4">
                        {EMPLOYER.postedJobs.map((job) => (
                          <div key={job.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{job.title}</h3>
                                <p className="text-sm text-muted-foreground">{job.location}</p>
                              </div>
                              <Badge variant={job.status === "active" ? "default" : "secondary"}>
                                {job.status === "active" ? "Active" : "Completed"}
                              </Badge>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Wage: </span>
                                <span>{job.wage}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Duration: </span>
                                <span>{job.duration}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Applicants: </span>
                                <span>{job.applicants}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Hired: </span>
                                <span>{job.hired}</span>
                              </div>
                            </div>

                            <div className="mt-3 flex justify-between items-center">
                              <p className="text-xs text-muted-foreground">Posted on {job.postedOn}</p>
                              {job.status === "active" && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`/employer/job/${job.id}/applications`}>View Applications</a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No jobs posted yet</p>
                        <Button variant="outline" className="mt-2" asChild>
                          <a href="/employer/job/new">Post a Job</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ratings" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Ratings & Reviews</CardTitle>
                        <CardDescription>Feedback from workers</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold">{EMPLOYER.rating}</div>
                        <div className="flex">{renderStars(EMPLOYER.rating)}</div>
                        <div className="text-sm text-muted-foreground">({EMPLOYER.reviews})</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {EMPLOYER.ratings.length > 0 ? (
                      <div className="space-y-4">
                        {EMPLOYER.ratings.map((rating) => (
                          <div key={rating.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{rating.worker}</h3>
                                <div className="flex items-center gap-1 mt-1">{renderStars(rating.rating)}</div>
                              </div>
                              <p className="text-sm text-muted-foreground">{rating.date}</p>
                            </div>

                            <div className="mt-2">
                              <p className="text-sm italic">"{rating.feedback}"</p>
                            </div>

                            <Button
                              variant="link"
                              className="text-xs p-0 h-auto mt-2"
                              onClick={() => viewRatingDetails(rating)}
                            >
                              View Details
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No ratings yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Rating Details Dialog */}
      <Dialog open={showRatingDetails} onOpenChange={setShowRatingDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rating Details</DialogTitle>
            <DialogDescription>Detailed feedback from worker</DialogDescription>
          </DialogHeader>

          {selectedRating && (
            <div className="space-y-4 mt-2">
              <div>
                <h3 className="font-medium text-lg">{selectedRating.worker}</h3>
                <p className="text-sm text-muted-foreground">{selectedRating.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xl font-bold">{selectedRating.rating}/5</div>
                <div className="flex">{renderStars(selectedRating.rating)}</div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Feedback</h4>
                <p className="text-sm">{selectedRating.feedback}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowRatingDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EmployerLayout>
  )
}

