import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import * as z from "zod"

import { Database } from "@/types/db"
import { adPatchSchema } from "@/lib/validations/ad"

const routeContextSchema = z.object({
  params: z.object({
    adId: z.string(),
  }),
})

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const supabase = createRouteHandlerClient<Database>({
    cookies,
  })
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToAd(params.adId))) {
      return new Response(null, { status: 403 })
    }
    // Delete the post.
    await supabase.from("ads").delete().eq("id", params.adId)

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const supabase = createRouteHandlerClient<Database>({
    cookies,
  })
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToAd(params.adId))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = adPatchSchema.parse(json)

    // Update the post.
    // TODO: Implement sanitization for content.
    await supabase
      .from("ads")
      .update({
        name: body.name,
      })
      .eq("id", params.adId)
      .select()

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToAd(adId: string) {
  const supabase = createRouteHandlerClient({
    cookies,
  })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { count } = await supabase
    .from("ads")
    .select("*", { count: "exact", head: true })
    .eq("id", adId)
    .eq("user_id", session?.user.id)

  return count ? count > 0 : false
}
