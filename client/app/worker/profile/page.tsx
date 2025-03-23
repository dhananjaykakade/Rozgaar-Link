"use client";

import type React from "react";
import {useEffect} from "react";
import { selectAuth, updateProfile } from "@/store/slices/authSlice"; 
import { useSelector, useDispatch } from "react-redux";
import { WorkerLayout } from "@/components/worker-layout";
import { useLanguage } from "@/context/language-context";
import axios from "axios";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  PlusCircle,
  X,
  Camera,
  MapPin,
  Phone,
  Calendar,
  Star,
  Briefcase,
  Edit,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

enum Availability {
  IMMEDIATE = "IMMEDIATE",
  WITHIN_ONE_WEEK = "WITHIN_ONE_WEEK",
  WITHIN_TWO_WEEKS = "WITHIN_TWO_WEEKS",
  WITHIN_A_MONTH = "WITHIN_A_MONTH"
}

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
  availability: Availability.IMMEDIATE,
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
};

export default function ProfilePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
 const [reviews, setReviews] = useState<{ Id: string; GivenBy: string; Rating: number; Review: string; CreatedAt: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState<string[]>(WORKER.skills);
  const [newSkill, setNewSkill] = useState("");
   const { user } = useSelector(selectAuth); 
   console.log(user);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.FirstName || "",
    lastName: user?.LastName || "",
    address: user?.Address || "",
    city: user?.City || "",
    pincode: user?.Pin || "",
    phone: user?.Number || "",
    availability: user?.Availability || Availability.IMMEDIATE,
    skills: user?.Skills || [],
    workExperience: user?.WorkExperience || null,
    education: user?.Education || null,
    isVerified: user?.IsVerified || false,
    rating: user?.Rating || 0,
    createdAt: user?.CreatedAt || "",
    jobId: user?.jobId || "",
    documents: {
        id: user?.Documents?.Id || "",
        idProof: user?.Documents?.IdProof || "",
        addressProof: user?.Documents?.AddressProof || "",
        skillsProof: user?.Documents?.SkillsProof || ""
    }
});
  const availabilityOptions = [
    { value: Availability.IMMEDIATE, label: t("availability.immediate") },
    { value: Availability.WITHIN_ONE_WEEK, label: t("availability.within_one_week") },
    { value: Availability.WITHIN_TWO_WEEKS, label: t("availability.within_two_weeks") },
    { value: Availability.WITHIN_A_MONTH, label: t("availability.within_a_month") }
  ];

  const dispatch = useDispatch();
  const [showRatingDetails, setShowRatingDetails] = useState(false);
  const [selectedRating, setSelectedRating] = useState<
    (typeof WORKER.ratings)[0] | null
  >(null);

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };


    const calculateAverageStar = () => {
      if (reviews.length === 0) return 0;
      const totalStars = reviews.reduce((sum, review) => sum + review.Rating, 0);
      return totalStars / reviews.length;
    }
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

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };
 useEffect(() => {
    if (!user?.Id) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/worker/${user.Id}`

        );
        const worker = response.data.data;
        console.log("update profile",worker)
        dispatch(updateProfile(worker)); // Update Redux Store

        
      } catch (error) {
        console.error("Error fetching worker profile:", error);
      }
    };

    fetchProfile();
  }, [user?.Id, dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfileData({
      ...profileData,
      [id]: value,
    });
    console.log("stting profile data" ,profileData)
  };

  const handleSaveProfile = async () => {
    console.log("redux",user.Id);
    console.log("saving profile")
    setSaving(true);
  
    try {
      // Send a PUT request to update the worker profile
      await axios.put(
        `http://localhost:4000/api/worker/${user?.Id}`, // URL for worker API endpoint
        {
          FirstName: profileData?.firstName,
          LastName: profileData?.lastName,
          Address: profileData?.address,
          City: profileData?.city,
          Pin: profileData?.pincode,
          Number: profileData?.phone,
          Availability: profileData?.availability,
          Skills: profileData?.skills,
          WorkExperience: profileData?.workExperience,
          Education: profileData?.education,
          IsVerified: profileData?.isVerified,
          Rating: profileData?.rating,
          CreatedAt: profileData?.createdAt,
          jobId: profileData?.jobId,
        }
      );
  
      // Update Redux store with the latest worker data
      dispatch(updateProfile(user)); // Update Redux Store
  
      // Notify user of success
      toast({
        title: "Profile Updated",
        description: "Your worker profile has been updated successfully",
      });
  
      // Exit edit mode
      setEditMode(false);
    } catch (error) {
      // Notify user of failure
      toast({
        title: "Update Failed",
        description: "Could not update profile.",
        variant: "destructive",
      });
    } finally {
      // Stop saving state
      setSaving(false);
    }
  };




  const handleSelectChange = (value: string) => {
    setProfileData({
      ...profileData,
      availability: value,
    });
  };

  const viewRatingDetails = (rating: (typeof WORKER.ratings)[0]) => {
    setSelectedRating(rating);
    setShowRatingDetails(true);
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 5; // Total number of sections to complete

    if (profileData.firstName && profileData.lastName) completed++;
    if (profileData.address && profileData.city && profileData.pincode)
      completed++;
    if (skills.length > 0) completed++;
    if (profileData.experience) completed++;
    if (WORKER.verificationStatus.idProof === "verified") completed++;

    return (completed / total) * 100;
  };

  const profileCompletionPercentage = calculateProfileCompletion();

 const [RatingCount, setRatingCount] = useState(Number)



  const [files, setFiles] = useState({
    idProof: null as File | null,
    addressProof: null as File | null,
    skillCertificates: null as File | null,
  });



  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/rating/${user?.Id}`); // Replace with actual API
        setReviews(response.data.data); // Assuming response.data.data contains the array
        // count rating from data length
        setRatingCount(response.data.data.length);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
  
    if (user?.Id) {
      fetchReviews();
    }
  }, [user?.Id]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, documentType: "idProof" | "addressProof" | "skillCertificates") => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [documentType]: file,
      }));
    }
  };

  const [uploadedDocuments, setUploadedDocuments] = useState({
    idProofUrl: "",
    addressProofUrl: "",
    skillCertificatesUrl: "",
  });



  const handleUploadDocument = async (documentType: "idProof" | "addressProof" | "skillCertificates") => {
    const file = files[documentType];
    if (!file) {
      toast({
        title: "No file selected",
        description: `Please select a ${documentType} to upload.`,
        variant: "destructive",
      });
      return;
    }
  
    const formData = new FormData();
    // Adjust the name of the file input field to match the backend requirement
    if (documentType === "idProof") {
      formData.append("IdProof", file);
    } else if (documentType === "addressProof") {
      formData.append("AddressProof", file);
    } else if (documentType === "skillCertificates") {
      formData.append("SkillsProof", file);
    }
  
    setSaving(true);
  
    try {
      // First upload the file
      const response = await axios.post(
        `http://localhost:4000/api/worker/${user?.Id}`, // Adjust the URL to your backend
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      toast({
        title: `${documentType} Uploaded`,
        description: `Your ${documentType} has been successfully uploaded.`,
      });

      // After the upload, fetch the updated document info from the backend
      const fetchUploadedDocuments = async () => {
        try {
          const docResponse = await axios.get(`http://localhost:4000/api/worker/${user?.Id}/documents`);
          setUploadedDocuments({
            idProofUrl: docResponse.data.data.Documents.IdProof || "",
            addressProofUrl: docResponse.data.data.Documents.AddressProof || "",
            skillCertificatesUrl: docResponse.data.data.Documents.SkillsProof || "",
          });
        } catch (error) {
          toast({
            title: "Failed to load documents",
            description: "Unable to fetch the uploaded documents.",
            variant: "destructive",
          });
        }
      };
  
      // Call the function to fetch the updated documents
      fetchUploadedDocuments();
      
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: `Failed to upload the ${documentType}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  const fetchUploadedDocuments = async () => {
    try {
      const docResponse = await axios.get(`http://localhost:4000/api/worker/${user?.Id}/documents`);
      setUploadedDocuments({
        idProofUrl: docResponse.data.data.Documents.IdProof || "",
        addressProofUrl: docResponse.data.data.Documents.AddressProof || "",
        skillCertificatesUrl: docResponse.data.data.Documents.SkillsProof || "",
      });
    } catch (error) {
      toast({
        title: "Failed to load documents",
        description: "Unable to fetch the uploaded documents.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUploadedDocuments()
  },[user?.Id])


  return (
    <WorkerLayout>
      <div className="container py-6 px-4 md:px-8 lg:px-12">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
              <p className="text-muted-foreground">
                {t("profile.update_profile")}
              </p>
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
               <Avatar className="h-24 w-24">
                    {!user ? (
  <AvatarFallback className="text-xl">A</AvatarFallback>
) : (
  <AvatarFallback className="text-xl">{user.companyName?.charAt(0) || "U"}</AvatarFallback>
)}
                    </Avatar>
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
                    {profileData.firstName ? (
  <h2 className="text-xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
) : (
  <h2 className="text-xl font-bold">Add Name</h2>
)}
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      {profileData.rating ? (
  <span className="font-medium">{profileData.rating }</span>
) : (
  <span className="font-medium">0</span>
)}
                      
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                    Member since {profileData.createdAt ? format(new Date(profileData.createdAt), "dd MMM yyyy") : "N/A"}

                    </p>

                    <div className="mt-4 w-full space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData?.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Available:{" "}
                          {profileData?.availability === Availability.IMMEDIATE
                            ? "Immediately"
                            : profileData?.availability}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData?.workExperience} WorkExperience</span>
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
                        <span className="font-medium">
                          {Math.round(profileCompletionPercentage)}%
                        </span>
                      </div>
                      <Progress
                        value={profileCompletionPercentage}
                        className="h-2"
                      />
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
                          className={`h-5 w-5 rounded-full p-0 flex items-center justify-center ${
                            WORKER.verificationStatus.idProof === "verified"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : ""
                          }`}
                        >
                          {WORKER.verificationStatus.idProof === "verified"
                            ? "✓"
                            : "!"}
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
                  <TabsTrigger value="personal">
                    {t("profile.personal_info")}
                  </TabsTrigger>
                  <TabsTrigger value="skills">
                    {t("profile.skills")}
                  </TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="ratings">Ratings</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("profile.personal_info")}</CardTitle>
                      <CardDescription>
                        Update your personal details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">
                            {t("profile.first_name")}
                          </Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">
                            {t("profile.last_name")}
                          </Label>
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
                        <Input id="phone" value={profileData.phone} disabled />
                        <p className="text-xs text-muted-foreground">
                          Phone number cannot be changed
                        </p>
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
                          <Input
                            id="city"
                            value={profileData.city}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">
                            {t("profile.pincode")}
                          </Label>
                          <Input
                            id="pincode"
                            value={profileData.pincode}
                            onChange={handleInputChange}
                            disabled={!editMode}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="availability">
                          {t("profile.availability")}
                        </Label>
                        <Select
                          value={profileData.availability}
                          onValueChange={(value: Availability) =>
                            setProfileData({ ...profileData, availability: value })
                          }
                          disabled={!editMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("profile.select_availability")} />
                          </SelectTrigger>
                          <SelectContent>
                            {availabilityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

                <TabsContent value="skills" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("profile.skills")}</CardTitle>
                      <CardDescription>
                        Add your skills to get matched with relevant jobs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t("profile.your_skills")}</Label>
                        <div className="flex flex-wrap gap-2 border rounded-md p-2 min-h-20">
                          {skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {skill}
                              {editMode && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 rounded-full"
                                  onClick={() => handleRemoveSkill(skill)}
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">
                                    Remove {skill}
                                  </span>
                                </Button>
                              )}
                            </Badge>
                          ))}
                          {skills.length === 0 && (
                            <p className="text-sm text-muted-foreground p-2">
                              Add skills to improve job matching
                            </p>
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
                                  e.preventDefault();
                                  handleAddSkill();
                                }
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={handleAddSkill}
                            variant="secondary"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      )}

                      <Separator />


                      <div className="space-y-2">
                        <Label htmlFor="education">
                          {t("profile.education")}
                        </Label>
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
                          {saving
                            ? t("profile.saving")
                            : t("profile.save_changes")}
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                <Card>
      <CardHeader>
        <CardTitle>Documents & Verification</CardTitle>
        <CardDescription>Upload your documents for verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ID Proof */}
        <div className="space-y-2">
          <Label>ID Proof</Label>
          <div className="border rounded-md p-4 text-center">
            <div className="flex flex-col items-center justify-center py-4">
              {uploadedDocuments.idProofUrl ? (
                <>
                  <img
                    src={uploadedDocuments.idProofUrl}
                    alt="ID Proof"
                    className="w-32 h-32 object-cover mb-2"
                  />
                  <p className="text-sm font-medium">ID Proof Uploaded</p>
                </>
              ) : (
                <>
                  <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Upload ID Proof</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aadhaar Card, PAN Card, Voter ID, etc.
                  </p>
                  <input
                    type="file"
                    id="idProof"
                    onChange={(e) => handleFileChange(e, "idProof")}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById("idProof")?.click()}
                  >
                    Upload Document
                  </Button>
                </>
              )}
              <Button
                variant="solid"
                className="mt-4"
                onClick={() => handleUploadDocument("idProof")}
                disabled={saving || !!uploadedDocuments.idProofUrl}
              >
                {saving ? "Uploading..." : "Submit ID Proof"}
              </Button>
            </div>
          </div>
        </div>

        {/* Address Proof */}
        <div className="space-y-2">
          <Label>Address Proof</Label>
          <div className="border rounded-md p-4 text-center">
            <div className="flex flex-col items-center justify-center py-4">
              {uploadedDocuments.addressProofUrl ? (
                <>
                  <img
                    src={uploadedDocuments.addressProofUrl}
                    alt="Address Proof"
                    className="w-32 h-32 object-cover mb-2"
                  />
                  <p className="text-sm font-medium">Address Proof Uploaded</p>
                </>
              ) : (
                <>
                  <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Upload Address Proof</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Utility Bill, Rent Agreement, etc.
                  </p>
                  <input
                    type="file"
                    id="addressProof"
                    onChange={(e) => handleFileChange(e, "addressProof")}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById("addressProof")?.click()}
                  >
                    Upload Document
                  </Button>
                </>
              )}
              <Button
                variant="solid"
                className="mt-4"
                onClick={() => handleUploadDocument("addressProof")}
                disabled={saving || !!uploadedDocuments.addressProofUrl}
              >
                {saving ? "Uploading..." : "Submit Address Proof"}
              </Button>
            </div>
          </div>
        </div>

        {/* Skill Certificates */}
        <div className="space-y-2">
          <Label>Skill Certificates (Optional)</Label>
          <div className="border rounded-md p-4 text-center">
            <div className="flex flex-col items-center justify-center py-4">
              {uploadedDocuments.skillCertificatesUrl ? (
                <>
                  <img
                    src={uploadedDocuments.skillCertificatesUrl}
                    alt="Skill Certificates"
                    className="w-32 h-32 object-cover mb-2"
                  />
                  <p className="text-sm font-medium">Skill Certificates Uploaded</p>
                </>
              ) : (
                <>
                  <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Upload Certificates</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Training certificates, course completion, etc.
                  </p>
                  <input
                    type="file"
                    id="skillCertificates"
                    onChange={(e) => handleFileChange(e, "skillCertificates")}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById("skillCertificates")?.click()}
                  >
                    Upload Document
                  </Button>
                </>
              )}
              <Button
                variant="solid"
                className="mt-4"
                onClick={() => handleUploadDocument("skillCertificates")}
                disabled={saving || !!uploadedDocuments.skillCertificatesUrl}
              >
                {saving ? "Uploading..." : "Submit Skill Certificates"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Your documents will be verified within 24-48 hours after submission.
        </p>
      </CardFooter>
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
                          <div className="text-2xl font-bold">{RatingCount || 0}</div>
                          {reviews.length > 0 ? (
                  <div className="flex">{renderStars(calculateAverageStar())}</div>
                ) : (
                  <div className="flex">{renderStars(0)}</div>
                )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {reviews.length > 0 ? (
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div key={review.Id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{review.GivenBy || "Anonymous"}</h3>
                                  <div className="flex items-center gap-1 mt-1">{renderStars(review.Rating)}</div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.CreatedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm italic">"{review.Review || "No feedback provided"}"</p>
                              </div>
                              <Button variant="link" className="text-xs p-0 h-auto mt-2">
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
            <DialogDescription>
              Detailed feedback from employer
            </DialogDescription>
          </DialogHeader>

          {selectedRating && (
            <div className="space-y-4 mt-2">
              <div>
                <h3 className="font-medium text-lg">
                  {selectedRating.employer}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedRating.date}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xl font-bold">
                  {selectedRating.rating}/5
                </div>
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
  );
}
