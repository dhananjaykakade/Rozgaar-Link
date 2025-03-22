"use client"

import type React from "react"

import { WorkerLayout } from "@/components/worker-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect, useRef } from "react"
import { Send, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock employer data
const EMPLOYER = {
  id: "emp1",
  name: "ABC Construction",
  avatar: "A",
}

// Mock chat messages
const INITIAL_MESSAGES = [
  {
    id: "msg1",
    sender: "employer",
    text: "Hello, I saw your application for the Construction Helper position.",
    timestamp: "10:30 AM",
  },
  {
    id: "msg2",
    sender: "worker",
    text: "Yes, I'm interested in the job. I have 5 years of experience in construction work.",
    timestamp: "10:32 AM",
  },
  {
    id: "msg3",
    sender: "employer",
    text: "Great! Can you start on April 1st?",
    timestamp: "10:35 AM",
  },
  {
    id: "msg4",
    sender: "worker",
    text: "Yes, I can start on April 1st. What are the working hours?",
    timestamp: "10:37 AM",
  },
  {
    id: "msg5",
    sender: "employer",
    text: "The working hours are from 8 AM to 5 PM with a 1-hour lunch break.",
    timestamp: "10:40 AM",
  },
]

export default function ChatPage({ params }: { params: { employer_id: string } }) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<typeof INITIAL_MESSAGES>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(INITIAL_MESSAGES)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const message = {
      id: `msg${Date.now()}`,
      sender: "worker" as const,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate employer response after a delay
    setTimeout(() => {
      const response = {
        id: `msg${Date.now()}`,
        sender: "employer" as const,
        text: "Thanks for the information. I'll get back to you soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  return (
    <WorkerLayout>
      <div className="flex flex-col h-[calc(100vh-56px)] lg:h-screen">
        {/* Chat header */}
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <Link href="/worker/chat" className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <Avatar className="h-10 w-10">
              <AvatarFallback>{EMPLOYER.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{EMPLOYER.name}</h2>
              <p className="text-xs text-muted-foreground">{loading ? "Loading..." : "Online"}</p>
            </div>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${index % 2 === 0 ? "bg-muted" : "bg-primary text-primary-foreground"}`}
                  >
                    <div className="h-4 w-32 bg-muted-foreground/20 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-16 bg-muted-foreground/20 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "employer" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${message.sender === "employer" ? "bg-muted" : "bg-primary text-primary-foreground"}`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </div>
    </WorkerLayout>
  )
}

