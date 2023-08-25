import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { AdCreateButton } from "@/components/ad-create-button"
import { AdItem } from "@/components/ad-item"
import { DashboardShell } from "@/components/shell"
import { createServerSupabaseClient } from "@/app/supabase-server"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  const { data: ads } = await supabase
    .from("ads")
    .select("id, name, created_at")
    .order("updated_at", { ascending: false })

  return (
    <DashboardShell>
      <DashboardHeader heading="Ads" text="Create and manage ads.">
        <AdCreateButton />
      </DashboardHeader>
      <div>
        {ads?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {ads.map((ad) => (
              <AdItem key={ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No ads created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any ads yet. Start creating content.
            </EmptyPlaceholder.Description>
            <AdCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
