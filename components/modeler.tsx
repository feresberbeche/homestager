"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Post } from "@/types/main"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as z from "zod"

import "@/styles/editor.css"
import { cn } from "@/lib/utils"
import { postPatchSchema } from "@/lib/validations/post"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"


type FormData = z.infer<typeof postPatchSchema>

export function Modeler({ user, post }) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
  })
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [isFilePicked, setIsFilePicked] = React.useState(false);

  const supabase = createClientComponentClient()

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  const changeHandler = (event) => {
    setSelectedFiles(event.target.files);
    setIsFilePicked(true)
  };

  async function onSubmit(fdata: FormData) {
    setIsSaving(true)

    const picture = selectedFiles[0]
    const { data, error } = await supabase
      .storage
      .from('rooms')
      .upload(user.id + '/avatar1.png', picture, {
        cacheControl: '3600',
        upsert: false
      })

    setIsSaving(false)

    if (error) {
      return toast({
        title: "Something went wrong.",
        description: "There was a problem uploading your photos.",
        variant: "destructive",
      })
    }

    router.refresh()

    return toast({
      description: "Your photos are uploaded successfully.",
    })
  }

  if (!isMounted) {
    return null
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <>
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Link>
            <p className="text-sm text-muted-foreground">
              {post.published ? "Published" : "Draft"}
            </p>
          </div>
          <button type="submit" className={cn(buttonVariants())}>
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </div>
        <div className="prose prose-stone mx-auto dark:prose-invert">
          <div className="grid w-full lg:max-w-sm items-center gap-1.5">
            <Input id="picture" type="file" multiple accept=".jpg,.png" onChange={changeHandler} />
            <Button type="submit">Upload</Button>
          </div>


        </div>
      </div>
    </form>
  )
}
