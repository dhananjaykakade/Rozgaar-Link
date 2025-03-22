"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { verifyOtpApi } from "@/lib/api"; // ✅ Import API
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/authSlice"; // ✅ Import Redux action

export default function VerifyPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const role = searchParams.get("role") as "worker" | "employer" | "";
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { toast } = useToast();

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedOtp = otp.trim();
    if (!trimmedOtp || trimmedOtp.length < 6) {
      toast({ title: "Invalid OTP", description: "Please enter a valid 6-digit OTP", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    try {
      const { token, user } = await verifyOtpApi(phone, trimmedOtp, role!);

      // ✅ Store token & user data in Redux
      dispatch(loginSuccess({ user, token,role }));

      toast({ title: "Login successful", description: "You have been logged in successfully" });

      // 🚀 Redirect to dashboard based on role
      router.push(user.role === "worker" ? "/worker/dashboard" : "/employer/dashboard");
    } catch (error) {
      toast({ title: "Verification failed", description: "Invalid OTP. Please try again.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

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
              <Input id="otp" type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => setCountdown(30)} disabled={countdown > 0}>
            {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
