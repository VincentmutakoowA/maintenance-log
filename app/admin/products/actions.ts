"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getProductById(productId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("products")
        .select("name, price, cover_url, cover_path, description, availability, images_urls, images_paths, videos_urls, videos_paths, featured")
        .eq("id", productId)
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function getAllProducts() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, name, price, cover_url, availability, featured")

    if (error) {
        throw new Error(error.message)
    }
    return data
}


export async function saveProductAction(formData: FormData) {

    const supabase = await createClient()

    async function moveFromTemp(
        bucket: string,
        paths: string[]
    ) {
        const movedPaths: string[] = []
        const urls: string[] = []

        for (const oldPath of paths) {
            if (!oldPath.startsWith("temp/")) {
                movedPaths.push(oldPath)

                const { data } = supabase
                    .storage
                    .from(bucket)
                    .getPublicUrl(oldPath)

                urls.push(data.publicUrl)
                continue
            }

            const newPath = oldPath.replace("temp/", "")

            const { error } = await supabase
                .storage
                .from(bucket)
                .move(oldPath, newPath)

            if (error) throw new Error(error.message)

            const { data } = supabase
                .storage
                .from(bucket)
                .getPublicUrl(newPath)

            movedPaths.push(newPath)
            urls.push(data.publicUrl)
        }

        return { paths: movedPaths, urls }
    }


    const id = formData.get("id") as string | null
    const name = formData.get("name") as string
    const price = parseFloat(formData.get("price") as string)
    const description = formData.get("description") as string | null
    const featured = formData.get("featured") === "true"
    const images_paths = JSON.parse(formData.get("images_paths") as string)
    const { paths: finalImagePaths, urls: finalImageUrls } = await moveFromTemp("product_images", images_paths)
    const videos_paths = JSON.parse(formData.get("videos_paths") as string)
    const { paths: finalVideoPaths, urls: finalVideoUrls } = await moveFromTemp("product_videos", videos_paths)

    let coverUrl = formData.get("cover_url") as string | null
    let coverPath = formData.get("cover_path") as string | null
    const availability = formData.get("availability") as string as string | null

    if (coverPath) {
        const { paths, urls } = await moveFromTemp(
            "product_cover",
            [coverPath]
        )
        coverPath = paths[0]
        coverUrl = urls[0]
    }

    const payload = {
        name,
        price,
        availability,
        featured,
        description,
        cover_url: coverUrl,
        cover_path: coverPath,
        images_urls: finalImageUrls,
        images_paths: finalImagePaths,
        videos_urls: finalVideoUrls,
        videos_paths: finalVideoPaths,
        updated_at: new Date().toISOString(),
    }

    if (id) {
        //Update
        const { error } = await supabase
            .from("products")
            .update(payload)
            .eq("id", id)

        if (error) { throw new Error(error.message) }
    } else {
        //Insert without id
        const { error } = await supabase
            .from("products")
            .insert(payload)
        if (error) { throw new Error(error.message) }
    }

    redirect("/admin/products")
}

export async function deleteProductAction(
    productId: string,
    coverPath?: string | null,
    imagesPaths?: string[],
    videosPaths?: string[]
) {
    const supabase = await createClient()

    if (coverPath) {
        const { error: storageError } = await supabase
            .storage
            .from("product_cover")
            .remove([coverPath])

        if (storageError) {
            throw new Error(storageError.message)
        }
    }

    if (imagesPaths && imagesPaths.length > 0) {
        const { error: imagesError } = await supabase
            .storage
            .from("products_images")
            .remove(imagesPaths)

        if (imagesError) {
            throw new Error(imagesError.message)
        }
    }

    if (videosPaths && videosPaths.length > 0) {
        const { error: videosError } = await supabase
            .storage
            .from("products_videos")
            .remove(videosPaths)

        if (videosError) {
            throw new Error(videosError.message)
        }
    }

    const { error: dbError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)

    if (dbError) {
        throw new Error(dbError.message)
    }

    redirect("/admin/products")
}


