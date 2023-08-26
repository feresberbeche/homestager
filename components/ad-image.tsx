"use client"

import * as React from "react"
import Image from "next/image"
import { EmptyPlaceholder } from "@/components/empty-placeholder"

export function AdImage({
    room, ...props
}) {

    return (
        <>
            <Image
                {...props}
                src={room.url}
                alt={room.name}
                loading="lazy"
                height={500}
                width={500}
                className="rounded-md object-cover col-span-2 my-auto "
            />
            <div className="col-span-2"></div>

            <EmptyPlaceholder className="col-span-2">
                <EmptyPlaceholder.Icon name="page" />
                <EmptyPlaceholder.Title>Not modeleted yet</EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                    You don&apos;t have any photos yet. Start uploading.
                </EmptyPlaceholder.Description>
            </EmptyPlaceholder>
        </>
    )
}
