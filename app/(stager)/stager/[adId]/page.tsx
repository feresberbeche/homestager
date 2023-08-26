import { notFound, redirect } from "next/navigation"

import { Modeler } from "@/components/modeler"
import { getAdForUser, getUser, getRoomsForAd } from "@/app/supabase-server"

interface EditorPageProps {
  params: { adId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const ad = await getAdForUser(params.adId, user.id)
  const rooms = await getRoomsForAd(params.adId, user.id)

  if (!ad) {
    notFound()
  }

  return (
    <Modeler
      user={user}
      ad={{
        id: ad.id,
        name: ad.name,
      }}
      rooms={rooms}
    />
  )
}
