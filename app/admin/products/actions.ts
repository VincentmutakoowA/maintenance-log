"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getProductById(productId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("products")
        .select("name, price, cover_url, cover_path")
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
        .select("id, name, price, cover_url")

    if (error) {
        throw new Error(error.message)
    }
    return data
}

export async function saveProductAction(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get("id") as string | null
    const name = formData.get("name") as string
    const price = parseFloat(formData.get("price") as string)
    let coverUrl = formData.get("cover_url") as string | null
    let coverPath = formData.get("cover_path") as string | null

    if (coverPath?.startsWith('temp/')) {
        // move cover from temp to permanent location
        const newPath = coverPath.replace('temp/', '')
        const { error: moveError } = await supabase
            .storage
            .from('product_cover')
            .move(coverPath, newPath)

        if (moveError) {
            throw new Error(moveError.message)
        }

        const { data } = supabase
            .storage
            .from('product_cover')
            .getPublicUrl(newPath)

        // update cover url and path
        coverUrl = data.publicUrl
        coverPath = newPath
    }

    const payload = {
        name,
        price,
        cover_url: coverUrl,
        cover_path: coverPath,
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
    coverPath?: string | null
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

    const { error: dbError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)

    if (dbError) {
        throw new Error(dbError.message)
    }

    redirect("/admin/products")
}


