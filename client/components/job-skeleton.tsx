import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function JobSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <Skeleton className="h-5 w-[80px]" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-[60px] rounded-full" />
          <Skeleton className="h-5 w-[80px] rounded-full" />
          <Skeleton className="h-5 w-[70px] rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Skeleton className="h-4 w-[120px]" />
      </CardFooter>
    </Card>
  )
}

