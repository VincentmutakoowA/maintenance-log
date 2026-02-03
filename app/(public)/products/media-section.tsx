import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ImageZoom } from "@/components/kibo-ui/image-zoom"

type MediaSectionProps = {
  title: string
  loading: boolean
  urls: string[]
  type: "image" | "video"
}

export default function MediaSection({ title, loading, urls, type }: MediaSectionProps) {
  if (!loading && urls.length === 0) return null

  return (
    <div className="space-y-2 my-4">
      {loading ? (
        <Skeleton className="h-4 w-32" />
      ) : (
        <Label>{title}</Label>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))
          : urls.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square w-full overflow-hidden rounded-2xl"
              >
                {type === "image" ? (
                  <ImageZoom className="relative aspect-square" >
                    <Image
                    src={url}
                    alt={`${title} ${index + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  </ImageZoom>
                ) : (
                  <video
                    src={url}
                    controls
                    className="h-full w-full object-cover rounded"
                  />
                )}
              </div>
            ))}
      </div>
    </div>
  )
}
