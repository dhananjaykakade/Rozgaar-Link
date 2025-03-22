import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function ApplicationSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 w-40 bg-muted animate-pulse rounded" />
        <div className="flex gap-1">
          <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
          <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
          <div className="h-5 w-18 bg-muted animate-pulse rounded-full" />
        </div>
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
        </div>
      </CardFooter>
    </Card>
  )
}

