"use client";

import { WorkerLayout } from "@/components/worker-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPinIcon, CalendarIcon, IndianRupeeIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { JobSkeleton } from "@/components/job-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobs, selectAllJobsState } from "@/store/slices/allJobsSlice";
import { AppDispatch } from "@/store/store";
import { useLanguage } from "@/context/language-context";
import { selectAuth } from "@/store/slices/authSlice";
import axios from "axios";

interface Job {
  Id: string;
  Title: string;
  Location: string;
  CreatedAt: string;
  Pay: number;
  WorkingHours: string;
  Skills: string[];
  Employer?: {
    Name: string;
    Rating: number;
  };
}

export default function WorkerDashboard() {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { allJobs, loading } = useSelector(selectAllJobsState);
  const { user } = useSelector(selectAuth);

  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [nearbyJobs, setNearbyJobs] = useState<Job[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(fetchAllJobs());
  }, [dispatch]);

  // Filter jobs based on search term and location
  const filteredJobs = allJobs.filter((job: Job) => {
    const matchesSearch =
      searchTerm === "" ||
      job.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation = location === "" || job.Location.toLowerCase().includes(location.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  const fetchNearbyJobs = async () => {
    if (!user?.City) {
      return;
    }

    setLoadingNearby(true);
    try {
      const response = await axios.post('http://localhost:4000/api/find-nearby-jobs', {
        workerCity: user.City
      });
      console.log('Nearby jobs response:', response.data);
      if (response.data && Array.isArray(response.data.data)) {
        setNearbyJobs(response.data.data);
      } else {
        console.error('Invalid response format for nearby jobs:', response.data);
        setNearbyJobs([]);
      }
    } catch (error) {
      console.error('Error fetching nearby jobs:', error);
      setNearbyJobs([]);
    } finally {
      setLoadingNearby(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'nearby') {
      fetchNearbyJobs();
    }
  }, [activeTab, user?.City]);

  const renderJobs = (jobs: Job[], isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <JobSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (jobs.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("no_jobs_found")}</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchTerm("");
              setLocation("");
            }}
          >
            {t("clear_filters")}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {jobs.map((job: Job) => (
          <Link href={`/worker/job/${job.Id}`} key={job.Id} className="block">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{job.Title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                      {job.Location}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {new Date(job.CreatedAt).toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="flex items-center">
                    <IndianRupeeIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span>₹{job.Pay}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span>{job.WorkingHours}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {job.Skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2 text-sm text-muted-foreground">
                {job.Employer?.Name || t("employer.unknown")} • {job.Employer?.Rating || "N/A"} ★
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <WorkerLayout>
      <div className="container py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{t("worker.find_jobs")}</h1>
            <p className="text-muted-foreground">{t("worker.browse_jobs")}</p>
          </div>

          {/* Search and filter */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder={t("worker.search_jobs")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder={t("worker.filter_location")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full"
              />
            </div>
            <Select defaultValue="recent">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t("sort_by")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">{t("messages.recent")}</SelectItem>
                <SelectItem value="wage-high">{t("worker.daily_wage")} (↑)</SelectItem>
                <SelectItem value="wage-low">{t("worker.daily_wage")} (↓)</SelectItem>
                <SelectItem value="duration">{t("worker.duration")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job tabs */}
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">{t("worker.all_jobs")}</TabsTrigger>
              <TabsTrigger value="recommended">{t("worker.recommended")}</TabsTrigger>
              <TabsTrigger value="nearby">{t("worker.nearby")}</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {renderJobs(filteredJobs, loading)}
            </TabsContent>
            <TabsContent value="recommended" className="mt-4">
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t("profile.update_profile")}</p>
                <Link href="/worker/profile">
                  <Button variant="link">{t("profile.title")}</Button>
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="nearby" className="mt-4">
              {user?.City ? (
                renderJobs(nearbyJobs, loadingNearby)
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t("profile.update_profile")}</p>
                  <Link href="/worker/profile">
                    <Button variant="link">{t("profile.title")}</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </WorkerLayout>
  );
}
