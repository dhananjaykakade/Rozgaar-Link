"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BriefcaseIcon, HardHatIcon, ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { LanguageSelector } from "@/components/language-selector"

export default function LoginPage() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") as "worker" | "employer" | null
  const [phoneNumber, setPhoneNumber] = useState("")
  const [role, setRole] = useState<"worker" | "employer">(defaultRole || "worker")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedPhoneNumber = phoneNumber.trim()

    if (!trimmedPhoneNumber || trimmedPhoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await login(trimmedPhoneNumber, role)
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the OTP",
      })
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        {t("auth.back_to_home")}
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("auth.login")} - {t("app.name")}
          </CardTitle>
          <CardDescription className="text-center">{t("auth.phone")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">{t("auth.i_am_a")}</Label>
              <RadioGroup
                id="role"
                value={role}
                onValueChange={(value) => setRole(value as "worker" | "employer")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50 flex-1">
                  <RadioGroupItem value="worker" id="worker" />
                  <Label htmlFor="worker" className="flex items-center gap-2 cursor-pointer">
                    <HardHatIcon className="h-4 w-4" />
                    {t("auth.worker")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50 flex-1">
                  <RadioGroupItem value="employer" id="employer" />
                  <Label htmlFor="employer" className="flex items-center gap-2 cursor-pointer">
                    <BriefcaseIcon className="h-4 w-4" />
                    {t("auth.employer")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t("auth.phone")}</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder={t("auth.phone")}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">For demo purposes, any valid phone number will work.</p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending OTP..." : t("auth.send_otp")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

