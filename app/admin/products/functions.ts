'use server'

import { createClient } from "@/lib/supabase/server"

export async function moveFromTemp(
    bucket: string,
    paths: string[],
    productId: string | null,
    movedTracker: { bucket: string; path: string }[]
){
    const supabase = await createClient()

    if (productId === null) {
      throw new Error("Product ID is required for moving files")
    }

    const finalPaths: string[] = []
    const urls: string[] = []

    for (const oldPath of paths) {
      if (!oldPath.startsWith("temp/")) {
        finalPaths.push(oldPath)
        const { data } = supabase.storage.from(bucket).getPublicUrl(oldPath)
        urls.push(data.publicUrl)
        continue
      }

      const fileName = oldPath.replace("temp/", "")
      const newPath = `${productId}/${fileName}`

      const { error } = await supabase.storage.from(bucket).move(oldPath, newPath)
      if (error) throw error

      movedTracker.push({ bucket, path: newPath })

      const { data } = supabase.storage.from(bucket).getPublicUrl(newPath)
      finalPaths.push(newPath)
      urls.push(data.publicUrl)
    }

    return { paths: finalPaths, urls }
}