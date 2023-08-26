import { cache } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/db"
import { Ad, User } from "@/types/main"

export const createServerSupabaseClient = cache(() =>
  createServerComponentClient<Database>({ cookies })
)

export async function getSupabaseSession() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getAuthUser() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getUser() {
  const supabase = createServerSupabaseClient()
  try {
    const { data } = await supabase.from("users").select("*").single()
    return data
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getAdForUser(adId: Ad["id"], userId: User["id"]) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from("ads")
    .select("*")
    .eq("id", adId)
    .eq("user_id", userId)
    .single()
  return data ? { ...data, content: data.content as unknown as JSON } : null
}

export async function getRoomsForAd(adId: Ad["id"], userId: User["id"]) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .storage
    .from('rooms')
    .list(userId + '/' + adId, {
      limit: 100,
      offset: 0,
    })
  return data ? data : null
}


export async function getRoomUrl(adId: Ad["id"], userId: User["id"]) {
  const supabase = createServerSupabaseClient()
  //TODO
}

