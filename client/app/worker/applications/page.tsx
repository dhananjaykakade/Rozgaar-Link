"use client"
import { selectAuth, updateProfile } from "@/store/slices/authSlice"; 
import { useSelector, useDispatch } from "react-redux";
import { WorkerLayout } from "@/components/worker-layout";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  CalendarIcon,
  IndianRupeeIcon,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock3,
  Search,
  Axis3dIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ApplicationSkeleton } from "@/components/application-skeleton";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/star-rating";
import axios from "axios";

// Mock application data
interface Employer {
  Name: string;
}

interface Job {
  Id: string;
  Title: string;
  Description: string;
  Employer: Employer;
}

interface Application {
  Id: string;
  JobId: string;
  WorkerId: string;
  Status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED"; // You can define exact status values if needed
  AppliedAt: string;
  Job: Job;
}
export default function ApplicationsPage() {
  const { user } = useSelector(selectAuth); 
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Simulate loading state
  useEffect(() => {
    const fetchApplication = async() => {
      const response = await axios.get(`http://localhost:4000/api/worker/${user?.Id}/applications`);
      console.log(response.data.data);
      setApplications(response.data.data);
      setLoading(false);
    }
    fetchApplication();
  }, [user?.Id]);

  // Filter applications based on search term
  const filteredApplications = applications.filter((app) => {
    return (
      app.Job.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.Job.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.Job.Employer.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const pendingApplications = filteredApplications.filter((app) => app.Status === "PENDING");
  const acceptedApplications = filteredApplications.filter((app) => app.Status === "ACCEPTED");
  const rejectedApplications = filteredApplications.filter((app) => app.Status === "REJECTED");
  const completedApplications = filteredApplications.filter((app) => app.Status === "COMPLETED");

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock3 className="h-3 w-3" />
            {t("worker.pending")}
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {t("worker.accepted")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            {t("worker.rejected")}
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const ApplicationCard = ({ application }: { application: Application }) => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{application.Job.Title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              {/* Optional: Add location or other properties if available */}
            </CardDescription>
          </div>
          <StatusBadge status={application.Status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{application.Job.Employer.Name}</p>
          </div>
          <p className="text-xs text-muted-foreground">Applied on {new Date(application.AppliedAt).toLocaleDateString()}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex gap-2">
          <Link href={`/worker/job/${application.Job.Id}`}>
            <Button variant="outline" size="sm">
              {t("worker.view_job")}
            </Button>
          </Link>
        </div>
  
        {application.Status === "COMPLETED" && !application.isRated && (
          <Link href={`/worker/rate-employer/${application.Job.Employer.Name}`}>
            <Button size="sm" variant="secondary">
              Rate Employer
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <WorkerLayout>
      <div className="container py-6 px-4 md:px-8 lg:px-12">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{t("worker.applications")}</h1>
              <p className="text-muted-foreground">{t("worker.track_applications")}</p>
            </div>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-[250px]"
              />
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({filteredApplications.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
              <TabsTrigger value="accepted">Accepted ({acceptedApplications.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedApplications.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <ApplicationSkeleton key={index} />
                  ))}
                </div>
              ) : filteredApplications.length > 0 ? (
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <ApplicationCard key={application.Id} application={application} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">{t("worker.no_applications")}</p>
                  <Link href="/worker/dashboard">
                    <Button variant="link">{t("worker.browse_jobs_link")}</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <ApplicationSkeleton key={index} />
                  ))}
                </div>
              ) : pendingApplications.length > 0 ? (
                <div className="space-y-4">
                  {pendingApplications.map((application) => (
                    <ApplicationCard key={application.Id} application={application} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">No pending applications</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="accepted" className="mt-4">
              {loading ? (
                <div className="space-y-4">
                  <ApplicationSkeleton />
                </div>
              ) : acceptedApplications.length > 0 ? (
                <div className="space-y-4">
                  {acceptedApplications.map((application) => (
                    <ApplicationCard key={application.Id} application={application} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">No accepted applications</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              {loading ? (
                <div className="space-y-4">
                  <ApplicationSkeleton />
                </div>
              ) : completedApplications.length > 0 ? (
                <div className="space-y-4">
                  {completedApplications.map((application) => (
                    <ApplicationCard key={application.Id} application={application} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">No completed applications</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="mt-4">
              {loading ? (
                <div className="space-y-4">
                  <ApplicationSkeleton />
                </div>
              ) : rejectedApplications.length > 0 ? (
                <div className="space-y-4">
                  {rejectedApplications.map((application) => (
                    <ApplicationCard key={application.Id} application={application} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">No rejected applications</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </WorkerLayout>
  );
}
