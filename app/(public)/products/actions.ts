"use server"

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

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