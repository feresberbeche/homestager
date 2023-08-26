"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AdImage } from "@/components/ad-image"

import * as z from "zod"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import "@/styles/editor.css"
import { cn } from "@/lib/utils"
import { postPatchSchema } from "@/lib/validations/post"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

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

  async function upload() {

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
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <form onSubmit={handleSubmit(onClick)} className="grid grid-cols-12 grid-rows-1 gap-3" >
          <Input
            autoFocus
            id="title"
            defaultValue={ad.name}
            placeholder="Ad name"
            className="col-span-2 w-full resize-none tracking-tight appearance-none overflow-hidden bg-transparent   focus:outline-none"
            {...register("title")}
          />
          <button type="submit" className={'col-span-1 ' + cn(buttonVariants())}>
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Update</span>
          </button>
        </form >
        <div className="grid grid-cols-12 gap-3">
          <Input className="col-span-3" id="picture" type="file" multiple accept=".jpg,.png" onChange={changeHandler} />
          <Button onClick={upload} className="col-span-1 " type="submit">Upload</Button>
        </div>
      </div >
      <div>
        {rooms?.length ? (
          <div className="grid grid-cols-6 content-center	 gap-4 divide-y divide-border rounded-md border">
            {rooms.map((room) => (
              <AdImage
                room={room}
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


    </>
  )
}
