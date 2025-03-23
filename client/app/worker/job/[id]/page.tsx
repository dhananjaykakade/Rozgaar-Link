"use client";
import { selectAuth, updateProfile } from "@/store/slices/authSlice"; 
import { useSelector, useDispatch } from "react-redux";

import { WorkerLayout } from "@/components/worker-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPinIcon,
  CalendarIcon,
  IndianRupeeIcon,
  Clock,
  BriefcaseIcon,
  CheckCircle,
  MessageSquare,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";

interface Applicant {
  Id: string;
  FirstName: string;
  LastName: string;
  Address: string;
  City: string;
  Number: string;
  Pin: string;
  Availability: string;
  Skills: string[];
  Rating: number;
}

interface Employer {
  Id: string;
  Name: string;
  Number: string;
  CompanyName: string | null;
  ContactPerson: string;
  Email: string | null;
  Website: string | null;
  Address: string;
  City: string;
  Pin: string;
  DescriptionOfWork: string;
  Rating: number;
}

interface Job {
  Id: string;
  Title: string;
  Description: string;
  EmployerId: string;
  Location: string;
  Pay: number;
  Skills: string[];
  WorkingHours: string;
  StartDate: string;
  NumberOfWorkers: string;
  AdditionalRequirements: string;
  Status: string;
  CreatedAt: string;
  Employer: Employer;
  Applicants: Applicant[];
}

interface CheckStatus {
  JobId: string;
  Status: string;
}

export default function JobDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const { user } = useSelector(selectAuth); 
  // ✅ Fetch Job Data from API
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Fetch job details
        const response = await axios.get(`http://localhost:4000/api/job/${id}`);
        setJob(response.data.data);
        console.log(response.data.data);
  
        // Fetch job applications for the worker
        const response2 = await axios.get(`http://localhost:4000/api/job/worker/${user?.Id}`);
        console.log(response2.data.data);
  

    // Filter job applications for the worker where the jobId matches and the status is "PENDING"
     response2.data.data.forEach(job => {
if(job.Job.Id === id && job.Status ==="PENDING" ){
  setApplied(true);
}
    })
   


        // If the worker has applied to the job with a "pending" status, set `isApplied` to true
   
        
      } catch (err) {
        setError("Failed to load job details.");
        console.error(err);  // Log the error for debugging
      } finally {
        setLoading(false);  // Hide loading indicator once the request is complete
      }
    };
  
    // Fetch job details if `id` is available
    if (id) fetchJobDetails();
  }, [id, user?.Id]);

  const handleApply = async () => {
    const response = await axios.post(`http://localhost:4000/api/job/${id}/apply`
      ,{
        WorkerId: user?.Id,

      }
    )
    try {
      alert("applied")
    setApplied(true);
      // Set applied state to true when the application is successful
  } catch (err) {
    console.error(err);
    setError("Failed to apply job details");
  } finally {
    setApplying(false);  // Set applying state back to false when the request finishes
  }
};
 

  if (loading) {
    return (
      <WorkerLayout>
        <div className="container py-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </WorkerLayout>
    );
  }

  if (error || !job) {
    return (
      <WorkerLayout>
        <div className="container py-6 text-center">
          <p className="text-red-500">{error || "No job details found."}</p>
        </div>
      </WorkerLayout>
    );
  }

  return (
    <WorkerLayout>
      <div className="container py-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{job.Title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {job.Location}
                    </CardDescription>
                  </div>
                  <Badge variant={job.Status === "ACTIVE" ? "default" : "secondary"}>
                    {job.Status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <IndianRupeeIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">₹{job.Pay}</p>
                      <p className="text-xs text-muted-foreground">Daily wage</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{job.NumberOfWorkers}</p>
                      <p className="text-xs text-muted-foreground">Workers needed</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{job.WorkingHours}</p>
                      <p className="text-xs text-muted-foreground">Working hours</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Job Description</h3>
                  <p className="text-sm text-muted-foreground">{job.Description}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.Skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Job</CardTitle>
              </CardHeader>
              <CardContent>
              {applied ? (
  <div className="text-center py-4">
    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
    <h3 className="font-medium text-lg">Application Sent!</h3>
  </div>
) : (
  <Button 
    onClick={handleApply} 
    disabled={applied || applying}
  >
    {applying ? 'Applying...' : 'Apply Now'}
  </Button>
)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About the Employer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
               <Avatar className="h-24 w-24">
                    {!user ? (
  <AvatarFallback className="text-xl">A</AvatarFallback>
) : (
  <AvatarFallback className="text-xl">{user.companyName?.charAt(0) || "U"}</AvatarFallback>
)}
                    </Avatar>
                  <div>
                    <p className="font-medium">{job.Employer?.Name}</p>
                    <p className="text-sm text-muted-foreground">{job.Employer?.Rating} ★</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WorkerLayout>
  );
}
