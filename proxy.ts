import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const { pathname } = request.nextUrl

    // Not logged in — redirect to login (except public routes)
    const publicPaths = ["/login", "/auth/", "/", "/privacy", "/terms"]
    const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith(p))

    if (!user && !isPublic) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Logged in — check must_change_password for protected routes
    if (user && pathname.startsWith("/admin") && pathname !== "/change-password") {
        const { data: profile } = await supabase
            .from("profiles")
            .select("must_change_password")
            .eq("id", user.id)
            .single()

        if (profile?.must_change_password) {
            return NextResponse.redirect(new URL("/change-password", request.url))
        }
    }

    // Already logged in and hitting /login — go to dashboard
    if (user && pathname === "/login") {
        return NextResponse.redirect(new URL("/admin/home", request.url))
    }

    return supabaseResponse
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
