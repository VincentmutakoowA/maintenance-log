'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { COMPANY_SLOGAN, HERO_INTRO } from "@/lib/config";
import Link from "next/link";
import { getCurrentUser } from "./actions";
import { Spinner } from "@/components/ui/spinner";
import { User } from "@supabase/supabase-js";

export default function Page() {

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        let alive = true
        getCurrentUser().then((user) => {
            if (!alive) return
            setLoading(false)
            setUser(user)
        })
        return () => { alive = false }
    }, [])

    return (
        <div className="w-full">

            <div className="relative isolate px-6 pt-14 lg:px-8 min-h-screen">

                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">

                    </div>
                    <div className="text-center">
                        <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
                            {HERO_INTRO} </h1>
                        <p className="mt-8 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
                            {COMPANY_SLOGAN} </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            
                            {loading ? <Spinner /> : <Link
                                href={`${user ? '/admin' : '/login'}` }
                            >
                                <Button>{user ? 'Go to Admin' : 'Log in'}</Button>
                            </Link>}

                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}