"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"


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

  async function upload(file: File) {
    const ext = file.name.split(".").pop()
    const path = `temp/${uid}/${crypto.randomUUID()}.${ext}`

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

  async function remove(index: number) {
    await supabase.storage.from(bucket).remove([paths[index]])

    onChange(
      urls.filter((_, i) => i !== index),
      paths.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="space-y-3 mb-2 p-3 rounded-4xl border">
      <Input
        type="file"
        accept={accept}
        multiple
        onChange={e => {
          const files = Array.from(e.target.files || [])
          files.forEach(upload)
          e.target.value = ""
        }}
      />

      <div className="grid grid-cols-3 gap-2 ">
        {urls.map((url, i) => (
          <div key={url} className="relative aspect-square rounded-xl overflow-hidden">
            {accept.startsWith("image") ? (
              <Image
                src={url}
                alt="Product Image"
                className="rounded object-cover"
                fill />
            ) : (
              <video
                src={url}
                controls
                className="rounded object-cover" />
            )}

            <Button
              size="icon"
              variant="destructive"
              type="button"
              className="absolute top-1 right-1 "
              onClick={() => { const ok = confirm("Remove this file?"); if (ok) remove(i) }}
            > 
              <X size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
