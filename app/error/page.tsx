'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"

export default function ErrorPage() {
    const searchParams = useSearchParams()
    const message = searchParams.get("message") || "An error occurred"

    return (
        <div className="flex flex-col justify-center min-h-screen">
            <Card size="sm" className="mx-auto w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sorry</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{message}</p>
                </CardContent>
            </Card>
        </div>)
}