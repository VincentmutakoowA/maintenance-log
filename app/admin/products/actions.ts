"use server"

import { PRODUCT_COVER_BUCKET, PRODUCT_IMAGE_BUCKET, PRODUCT_VIDEO_BUCKET } from "@/lib/config"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { moveFromTemp } from "./functions"

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

    async function deletePaths(bucket: string, paths: string[]) {
        if (!paths.length) return
        await supabase.storage.from(bucket).remove(paths)
    }

    const id = formData.get("id") as string | null
    const name = formData.get("name") as string
    const price = parseFloat(formData.get("price") as string)
    const description = formData.get("description") as string | null
    const featured = formData.get("featured") === "true"
    const availability = formData.get("availability") as string | null

    const imagesInput = JSON.parse(formData.get("images_paths") as string || "[]")
    const videosInput = JSON.parse(formData.get("videos_paths") as string || "[]")

    let coverPath = formData.get("cover_path") as string | null
    let coverUrl = formData.get("cover_url") as string | null

    const movedFiles: { bucket: string; path: string }[] = []

    let productId = id
    let oldImages: string[] = []
    let oldVideos: string[] = []
    let oldCover: string | null = null

    try {
        // Fetch existing product (update case)
        if (productId) {
            const { data } = await supabase
                .from("products")
                .select("images_paths, videos_paths, cover_path")
                .eq("id", productId)
                .single()

            oldImages = data?.images_paths ?? []
            oldVideos = data?.videos_paths ?? []
            oldCover = data?.cover_path ?? null
        }

        // Create product if needed
        if (!productId) {
            const { data, error } = await supabase
                .from("products")
                .insert({
                    name,
                    price,
                    availability,
                    featured,
                    description,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .select("id")
                .single()

            if (error) throw error
            productId = data.id
        }

        // Move media
        const { paths: imagePaths, urls: imageUrls } =
            await moveFromTemp("product_images", imagesInput, productId, movedFiles)

        const { paths: videoPaths, urls: videoUrls } =
            await moveFromTemp("product_videos", videosInput, productId, movedFiles)

        if (coverPath) {
            const { paths, urls } = await moveFromTemp(
                PRODUCT_COVER_BUCKET,
                [coverPath],
                productId,
                movedFiles
            )
            coverPath = paths[0]
            coverUrl = urls[0]
        }

        // Diff and delete removed files
        const removedImages = oldImages.filter(p => !imagePaths.includes(p))
        const removedVideos = oldVideos.filter(p => !videoPaths.includes(p))
        const removedCover = oldCover && oldCover !== coverPath ? [oldCover] : []

        await deletePaths("product_images", removedImages)
        await deletePaths("product_videos", removedVideos)
        await deletePaths(PRODUCT_COVER_BUCKET, removedCover)

        // Final DB update
        const { error } = await supabase
            .from("products")
            .update({
                name,
                price,
                availability,
                featured,
                description,
                cover_url: coverUrl,
                cover_path: coverPath,
                images_urls: imageUrls,
                images_paths: imagePaths,
                videos_urls: videoUrls,
                videos_paths: videoPaths,
                updated_at: new Date().toISOString(),
            })
            .eq("id", productId)

        if (error) throw error
    } catch (err) {
        // ROLLBACK newly moved files
        for (const file of movedFiles) {
            await supabase.storage.from(file.bucket).remove([file.path])
        }
        throw err
    }

    redirect("/admin/products")
}


export async function deleteProductAction(
    productId: string,
) {
    const supabase = await createClient()

    const { data, error: fetchError } = await supabase
        .from("products")
        .select("cover_path, images_paths, videos_paths")
        .eq("id", productId)
        .single()

    if (fetchError) throw new Error(fetchError.message)
    const coverPath = data?.cover_path
    const imagesPaths: string[] = data.images_paths ?? []
    const videosPaths: string[] = data.videos_paths ?? []


    if (coverPath) {
        await supabase.storage
            .from(PRODUCT_COVER_BUCKET)
            .remove([coverPath])
    }

    if (imagesPaths && imagesPaths.length > 0) {
        await supabase.storage
            .from(PRODUCT_IMAGE_BUCKET)
            .remove(imagesPaths)
    }

    if (videosPaths && videosPaths.length > 0) {
         await supabase.storage
            .from(PRODUCT_VIDEO_BUCKET)
            .remove(videosPaths)
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


