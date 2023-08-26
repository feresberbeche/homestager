"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Ad } from "@/types/main"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as z from "zod"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import "@/styles/editor.css"
import { cn } from "@/lib/utils"
import { postPatchSchema } from "@/lib/validations/post"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import TextareaAutosize from "react-textarea-autosize"
import Image from "next/image"

type FormData = z.infer<typeof postPatchSchema>

export function Modeler({ user, ad, rooms }) {
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

  async function onClick(fdata: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/ads/${ad.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fdata.title,
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your ad was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    return toast({
      description: "Your ad has been saved.",
    })

  }

  async function onSubmit(fdata: FormData) {

    const picture = selectedFiles[0]
    const imagename = (Math.random() + 1).toString(36).substring(7);

    const { data, error } = await supabase
      .storage
      .from('rooms')
      .upload(user.id + '/' + ad.id + '/' + imagename, picture, {
        cacheControl: '3600',
        upsert: false
      })

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
    <>
      <form onSubmit={handleSubmit(onClick)}>
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
          </div>
          <button type="submit" className={cn(buttonVariants())}>
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </div>
      </form>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid w-full gap-10">
          <div className="prose prose-stone mx-auto w-[800px] dark:prose-invert">
            <TextareaAutosize
              autoFocus
              id="title"
              defaultValue={ad.name}
              placeholder="Post title"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
              {...register("title")}
            />
          </div>
          <div className="prose prose-stone mx-auto dark:prose-invert">
            <div className="grid w-full lg:max-w-sm items-center gap-1.5">
              <Input id="picture" type="file" multiple accept=".jpg,.png" onChange={changeHandler} />
              <Button type="submit">Upload</Button>
            </div>
          </div>
          <Image


            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            alt="Photo by Drew Beamer"
            loading="lazy"
            height={500}
            width={500}
            className="rounded-md object-cover"
          />
          <div>
            {rooms?.length ? (
              <div className="divide-y divide-border rounded-md border">
                {rooms.map((room) => (
                  <Image
                    src={room}
                    alt="Photo by Drew Beamer"
                    loading="lazy"
                    height={500}
                    width={500}
                    className="rounded-md object-cover"
                  />
                ))}
              </div>
            ) : (
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon name="post" />
                <EmptyPlaceholder.Title>No photos uploaded</EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  You don&apos;t have any photos yet. Start uploading.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
            )}
          </div>

        </div>
      </form>
    </>
  )
}
