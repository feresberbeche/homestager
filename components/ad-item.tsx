import Link from "next/link"

import { Ad } from "@/types/main"
import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { AdOperations } from "@/components/ad-operations"
import { add } from "date-fns/esm"

interface AdItemProps {
  ad: Pick<Ad, "id" | "name" | "created_at">
}

export function AdItem({ ad }: AdItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/stager/${ad.id}`}
          className="font-semibold hover:underline"
        >
          {ad.name}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(new Date(ad.created_at).toDateString())}
          </p>
        </div>
      </div>
      <AdOperations ad={{ id: ad.id, name: ad.name }} />
    </div>
  )
}

AdItem.Skeleton = function AdItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
