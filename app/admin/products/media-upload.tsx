"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"
import {
    Dropzone,
    DropzoneContent,
    DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone"
import { Spinner } from "@/components/ui/spinner"

type Props = {
    bucket: string
    uid: string
    urls: string[]
    paths: string[]
    accept: string
    onChange: (urls: string[], paths: string[]) => void
}

export default function ProductMediaUpload({
    bucket,
    uid,
    urls,
    paths,
    accept,
    onChange,
}: Props) {
    const supabase = createClient()
    const [uploading, setUploading] = useState(false)

    async function uploadFiles(files: File[]) {
        if (uploading || files.length === 0) return
        setUploading(true)

        try {
            for (const file of files) {
                const ext = file.name.split(".").pop()
                const path = `temp/${uid}${crypto.randomUUID()}.${ext}`

                const { error } = await supabase.storage
                    .from(bucket)
                    .upload(path, file)

                if (error) throw error

                const { data } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(path)

                onChange(
                    [...urls, data.publicUrl],
                    [...paths, path]
                )
            }
        } finally {
            setUploading(false)
        }
    }

    async function remove(index: number) {
        await supabase.storage.from(bucket).remove([paths[index]])

        onChange(
            urls.filter((_, i) => i !== index),
            paths.filter((_, i) => i !== index)
        )
    }

    return (
        <div className="space-y-4 borde rounded-xl">
            <Dropzone
                disabled={uploading}
                accept={{accept: []}}
                onDrop={(files) => uploadFiles(files)}
            >
                <DropzoneContent>
                    {uploading ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner className="h-4 w-4" />
                        </div>
                    ) : (
                        <DropzoneEmptyState>
                            Drag & drop files here, or click to upload
                        </DropzoneEmptyState>
                    )}
                </DropzoneContent>
            </Dropzone>

            <div className="grid grid-cols-3 gap-2">
                {urls.map((url, i) => (
                    <div
                        key={url}
                        className="relative aspect-square rounded-xl overflow-hidden"
                    >
                        {accept.startsWith("image") ? (
                            <Image
                                src={url}
                                alt="Product media"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <video
                                src={url}
                                controls
                                className="w-full h-full object-cover"
                            />
                        )}

                        <Button
                            size="icon"
                            variant="destructive"
                            type="button"
                            className="absolute top-1 right-1"
                            onClick={() => {
                                if (confirm("Remove this file?")) remove(i)
                            }}
                        >
                            <X size={14} />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
