'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ErrorClient({message}: {message: string}) {
    const messageFromParams = message

    return (
        <div className="flex flex-col justify-center min-h-screen">
            <Card size="sm" className="mx-auto w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sorry</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{messageFromParams}</p>
                </CardContent>
            </Card>
        </div>)
}