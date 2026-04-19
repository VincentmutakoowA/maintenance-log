'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ErrorClient({message}: {message: string}) {
    const messageFromParams = message

    if (messageFromParams === 'Invalid login credentials.') {
        return (
        <div className="flex flex-col justify-center  min-h-screen">
            <Card size="sm" className="mx-auto w-full max-w-sm ">
                <CardHeader>
                    <CardTitle>Invalid login credentials.</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="outline">
                        <Link href='/login'>Go back to login</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>)
    }

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