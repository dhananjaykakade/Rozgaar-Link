"use client"

import type React from "react"

import { EmployerLayout } from "@/components/employer-layout"
import { useLanguage } from "@/context/language-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Search, Send } from "lucide-react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-mobile"

// Mock chat data
const CHATS = [
  {
    id: "worker1",
    name: "Rahul Kumar",
    avatar: "R",
    lastMessage: "Yes, I can start on April 1st. What are the working hours?",
    timestamp: "10:37 AM",
    unread: 0,
  },
  {
    id: "worker2",
    name: "Suresh Patel",
    avatar: "S",
    lastMessage: "Thank you for accepting my application.",
    timestamp: "Yesterday",
    unread: 1,
  },
  {
    id: "worker3",
    name: "Amit Singh",
    avatar: "A",
    lastMessage: "I understand. Thank you for considering my application.",
    timestamp: "2 days ago",
    unread: 0,
  },
  {
    id: "worker4",
    name: "Priya Sharma",
    avatar: "P",
    lastMessage: "I have experience in gardening and landscaping.",
    timestamp: "1 week ago",
    unread: 0,
  },
]

// Mock messages for a selected chat
const MESSAGES = [
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
]

export default function MessagesPage() {
  const { t } = useLanguage()
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<typeof MESSAGES>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState<typeof CHATS>([])
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setChats(CHATS)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      setMessages(MESSAGES)
    }
  }, [selectedChat])

  // Filter chats based on search term
  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedChat) return

    const message = {
      id: `msg${Date.now()}`,
      sender: "employer" as const,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate worker response after a delay
    setTimeout(() => {
      const response = {
        id: `msg${Date.now()}`,
        sender: "worker" as const,
        text: "Thank you for the information. I'll be there on time.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  return (
    <EmployerLayout>
      <div className="px-4 md:px-8 lg:px-12 py-6">
        <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-150px)]">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{t("messages.title")}</h1>
            <p className="text-muted-foreground">{t("employer.applications")}</p>
          </div>

          <div className="flex flex-1 gap-4 overflow-hidden">
            {/* Chat list - hidden on mobile when a chat is selected */}
            <div
              className={`${isMobile && selectedChat ? "hidden" : "flex flex-col"} w-full md:w-1/3 border rounded-lg overflow-hidden`}
            >
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("messages.search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Tabs defaultValue="all" className="flex-1 flex flex-col">
                <TabsList className="grid grid-cols-3 px-3 pt-2">
                  <TabsTrigger value="recent">{t("messages.recent")}</TabsTrigger>
                  <TabsTrigger value="all">{t("messages.all")}</TabsTrigger>
                  <TabsTrigger value="unread">{t("messages.unread")}</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="flex-1 overflow-y-auto p-0">
                  {loading ? (
                    <div className="p-4 space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                          <div className="space-y-2 flex-1">
                            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-40 bg-muted animate-pulse rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredChats.length > 0 ? (
                    <div className="divide-y">
                      {filteredChats.map((chat) => (
                        <button
                          key={chat.id}
                          className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${selectedChat === chat.id ? "bg-muted" : ""}`}
                          onClick={() => setSelectedChat(chat.id)}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{chat.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <p className="font-medium truncate">{chat.name}</p>
                                <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                            </div>
                            {chat.unread > 0 && <Badge className="ml-2 bg-primary">{chat.unread}</Badge>}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">{t("messages.no_messages")}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="recent" className="flex-1 overflow-y-auto p-0">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">{t("messages.no_messages")}</p>
                  </div>
                </TabsContent>

                <TabsContent value="unread" className="flex-1 overflow-y-auto p-0">
                  {filteredChats.filter((chat) => chat.unread > 0).length > 0 ? (
                    <div className="divide-y">
                      {filteredChats
                        .filter((chat) => chat.unread > 0)
                        .map((chat) => (
                          <button
                            key={chat.id}
                            className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${selectedChat === chat.id ? "bg-muted" : ""}`}
                            onClick={() => setSelectedChat(chat.id)}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{chat.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                  <p className="font-medium truncate">{chat.name}</p>
                                  <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                              </div>
                              <Badge className="ml-2 bg-primary">{chat.unread}</Badge>
                            </div>
                          </button>
                        ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">{t("messages.no_messages")}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Chat messages - hidden on mobile when no chat is selected */}
            <div
              className={`${isMobile && !selectedChat ? "hidden" : "flex flex-col"} w-full md:w-2/3 border rounded-lg overflow-hidden`}
            >
              {selectedChat ? (
                <>
                  {/* Chat header */}
                  <div className="p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isMobile && (
                        <Button variant="ghost" size="sm" onClick={() => setSelectedChat(null)} className="mr-1">
                          &larr;
                        </Button>
                      )}
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{chats.find((c) => c.id === selectedChat)?.avatar || "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{chats.find((c) => c.id === selectedChat)?.name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">Online</p>
                      </div>
                    </div>
                    <div>
                      <Link href={`/employer/chat/${selectedChat}`}>
                        <Button variant="ghost" size="sm">
                          View Full Chat
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Chat messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "worker" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`rounded-lg p-3 max-w-[80%] ${message.sender === "worker" ? "bg-muted" : "bg-primary text-primary-foreground"}`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat input */}
                  <div className="border-t p-3">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        placeholder={t("messages.type_message")}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">{t("messages.send")}</span>
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-4">
                    <p className="text-muted-foreground mb-2">{t("messages.no_conversation")}</p>
                    <Button variant="outline" onClick={() => setSelectedChat("worker1")}>
                      {t("messages.start_conversation")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </EmployerLayout>
  )
}

