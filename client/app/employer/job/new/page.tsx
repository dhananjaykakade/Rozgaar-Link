"use client"

import type React from "react"

import { EmployerLayout } from "@/components/employer-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, X, Calendar, IndianRupee, Clock, MapPin } from "lucide-react"

export default function NewJobPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (skills.length === 0) {
      toast({
        title: "Missing skills",
        description: "Please add at least one required skill",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
      toast({
        title: "Job Posted",
        description: "Your job has been posted successfully",
      })
      router.push("/employer/dashboard")
    }, 1500)
  }

  return (
    <EmployerLayout>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Post a New Job</CardTitle>
            <CardDescription>Fill in the details to post a new job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" placeholder="e.g. Construction Helper" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea id="description" placeholder="Describe the job in detail" className="min-h-32" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="location" className="pl-8" placeholder="e.g. Andheri East, Mumbai" required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input id="address" placeholder="e.g. Near Metro Station, Andheri East" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wage">Daily Wage (₹)</Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <IndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="wage" type="number" className="pl-8" placeholder="e.g. 600" required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days)</Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="duration" type="number" className="pl-8" placeholder="e.g. 15" required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours">Working Hours</Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="workingHours" className="pl-8" placeholder="e.g. 8 AM - 5 PM" required />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workers">Number of Workers Needed</Label>
                <Select defaultValue="1">
                  <SelectTrigger id="workers">
                    <SelectValue placeholder="Select number of workers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="flex flex-wrap gap-2 border rounded-md p-2 min-h-20">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() => handleRemoveSkill(skill)}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {skill}</span>
                    </Button>
                  </Badge>
                ))}
                {skills.length === 0 && (
                  <p className="text-sm text-muted-foreground p-2">Add skills required for this job</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Add a required skill"
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

            <div className="space-y-2">
              <Label htmlFor="requirements">Additional Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="Any additional requirements or qualifications"
                className="min-h-20"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/employer/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Posting Job..." : "Post Job"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </EmployerLayout>
  )
}

