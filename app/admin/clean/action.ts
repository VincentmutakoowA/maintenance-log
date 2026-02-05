"use server"

import { createClient } from "@/lib/supabase/server"
import {
    PRODUCT_IMAGE_BUCKET,
    PRODUCT_VIDEO_BUCKET,
    PRODUCT_COVER_BUCKET,
} from "@/lib/config"

const BUCKETS = [
    PRODUCT_IMAGE_BUCKET,
    PRODUCT_VIDEO_BUCKET,
    PRODUCT_COVER_BUCKET,
]

export async function cleanupTempFiles() {
    const supabase = await createClient()

    for (const bucket of BUCKETS) {
        const { data: files, error } = await supabase.storage
            .from(bucket)
            .list("temp", { limit: 1000 })

        if (error) {
            throw new Error(
                `Failed to list temp files in ${bucket}: ${error.message}`
            )
        }

        if (!files || files.length === 0) continue

        const paths = files.map((file) => `temp/${file.name}`)

        const { error: deleteError } = await supabase.storage
            .from(bucket)
            .remove(paths)

        if (deleteError) {
            throw new Error(
                `Failed to delete temp files in ${bucket}: ${deleteError.message}`
            )
        }
    }
}
