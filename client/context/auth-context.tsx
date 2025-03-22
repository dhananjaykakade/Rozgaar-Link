"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  role: "worker" | "employer"
  phoneNumber: string
} | null

type AuthContextType = {
  user: User
  loading: boolean
  login: (phoneNumber: string, role: "worker" | "employer") => Promise<void>
  verifyOtp: (otp: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState<string | null>(null)
  const [pendingRole, setPendingRole] = useState<"worker" | "employer" | null>(null)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (phoneNumber: string, role: "worker" | "employer") => {
    setLoading(true)
    try {
      // In a real app, this would call Firebase Auth to send OTP
      // For demo purposes, we'll just store the phone number and role
      setPendingPhoneNumber(phoneNumber)
      setPendingRole(role)

      // Navigate to OTP verification page
      router.push("/auth/verify")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (otp: string) => {
    setLoading(true)
    if (!pendingPhoneNumber || !pendingRole) {
      setLoading(false)
      throw new Error("No pending login session. Please try logging in again.")
    }
    try {
      // In a real app, this would verify the OTP with Firebase Auth
      // For demo purposes, we'll just check if OTP is "123456"
      const trimmedOtp = otp.trim()

      if (trimmedOtp !== "123456") {
        throw new Error("Invalid OTP")
      }

      if (!pendingPhoneNumber || !pendingRole) {
        throw new Error("No pending login")
      }

      // Create user object
      const newUser = {
        id: `user_${Date.now()}`,
        name: pendingRole === "worker" ? "Worker User" : "Employer User",
        role: pendingRole,
        phoneNumber: pendingPhoneNumber,
      }

      // Store user in local storage
      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)

      // Clear pending state
      setPendingPhoneNumber(null)
      setPendingRole(null)

      // Redirect to appropriate dashboard
      router.push(pendingRole === "worker" ? "/worker/dashboard" : "/employer/dashboard")
    } catch (error) {
      console.error("OTP verification error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, loading, login, verifyOtp, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

