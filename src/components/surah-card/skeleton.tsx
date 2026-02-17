import { Skeleton } from '@/components/ui/skeleton'

const SkeletonSurahCard = () => (
  <div className="flex items-center gap-4 rounded-lg border p-4">
    <Skeleton className="h-10 w-10 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />
    </div>
    <Skeleton className="h-5 w-16" />
  </div>
)

export default SkeletonSurahCard
