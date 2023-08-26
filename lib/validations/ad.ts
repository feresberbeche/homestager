import * as z from "zod"

export const adPatchSchema = z.object({
  name: z.string().min(3).max(128).optional(),
})
