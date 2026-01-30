"use server"

import { createClient } from "@/lib/supabase/server";

export async function getAllProducts() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, name, price, cover_url, availability")

    if (error) {
        throw new Error(error.message)
    }
    return data
}

export async function getProductById(productId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, name, price, cover_url, availability")
        .eq("id", productId)
        .single()

    if (error) {
        throw new Error(error.message)
    }
    return data
}