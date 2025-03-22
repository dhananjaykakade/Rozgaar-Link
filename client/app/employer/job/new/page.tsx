"use client";

import type React from "react";

import { EmployerLayout } from "@/components/employer-layout";

import { useSelector } from "react-redux";
import { selectAuth } from "@/store/slices/authSlice"; // Import selector
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handlePostJob } from "@/lib/jobApi";
import {
  PlusCircle,
  X,
  Calendar,
  IndianRupee,
  Clock,
  MapPin,
} from "lucide-react";

interface JobFormData {
  Title: string;
  Description: string;
  Location: string;
  WorkingHours: string;
  Pay: number;
  StartDate: string; // ✅ Fixed casing to match API (startDate → StartDate)
  NumberOfWorkers: string; // ✅ Fixed casing (numberOfWorkers → NumberOfWorkers)
  Skills: string[]; // ✅ Fixed array type (Skills:[string] → Skills: string[])
  AdditionalRequirements?: string; // ✅ Removed duplicate & made optional
}

export default function NewJobPage() {
  const [formData, setFormData] = useState<JobFormData>({
    Title: "",
    Description: "",
    Location: "",
    Pay: 0, // Changed from dailyWage to Pay
    Skills: [], // Added array for skills
    WorkingHours: "",
    StartDate: "", // Kept as string, will format before sending
    NumberOfWorkers: "ONE", // Backend expects specific values
    AdditionalRequirements: "",
  });

  const { toast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };
  const { user } = useSelector(selectAuth);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
   
      await handlePostJob(formData, user, skills, setSubmitting, toast, router);

  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  return (
    <EmployerLayout>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Post a New Job</CardTitle>
            <CardDescription>
              Fill in the details to post a new job
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="title">Job Title</Label>
    <Input
      id="title"
      name="Title"
      placeholder="e.g. Electrician Needed"
      onChange={handleChange}
      value={formData.Title}
      required
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="description">Job Description</Label>
    <Textarea
      id="description"
      name="Description"
      placeholder="Describe the job in detail"
      onChange={handleChange}
      value={formData.Description}
      className="min-h-32"
      required
    />
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="location">Location</Label>
      <div className="relative flex-1">
        <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="location"
          name="Location"
          className="pl-8"
          placeholder="e.g. New York"
          onChange={handleChange}
          value={formData.Location}
          required
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="wage">Daily Wage (₹)</Label>
      <div className="relative flex-1">
        <IndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="wage"
          name="Pay"
          type="number"
          className="pl-8"
          placeholder="e.g. 500"
          onChange={handleChange}
          value={formData.Pay}
          required
        />
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="workingHours">Working Hours</Label>
      <div className="relative flex-1">
        <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="workingHours"
          name="WorkingHours"
          className="pl-8"
          placeholder="e.g. 9 AM - 5 PM"
          onChange={handleChange}
          value={formData.WorkingHours}
          required
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="startDate">Start Date</Label>
      <Input
        id="startDate"
        name="StartDate"
        type="date"
        onChange={handleChange}
        value={formData.StartDate}
        required
      />
    </div>
  </div>

  <div className="space-y-2">
    <Label htmlFor="workers">Number of Workers Needed</Label>
    <Select
      name="NumberOfWorkers"
      value={formData.NumberOfWorkers}
      onValueChange={(value) =>
        handleChange({ target: { name: "NumberOfWorkers", value, type: "text" } } as React.ChangeEvent<HTMLInputElement>)
      }
    >
      <SelectTrigger id="workers">
        <SelectValue placeholder="Select number of workers" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ONE">1</SelectItem>
        <SelectItem value="TWO">2</SelectItem>
        <SelectItem value="THREE">3</SelectItem>
        <SelectItem value="FOUR">4</SelectItem>
        <SelectItem value="FIVE">5</SelectItem>
        <SelectItem value="TEN_PLUS">10+</SelectItem>
      </SelectContent>
    </Select>
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
            e.preventDefault();
            handleAddSkill();
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
      name="AdditionalRequirements"
      placeholder="Any additional requirements or qualifications"
      onChange={handleChange}
      value={formData.AdditionalRequirements}
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
  );
}
