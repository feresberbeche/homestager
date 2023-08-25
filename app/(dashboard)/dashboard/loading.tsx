import { DashboardHeader } from "@/components/header"
import { AdCreateButton } from "@/components/ad-create-button"
import { AdItem } from "@/components/ad-item"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <AdCreateButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <AdItem.Skeleton />
        <AdItem.Skeleton />
        <AdItem.Skeleton />
        <AdItem.Skeleton />
        <AdItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
