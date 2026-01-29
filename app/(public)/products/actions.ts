"use server"

import { createClient } from "@/lib/supabase/server";

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