'use server'

import { createClient } from '@/lib/supabase/server'

export async function searchProducts(query: string) {
    if (!query.trim()) return []

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(20)

    if (error) {
        console.error(error)
        return []
    }

    return data
}
