"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Star } from "lucide-react"

interface RatingDialogProps {
  type: "worker" | "employer"
  targetId: string
  targetName: string
  jobTitle: string
  onRatingSubmit?: (rating: number, feedback: string) => void
  trigger?: React.ReactNode
}

export function RatingDialog({ type, targetId, targetName, jobTitle, onRatingSubmit, trigger }: RatingDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call to POST /ratings/worker/:id or /ratings/employer/:id
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (onRatingSubmit) {
        onRatingSubmit(rating, feedback)
      }

      toast({
        title: "Rating submitted",
        description: `Your rating for ${targetName} has been submitted successfully`,
      })

      setIsOpen(false)
      setRating(0)
      setFeedback("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Rate {type === "worker" ? "Worker" : "Employer"}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate {targetName}</DialogTitle>
          <DialogDescription>
            {type === "worker"
              ? "Rate the worker's performance for this job"
              : "Rate your experience with this employer"}
            : {jobTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium">Your Rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="feedback" className="text-sm font-medium">
              Feedback
            </label>
            <Textarea
              id="feedback"
              placeholder="Share your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

