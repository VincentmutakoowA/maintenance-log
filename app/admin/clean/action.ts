"use server"

import { createClient } from "@/lib/supabase/server"

export async function cleanupTempFiles() {
  const supabase = await createClient()

  const { data: files, error } = await supabase.storage
    .from("temp")
    .list("", { limit: 1000 })

  if (error) {
    throw new Error(error.message)
  }

  if (!files || files.length === 0) return

  const paths = files.map((file) => file.name)

  const { error: deleteError } = await supabase.storage
    .from("temp")
    .remove(paths)

  if (deleteError) {
    throw new Error(deleteError.message)
  }
}
