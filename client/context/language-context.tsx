"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "hi" | "mr"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    "app.name": "RozgaarLink",
    "app.tagline": "Connect Workers with Employers",
    "app.description": "RozgaarLink helps daily wage workers find jobs and employers find skilled workers.",

    // Auth
    "auth.login": "Login",
    "auth.verify": "Verify OTP",
    "auth.phone": "Phone Number",
    "auth.otp": "OTP",
    "auth.send_otp": "Send OTP",
    "auth.verify_otp": "Verify OTP",
    "auth.resend_otp": "Resend OTP",
    "auth.back_to_login": "Back to Login",
    "auth.back_to_home": "Back to Home",
    "auth.i_am_a": "I am a",
    "auth.worker": "Worker",
    "auth.employer": "Employer",

    // Worker
    "worker.dashboard": "Dashboard",
    "worker.find_jobs": "Find Jobs",
    "worker.applications": "Applications",
    "worker.profile": "Profile",
    "worker.messages": "Messages",
    "worker.logout": "Logout",
    "worker.browse_jobs": "Browse jobs matching your skills and location",
    "worker.search_jobs": "Search jobs by title or skills",
    "worker.filter_location": "Filter by location",
    "worker.all_jobs": "All Jobs",
    "worker.recommended": "Recommended",
    "worker.nearby": "Nearby",
    "worker.apply_now": "Apply Now",
    "worker.job_details": "Job Details",
    "worker.daily_wage": "Daily wage",
    "worker.duration": "Duration",
    "worker.working_hours": "Working hours",
    "worker.start_date": "Start date",
    "worker.job_description": "Job Description",
    "worker.skills_required": "Skills Required",
    "worker.requirements": "Requirements",
    "worker.job_location": "Job Location",
    "worker.about_employer": "About the Employer",
    "worker.contact_employer": "Contact Employer",
    "worker.similar_jobs": "Similar Jobs",
    "worker.application_sent": "Application Sent!",
    "worker.employer_review": "The employer will review your application soon",
    "worker.view_applications": "View My Applications",
    "worker.track_applications": "Track the status of your job applications",
    "worker.pending": "Pending",
    "worker.accepted": "Accepted",
    "worker.rejected": "Rejected",
    "worker.no_applications": "You haven't applied to any jobs yet",
    "worker.browse_jobs_link": "Browse Jobs",
    "worker.applied_on": "Applied on",
    "worker.view_job": "View Job",
    "worker.chat": "Chat",

    // Employer
    "employer.dashboard": "Dashboard",
    "employer.my_jobs": "My Jobs",
    "employer.applications": "Applications",
    "employer.profile": "Profile",
    "employer.messages": "Messages",
    "employer.logout": "Logout",
    "employer.post_job": "Post New Job",
    "employer.total_jobs": "Total Jobs Posted",
    "employer.total_applicants": "Total Applicants",
    "employer.active_jobs": "Active Jobs",
    "employer.closed_jobs": "Closed Jobs",
    "employer.view_applicants": "View Applicants",
    "employer.edit": "Edit",
    "employer.close": "Close",
    "employer.repost": "Repost",
    "employer.no_active_jobs": "You don't have any active jobs",
    "employer.no_closed_jobs": "You don't have any closed jobs",
    "employer.job_title": "Job Title",
    "employer.job_description": "Job Description",
    "employer.location": "Location",
    "employer.full_address": "Full Address",
    "employer.daily_wage": "Daily Wage (₹)",
    "employer.duration_days": "Duration (Days)",
    "employer.working_hours": "Working Hours",
    "employer.start_date": "Start Date",
    "employer.workers_needed": "Number of Workers Needed",
    "employer.required_skills": "Required Skills",
    "employer.add_skill": "Add a required skill",
    "employer.additional_requirements": "Additional Requirements",
    "employer.cancel": "Cancel",
    "employer.post_job_button": "Post Job",
    "employer.posting_job": "Posting Job...",
    "employer.accept": "Accept",
    "employer.reject": "Reject",
    "employer.message": "Message",
    "employer.no_applications": "No applications received yet",

    // Messages
    "messages.title": "Messages",
    "messages.no_messages": "No messages yet",
    "messages.search": "Search messages",
    "messages.type_message": "Type a message...",
    "messages.send": "Send",
    "messages.recent": "Recent",
    "messages.all": "All",
    "messages.unread": "Unread",
    "messages.no_conversation": "Select a conversation to start messaging",
    "messages.start_conversation": "Start a new conversation",

    // Profile
    "profile.title": "My Profile",
    "profile.update_profile": "Update your profile to get better job matches",
    "profile.personal_info": "Personal Information",
    "profile.skills": "Skills & Experience",
    "profile.documents": "Documents & Verification",
    "profile.first_name": "First Name",
    "profile.last_name": "Last Name",
    "profile.address": "Address",
    "profile.city": "City",
    "profile.pincode": "PIN Code",
    "profile.availability": "Availability",
    "profile.save_changes": "Save Changes",
    "profile.saving": "Saving...",
    "profile.your_skills": "Your Skills",
    "profile.add_skill": "Add a skill",
    "profile.work_experience": "Work Experience",
    "profile.education": "Education & Training",
    "profile.id_proof": "ID Proof",
    "profile.address_proof": "Address Proof",
    "profile.skill_certificates": "Skill Certificates (Optional)",
    "profile.upload_document": "Upload Document",
    "profile.verification_note": "Your documents will be verified within 24-48 hours after submission",

    // Language
    "language.select": "Select Language",
    "language.english": "English",
    "language.hindi": "हिंदी",
    "language.marathi": "मराठी",
  },
  hi: {
    // Common
    "app.name": "रोज़गारलिंक",
    "app.tagline": "श्रमिकों को नियोक्ताओं से जोड़ें",
    "app.description": "रोज़गारलिंक दैनिक वेतन श्रमिकों को नौकरी खोजने और नियोक्ताओं को कुशल श्रमिक खोजने में मदद करता है।",

    // Auth
    "auth.login": "लॉगिन",
    "auth.verify": "OTP सत्यापित करें",
    "auth.phone": "फोन नंबर",
    "auth.otp": "OTP",
    "auth.send_otp": "OTP भेजें",
    "auth.verify_otp": "OTP सत्यापित करें",
    "auth.resend_otp": "OTP पुनः भेजें",
    "auth.back_to_login": "लॉगिन पर वापस जाएं",
    "auth.back_to_home": "होम पर वापस जाएं",
    "auth.i_am_a": "मैं हूँ",
    "auth.worker": "श्रमिक",
    "auth.employer": "नियोक्ता",

    // Worker
    "worker.dashboard": "डैशबोर्ड",
    "worker.find_jobs": "नौकरियां खोजें",
    "worker.applications": "आवेदन",
    "worker.profile": "प्रोफाइल",
    "worker.messages": "संदेश",
    "worker.logout": "लॉगआउट",
    "worker.browse_jobs": "अपने कौशल और स्थान के अनुसार नौकरियां ब्राउज़ करें",
    "worker.search_jobs": "शीर्षक या कौशल से नौकरियां खोजें",
    "worker.filter_location": "स्थान से फ़िल्टर करें",
    "worker.all_jobs": "सभी नौकरियां",
    "worker.recommended": "अनुशंसित",
    "worker.nearby": "आस-पास",
    "worker.apply_now": "अभी आवेदन करें",
    "worker.job_details": "नौकरी विवरण",
    "worker.daily_wage": "दैनिक वेतन",
    "worker.duration": "अवधि",
    "worker.working_hours": "कार्य समय",
    "worker.start_date": "आरंभ तिथि",
    "worker.job_description": "नौकरी विवरण",
    "worker.skills_required": "आवश्यक कौशल",
    "worker.requirements": "आवश्यकताएं",
    "worker.job_location": "नौकरी स्थान",
    "worker.about_employer": "नियोक्ता के बारे में",
    "worker.contact_employer": "नियोक्ता से संपर्क करें",
    "worker.similar_jobs": "समान नौकरियां",
    "worker.application_sent": "आवेदन भेजा गया!",
    "worker.employer_review": "नियोक्ता जल्द ही आपके आवेदन की समीक्षा करेगा",
    "worker.view_applications": "मेरे आवेदन देखें",
    "worker.track_applications": "अपने नौकरी आवेदनों की स्थिति का ट्रैक रखें",
    "worker.pending": "लंबित",
    "worker.accepted": "स्वीकृत",
    "worker.rejected": "अस्वीकृत",
    "worker.no_applications": "आपने अभी तक किसी नौकरी के लिए आवेदन नहीं किया है",
    "worker.browse_jobs_link": "नौकरियां ब्राउज़ करें",
    "worker.applied_on": "आवेदन की तिथि",
    "worker.view_job": "नौकरी देखें",
    "worker.chat": "चैट",

    // Employer
    "employer.dashboard": "डैशबोर्ड",
    "employer.my_jobs": "मेरी नौकरियां",
    "employer.applications": "आवेदन",
    "employer.profile": "प्रोफाइल",
    "employer.messages": "संदेश",
    "employer.logout": "लॉगआउट",
    "employer.post_job": "नई नौकरी पोस्ट करें",
    "employer.total_jobs": "कुल पोस्ट की गई नौकरियां",
    "employer.total_applicants": "कुल आवेदक",
    "employer.active_jobs": "सक्रिय नौकरियां",
    "employer.closed_jobs": "बंद नौकरियां",
    "employer.view_applicants": "आवेदक देखें",
    "employer.edit": "संपादित करें",
    "employer.close": "बंद करें",
    "employer.repost": "पुनः पोस्ट करें",
    "employer.no_active_jobs": "आपके पास कोई सक्रिय नौकरी नहीं है",
    "employer.no_closed_jobs": "आपके पास कोई बंद नौकरी नहीं है",
    "employer.job_title": "नौकरी का शीर्षक",
    "employer.job_description": "नौकरी विवरण",
    "employer.location": "स्थान",
    "employer.full_address": "पूरा पता",
    "employer.daily_wage": "दैनिक वेतन (₹)",
    "employer.duration_days": "अवधि (दिन)",
    "employer.working_hours": "कार्य समय",
    "employer.start_date": "आरंभ तिथि",
    "employer.workers_needed": "आवश्यक श्रमिकों की संख्या",
    "employer.required_skills": "आवश्यक कौशल",
    "employer.add_skill": "आवश्यक कौशल जोड़ें",
    "employer.additional_requirements": "अतिरिक्त आवश्यकताएं",
    "employer.cancel": "रद्द करें",
    "employer.post_job_button": "नौकरी पोस्ट करें",
    "employer.posting_job": "नौकरी पोस्ट कर रहे हैं...",
    "employer.accept": "स्वीकार करें",
    "employer.reject": "अस्वीकार करें",
    "employer.message": "संदेश",
    "employer.no_applications": "अभी तक कोई आवेदन प्राप्त नहीं हुआ है",

    // Messages
    "messages.title": "संदेश",
    "messages.no_messages": "अभी तक कोई संदेश नहीं",
    "messages.search": "संदेश खोजें",
    "messages.type_message": "संदेश लिखें...",
    "messages.send": "भेजें",
    "messages.recent": "हाल के",
    "messages.all": "सभी",
    "messages.unread": "अपठित",
    "messages.no_conversation": "मैसेजिंग शुरू करने के लिए एक वार्तालाप चुनें",
    "messages.start_conversation": "नई वार्तालाप शुरू करें",

    // Profile
    "profile.title": "मेरी प्रोफाइल",
    "profile.update_profile": "बेहतर नौकरी मिलान के लिए अपनी प्रोफाइल अपडेट करें",
    "profile.personal_info": "व्यक्तिगत जानकारी",
    "profile.skills": "कौशल और अनुभव",
    "profile.documents": "दस्तावेज़ और सत्यापन",
    "profile.first_name": "पहला नाम",
    "profile.last_name": "अंतिम नाम",
    "profile.address": "पता",
    "profile.city": "शहर",
    "profile.pincode": "पिन कोड",
    "profile.availability": "उपलब्धता",
    "profile.save_changes": "परिवर्तन सहेजें",
    "profile.saving": "सहेज रहे हैं...",
    "profile.your_skills": "आपके कौशल",
    "profile.add_skill": "कौशल जोड़ें",
    "profile.work_experience": "कार्य अनुभव",
    "profile.education": "शिक्षा और प्रशिक्षण",
    "profile.id_proof": "आईडी प्रमाण",
    "profile.address_proof": "पता प्रमाण",
    "profile.skill_certificates": "कौशल प्रमाणपत्र (वैकल्पिक)",
    "profile.upload_document": "दस्तावेज़ अपलोड करें",
    "profile.verification_note": "आपके दस्तावेज़ जमा करने के 24-48 घंटों के भीतर सत्यापित किए जाएंगे",

    // Language
    "language.select": "भाषा चुनें",
    "language.english": "English",
    "language.hindi": "हिंदी",
    "language.marathi": "मराठी",
  },
  mr: {
    // Common
    "app.name": "रोजगारलिंक",
    "app.tagline": "कामगारांना नियोक्त्यांशी जोडा",
    "app.description": "रोजगारलिंक दैनिक वेतन कामगारांना नोकरी शोधण्यास आणि नियोक्त्यांना कुशल कामगार शोधण्यास मदत करते.",

    // Auth
    "auth.login": "लॉगिन",
    "auth.verify": "OTP सत्यापित करा",
    "auth.phone": "फोन नंबर",
    "auth.otp": "OTP",
    "auth.send_otp": "OTP पाठवा",
    "auth.verify_otp": "OTP सत्यापित करा",
    "auth.resend_otp": "OTP पुन्हा पाठवा",
    "auth.back_to_login": "लॉगिनकडे परत जा",
    "auth.back_to_home": "मुख्यपृष्ठावर परत जा",
    "auth.i_am_a": "मी आहे",
    "auth.worker": "कामगार",
    "auth.employer": "नियोक्ता",

    // Worker
    "worker.dashboard": "डॅशबोर्ड",
    "worker.find_jobs": "नोकऱ्या शोधा",
    "worker.applications": "अर्ज",
    "worker.profile": "प्रोफाइल",
    "worker.messages": "संदेश",
    "worker.logout": "लॉगआउट",
    "worker.browse_jobs": "तुमच्या कौशल्य आणि स्थानानुसार नोकऱ्या ब्राउझ करा",
    "worker.search_jobs": "शीर्षक किंवा कौशल्यांद्वारे नोकऱ्या शोधा",
    "worker.filter_location": "स्थानानुसार फिल्टर करा",
    "worker.all_jobs": "सर्व नोकऱ्या",
    "worker.recommended": "शिफारस केलेले",
    "worker.nearby": "जवळपास",
    "worker.apply_now": "आता अर्ज करा",
    "worker.job_details": "नोकरीचे तपशील",
    "worker.daily_wage": "दैनिक वेतन",
    "worker.duration": "कालावधी",
    "worker.working_hours": "कामाचे तास",
    "worker.start_date": "प्रारंभ तारीख",
    "worker.job_description": "नोकरीचे वर्णन",
    "worker.skills_required": "आवश्यक कौशल्ये",
    "worker.requirements": "आवश्यकता",
    "worker.job_location": "नोकरीचे स्थान",
    "worker.about_employer": "नियोक्त्याबद्दल",
    "worker.contact_employer": "नियोक्त्याशी संपर्क साधा",
    "worker.similar_jobs": "समान नोकऱ्या",
    "worker.application_sent": "अर्ज पाठवला!",
    "worker.employer_review": "नियोक्ता लवकरच तुमचा अर्ज तपासेल",
    "worker.view_applications": "माझे अर्ज पहा",
    "worker.track_applications": "तुमच्या नोकरी अर्जांची स्थिती ट्रॅक करा",
    "worker.pending": "प्रलंबित",
    "worker.accepted": "स्वीकृत",
    "worker.rejected": "नाकारलेले",
    "worker.no_applications": "तुम्ही अद्याप कोणत्याही नोकरीसाठी अर्ज केलेला नाही",
    "worker.browse_jobs_link": "नोकऱ्या ब्राउझ करा",
    "worker.applied_on": "अर्ज केलेली तारीख",
    "worker.view_job": "नोकरी पहा",
    "worker.chat": "चॅट",

    // Employer
    "employer.dashboard": "डॅशबोर्ड",
    "employer.my_jobs": "माझ्या नोकऱ्या",
    "employer.applications": "अर्ज",
    "employer.profile": "प्रोफाइल",
    "employer.messages": "संदेश",
    "employer.logout": "लॉगआउट",
    "employer.post_job": "नवीन नोकरी पोस्ट करा",
    "employer.total_jobs": "एकूण पोस्ट केलेल्या नोकऱ्या",
    "employer.total_applicants": "एकूण अर्जदार",
    "employer.active_jobs": "सक्रिय नोकऱ्या",
    "employer.closed_jobs": "बंद नोकऱ्या",
    "employer.view_applicants": "अर्जदार पहा",
    "employer.edit": "संपादित करा",
    "employer.close": "बंद करा",
    "employer.repost": "पुन्हा पोस्ट करा",
    "employer.no_active_jobs": "तुमच्याकडे कोणतीही सक्रिय नोकरी नाही",
    "employer.no_closed_jobs": "तुमच्याकडे कोणतीही बंद नोकरी नाही",
    "employer.job_title": "नोकरीचे शीर्षक",
    "employer.job_description": "नोकरीचे वर्णन",
    "employer.location": "स्थान",
    "employer.full_address": "पूर्ण पत्ता",
    "employer.daily_wage": "दैनिक वेतन (₹)",
    "employer.duration_days": "कालावधी (दिवस)",
    "employer.working_hours": "कामाचे तास",
    "employer.start_date": "प्रारंभ तारीख",
    "employer.workers_needed": "आवश्यक कामगारांची संख्या",
    "employer.required_skills": "आवश्यक कौशल्ये",
    "employer.add_skill": "आवश्यक कौशल्य जोडा",
    "employer.additional_requirements": "अतिरिक्त आवश्यकता",
    "employer.cancel": "रद्द करा",
    "employer.post_job_button": "नोकरी पोस्ट करा",
    "employer.posting_job": "नोकरी पोस्ट करत आहे...",
    "employer.accept": "स्वीकारा",
    "employer.reject": "नाकारा",
    "employer.message": "संदेश",
    "employer.no_applications": "अद्याप कोणतेही अर्ज प्राप्त झाले नाहीत",

    // Messages
    "messages.title": "संदेश",
    "messages.no_messages": "अद्याप कोणतेही संदेश नाहीत",
    "messages.search": "संदेश शोधा",
    "messages.type_message": "संदेश टाइप करा...",
    "messages.send": "पाठवा",
    "messages.recent": "अलीकडील",
    "messages.all": "सर्व",
    "messages.unread": "न वाचलेले",
    "messages.no_conversation": "संदेश पाठवण्यासाठी एक संभाषण निवडा",
    "messages.start_conversation": "नवीन संभाषण सुरू करा",

    // Profile
    "profile.title": "माझे प्रोफाइल",
    "profile.update_profile": "चांगल्या नोकरी जुळवणीसाठी तुमचे प्रोफाइल अपडेट करा",
    "profile.personal_info": "वैयक्तिक माहिती",
    "profile.skills": "कौशल्ये आणि अनुभव",
    "profile.documents": "कागदपत्रे आणि सत्यापन",
    "profile.first_name": "पहिले नाव",
    "profile.last_name": "आडनाव",
    "profile.address": "पत्ता",
    "profile.city": "शहर",
    "profile.pincode": "पिन कोड",
    "profile.availability": "उपलब्धता",
    "profile.save_changes": "बदल जतन करा",
    "profile.saving": "जतन करत आहे...",
    "profile.your_skills": "तुमची कौशल्ये",
    "profile.add_skill": "कौशल्य जोडा",
    "profile.work_experience": "कामाचा अनुभव",
    "profile.education": "शिक्षण आणि प्रशिक्षण",
    "profile.id_proof": "ओळख पुरावा",
    "profile.address_proof": "पत्ता पुरावा",
    "profile.skill_certificates": "कौशल्य प्रमाणपत्रे (ऐच्छिक)",
    "profile.upload_document": "कागदपत्र अपलोड करा",
    "profile.verification_note": "तुमची कागदपत्रे सबमिट केल्यानंतर 24-48 तासांच्या आत सत्यापित केली जातील",

    // Language
    "language.select": "भाषा निवडा",
    "language.english": "English",
    "language.hindi": "हिंदी",
    "language.marathi": "मराठी",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  // Load language from localStorage on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language
    if (storedLanguage && ["en", "hi", "mr"].includes(storedLanguage)) {
      setLanguageState(storedLanguage)
    }
  }, [])

  // Set language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

