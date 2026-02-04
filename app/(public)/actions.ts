"use server"

import { createClient } from "@/lib/supabase/server";

export async function getFeaturedProducts() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, name, price, cover_url, availability, featured")
        .eq("featured", true)

    if (error) {
        throw new Error(error.message)
    }
    return data
    
}

