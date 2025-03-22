"use client"

import type React from "react"

import { WorkerLayout } from "@/components/worker-layout"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { PlusCircle, X, Camera, MapPin, Phone, Calendar, Star, Briefcase, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

// Mock worker data
const WORKER = {
  id: "worker1",
  name: "Worker User",
  firstName: "Worker",
  lastName: "User",
  phone: "+91 98765 43210",
  email: "worker@example.com",
  address: "Andheri East, Mumbai, Maharashtra",
  city: "Mumbai",
  pincode: "400069",
  availability: "immediate",
  skills: ["Construction", "Painting", "Plumbing"],
  experience:
    "I have 5 years of experience in construction work, including painting, plumbing, and general labor. I have worked on residential and commercial projects.",
  education: "ITI Diploma in Plumbing",
  rating: 4.8,
  reviews: 15,
  memberSince: "March 2025",
  completedJobs: 24,
  ongoingJobs: 1,
  verificationStatus: {
    idProof: "verified",
    addressProof: "pending",
    skillCertificates: "not_submitted",
  },
  pastJobs: [
    {
      id: "job1",
      title: "Construction Helper",
      employer: "ABC Construction",
      location: "Andheri, Mumbai",
      duration: "15 days",
      wage: "₹600 per day",
      completedOn: "February 15, 2025",
      rating: 5,
      feedback: "Excellent work, very punctual and skilled.",
    },
    {
      id: "job2",
      title: "Plumbing Work",
      employer: "XYZ Maintenance",
      location: "Powai, Mumbai",
      duration: "3 days",
      wage: "₹800 per day",
      completedOn: "January 20, 2025",
      rating: 4,
      feedback: "Good work, completed on time.",
    },
    {
      id: "job3",
      title: "Painting",
      employer: "Modern Interiors",
      location: "Bandra, Mumbai",
      duration: "7 days",
      wage: "₹700 per day",
      completedOn: "December 10, 2024",
      rating: 5,
      feedback: "Very professional and skilled painter.",
    },
  ],
  ratings: [
    {
      id: "rating1",
      employer: "ABC Construction",
      rating: 5,
      feedback: "Excellent work, very punctual and skilled.",
      date: "February 15, 2025",
    },
    {
      id: "rating2",
      employer: "XYZ Maintenance",
      rating: 4,
      feedback: "Good work, completed on time.",
      date: "January 20, 2025",
    },
    {
      id: "rating3",
      employer: "Modern Interiors",
      rating: 5,
      feedback: "Very professional and skilled painter.",
      date: "December 10, 2024",
    },
  ],
}

export default function ProfilePage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [skills, setSkills] = useState<string[]>(WORKER.skills)
  const [newSkill, setNewSkill] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: WORKER.firstName,
    lastName: WORKER.lastName,
    address: WORKER.address,
    city: WORKER.city,
    pincode: WORKER.pincode,
    availability: WORKER.availability,
    experience: WORKER.experience,
    education: WORKER.education,
  })
  const [showRatingDetails, setShowRatingDetails] = useState(false)
  const [selectedRating, setSelectedRating] = useState<(typeof WORKER.ratings)[0] | null>(null)

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleSaveProfile = () => {
    setSaving(true)

    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      setEditMode(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
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

  const handleSelectChange = (value: string) => {
    setProfileData({
      ...profileData,
      availability: value,
    })
  }

  const viewRatingDetails = (rating: (typeof WORKER.ratings)[0]) => {
    setSelectedRating(rating)
    setShowRatingDetails(true)
  }

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0
    const total = 5 // Total number of sections to complete

    if (profileData.firstName && profileData.lastName) completed++
    if (profileData.address && profileData.city && profileData.pincode) completed++
    if (skills.length > 0) completed++
    if (profileData.experience) completed++
    if (WORKER.verificationStatus.idProof === "verified") completed++

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
    <WorkerLayout>
      <div className="container py-6 px-4 md:px-8 lg:px-12">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
              <p className="text-muted-foreground">{t("profile.update_profile")}</p>
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
                        <AvatarFallback className="text-xl">{WORKER.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Upload photo</span>
                      </Button>
                    </div>
                    <h2 className="text-xl font-bold">{WORKER.name}</h2>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{WORKER.rating}</span>
                      <span className="text-muted-foreground">({WORKER.reviews} reviews)</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Member since {WORKER.memberSince}</p>

                    <div className="mt-4 w-full space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{WORKER.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{WORKER.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Available: {WORKER.availability === "immediate" ? "Immediately" : WORKER.availability}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{WORKER.completedJobs} jobs completed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
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

                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                        >
                          ✓
                        </Badge>
                        <span>Basic information</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                        >
                          ✓
                        </Badge>
                        <span>Skills added</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`h-5 w-5 rounded-full p-0 flex items-center justify-center ${profileData.experience ? "bg-green-50 text-green-700 border-green-200" : ""}`}
                        >
                          {profileData.experience ? "✓" : "!"}
                        </Badge>
                        <span>Add work experience</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`h-5 w-5 rounded-full p-0 flex items-center justify-center ${WORKER.verificationStatus.idProof === "verified" ? "bg-green-50 text-green-700 border-green-200" : ""}`}
                        >
                          {WORKER.verificationStatus.idProof === "verified" ? "✓" : "!"}
                        </Badge>
                        <span>Upload ID proof</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile form */}
            <div className="md:col-span-2">
              <Tabs defaultValue="personal">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">{t("profile.personal_info")}</TabsTrigger>
                  <TabsTrigger value="skills">{t("profile.skills")}</TabsTrigger>
                  <TabsTrigger value="jobs">Past Jobs</TabsTrigger>
                  <TabsTrigger value="ratings">Ratings</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("profile.personal_info")}</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">{t("profile.first_name")}</Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">{t("profile.last_name")}</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("auth.phone")}</Label>
                        <Input id="phone" value={WORKER.phone} disabled />
                        <p className="text-xs text-muted-foreground">Phone number cannot be changed</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">{t("profile.address")}</Label>
                        <Textarea
                          id="address"
                          value={profileData.address}
                          onChange={handleInputChange}
                          disabled={!editMode}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">{t("profile.city")}</Label>
                          <Input id="city" value={profileData.city} onChange={handleInputChange} disabled={!editMode} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">{t("profile.pincode")}</Label>
                          <Input
                            id="pincode"
                            value={profileData.pincode}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="availability">{t("profile.availability")}</Label>
                        <Select
                          value={profileData.availability}
                          onValueChange={handleSelectChange}
                          disabled={!editMode}
                        >
                          <SelectTrigger id="availability">
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="1week">Within 1 week</SelectItem>
                            <SelectItem value="2weeks">Within 2 weeks</SelectItem>
                            <SelectItem value="1month">Within 1 month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                    {editMode && (
                      <CardFooter>
                        <Button onClick={handleSaveProfile} disabled={saving}>
                          {saving ? t("profile.saving") : t("profile.save_changes")}
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="skills" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("profile.skills")}</CardTitle>
                      <CardDescription>Add your skills to get matched with relevant jobs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t("profile.your_skills")}</Label>
                        <div className="flex flex-wrap gap-2 border rounded-md p-2 min-h-20">
                          {skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                              {skill}
                              {editMode && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 rounded-full"
                                  onClick={() => handleRemoveSkill(skill)}
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">Remove {skill}</span>
                                </Button>
                              )}
                            </Badge>
                          ))}
                          {skills.length === 0 && (
                            <p className="text-sm text-muted-foreground p-2">Add skills to improve job matching</p>
                          )}
                        </div>
                      </div>

                      {editMode && (
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              placeholder={t("profile.add_skill")}
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  handleAddSkill()
                                }
                              }}
                            />
                          </div>
                          <Button type="button" onClick={handleAddSkill} variant="secondary">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      )}

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="experience">{t("profile.work_experience")}</Label>
                        <Textarea
                          id="experience"
                          placeholder="Describe your previous work experience"
                          className="min-h-32"
                          value={profileData.experience}
                          onChange={handleInputChange}
                          disabled={!editMode}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="education">{t("profile.education")}</Label>
                        <Textarea
                          id="education"
                          placeholder="List any relevant education or training"
                          className="min-h-20"
                          value={profileData.education}
                          onChange={handleInputChange}
                          disabled={!editMode}
                        />
                      </div>
                    </CardContent>
                    {editMode && (
                      <CardFooter>
                        <Button onClick={handleSaveProfile} disabled={saving}>
                          {saving ? t("profile.saving") : t("profile.save_changes")}
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="jobs" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Past Jobs</CardTitle>
                      <CardDescription>Your job history and completed work</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {WORKER.pastJobs.length > 0 ? (
                        <div className="space-y-4">
                          {WORKER.pastJobs.map((job) => (
                            <div key={job.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{job.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {job.employer} • {job.location}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">{job.wage}</p>
                                  <p className="text-xs text-muted-foreground">{job.duration}</p>
                                </div>
                              </div>

                              <div className="mt-3 flex justify-between items-center">
                                <div className="flex items-center gap-1">{renderStars(job.rating)}</div>
                                <p className="text-xs text-muted-foreground">Completed on {job.completedOn}</p>
                              </div>

                              {job.feedback && (
                                <div className="mt-2 text-sm">
                                  <p className="italic">"{job.feedback}"</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No past jobs found</p>
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
                          <CardDescription>Feedback from employers</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold">{WORKER.rating}</div>
                          <div className="flex">{renderStars(WORKER.rating)}</div>
                          <div className="text-sm text-muted-foreground">({WORKER.reviews})</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {WORKER.ratings.length > 0 ? (
                        <div className="space-y-4">
                          {WORKER.ratings.map((rating) => (
                            <div key={rating.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{rating.employer}</h3>
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
      </div>

      {/* Rating Details Dialog */}
      <Dialog open={showRatingDetails} onOpenChange={setShowRatingDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rating Details</DialogTitle>
            <DialogDescription>Detailed feedback from employer</DialogDescription>
          </DialogHeader>

          {selectedRating && (
            <div className="space-y-4 mt-2">
              <div>
                <h3 className="font-medium text-lg">{selectedRating.employer}</h3>
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
    </WorkerLayout>
  )
}

