"use server"

import { createClient } from "@/lib/supabase/server"


//------------------------------------------------------------------------------
// LABORATORIES
//------------------------------------------------------------------------------

export async function getAllLaboratoriesAction(): Promise<any[] | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("laboratories")
        .select("*")

    if (error) {
        throw new Error(error.message)
    }
    return data
}
export async function getLaboratoryByIdAction(labId: string): Promise<any | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("laboratories")
        .select("*")
        .eq("id", labId)
        .single()

    if (error) {
        throw new Error(error.message)
    }
    return data
}
export async function addLaboratoryAction(prevState: any, formData: FormData) {
    const id = formData.get("id") as string | null
    const labName = formData.get("name") as string

    const supabase = await createClient()

    const payload = id
        ? { id, lab_name: labName }   // update if exists
        : { lab_name: labName }       // insert if new

    const { error } = await supabase
        .from("laboratories")
        .upsert(payload, { onConflict: "id" })
        .select()
        .single()

    if (error) throw new Error(error.message)

    return { success: true}
}
export async function deleteLaboratoryAction(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from("laboratories")
        .delete()
        .eq("id", id)

    if (error) throw new Error(error.message)
}