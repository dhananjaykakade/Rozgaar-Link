"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function VerifyPage() {
  const { verifyOtp, user } = useAuth()
  const [otp, setOtp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const router = useRouter()
  const { toast } = useToast()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(user.role === "worker" ? "/worker/dashboard" : "/employer/dashboard")
    }
  }, [user, router])

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedOtp = otp.trim()

    if (!trimmedOtp || trimmedOtp.length < 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await verifyOtp(trimmedOtp)
      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      })
    } catch (error) {
      console.error("Verification error:", error)
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Invalid OTP. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = () => {
    toast({
      title: "OTP Resent",
      description: "A new OTP has been sent to your phone number",
    })
    setCountdown(30)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify OTP</CardTitle>
          <CardDescription className="text-center">Enter the 6-digit OTP sent to your phone</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            <div className="text-center mt-2 p-2 bg-muted rounded-md">
              <p className="text-sm font-medium">
                For demo purposes, use OTP: <span className="font-bold">123456</span>
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
          <div className="text-center mt-4">
            <Link href="/auth/login">
              <Button variant="link" size="sm">
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={handleResendOtp} disabled={countdown > 0}>
            {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

