import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  count?: number
}

export function StarRating({ rating, size = "sm", showCount = false, count }: StarRatingProps) {
  const starSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const sizeClass = starSizes[size]

  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
          />
        ))}
      </div>
      {showCount && count !== undefined && <span className="ml-1 text-sm text-muted-foreground">({count})</span>}
    </div>
  )
}

