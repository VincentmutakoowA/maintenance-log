"use server"

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getProductsForPage(page: number) {
    const pageSize = 25
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    const supabase = await createClient()
    const { data, count, error } = await supabase
        .from("products")
        .select("id, name, price, cover_url, availability, featured", { count: "exact" })
        .range(from, to)

    if (error) {
        throw new Error(error.message)
    }
    const totalPages = Math.ceil((count ?? 0) / pageSize)
    return { products: data, totalPages: totalPages }
}


export async function getProductById(productId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, name, price, cover_url, availability, description, images_urls, images_paths, videos_urls, videos_paths")
        .eq("id", productId)
        .single()

    if (error?.code === "PGRST116") {
        redirect('/error/notfound')
    }

    if (error) {
        throw new Error(error.message)
    }
    return data
}