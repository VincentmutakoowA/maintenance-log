"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

// Service-role client — bypasses RLS, required for auth.admin operations
function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    if (!url || !serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY env variable")
    return createAdminClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
}

// Guard: only admins can call these actions
async function assertAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    if (profile?.role !== "admin") throw new Error("Forbidden: admin only")
}

// ---------- CREATE USER ----------
export async function createUserAction(prevState: any, formData: FormData) {
    await assertAdmin()
    const email = (formData.get("email") as string).trim().toLowerCase()
    const fullName = (formData.get("full_name") as string).trim()
    const role = (formData.get("role") as string) || "staff"
    const tempPassword = formData.get("temp_password") as string

    if (!email || !tempPassword) return { error: "Email and temporary password are required." }
    if (tempPassword.length < 8)  return { error: "Temporary password must be at least 8 characters." }

    const admin = getAdminClient()

    // Create auth user with temp password, pre-confirm email
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name: fullName },
    })

    if (createError) {
        if (createError.message.includes("already been registered"))
            return { error: "A user with this email already exists." }
        return { error: createError.message }
    }

    // Upsert profile with role and must_change_password flag
    const { error: profileError } = await admin.from("profiles").upsert({
        id: newUser.user!.id,
        full_name: fullName || null,
        role,
        must_change_password: true,
    }, { onConflict: "id" })

    if (profileError) return { error: profileError.message }
    return { success: true }
}

// ---------- DELETE USER ----------
export async function deleteUserAction(userId: string) {
    await assertAdmin()
    const admin = getAdminClient()
    const { error } = await admin.auth.admin.deleteUser(userId)
    if (error) throw new Error(error.message)
}

// ---------- UPDATE ROLE ----------
export async function updateUserRoleAction(userId: string, role: string) {
    await assertAdmin()
    const supabase = await createClient()
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)
    if (error) throw new Error(error.message)
}

// ---------- GET ALL USERS (with email from auth) ----------
export async function getAllUsersAction(): Promise<any[]> {
    await assertAdmin()
    const admin = getAdminClient()
    const supabase = await createClient()

    const [authRes, profileRes] = await Promise.all([
        admin.auth.admin.listUsers({ perPage: 200 }),
        supabase.from("profiles").select("*").order("full_name", { ascending: true }),
    ])

    if (authRes.error) throw new Error(authRes.error.message)
    const authUsers = authRes.data.users
    const profiles = profileRes.data ?? []

    // Merge auth email into profile records
    return profiles.map(p => {
        const authUser = authUsers.find(u => u.id === p.id)
        return { ...p, email: authUser?.email ?? null, last_sign_in: authUser?.last_sign_in_at ?? null }
    })
}

// ---------- RESET TEMP PASSWORD ----------
export async function resetTempPasswordAction(userId: string, newTempPassword: string) {
    await assertAdmin()
    if (newTempPassword.length < 8) throw new Error("Password must be at least 8 characters.")
    const admin = getAdminClient()
    const { error } = await admin.auth.admin.updateUserById(userId, {
        password: newTempPassword,
    })
    if (error) throw new Error(error.message)
    // Re-flag must_change_password
    await admin.from("profiles").update({ must_change_password: true }).eq("id", userId)
}
