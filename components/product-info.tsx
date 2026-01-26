'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProductInfo({ productId }: { productId?: string }) {
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [coverUrl, setCoverUrl] = useState<string | null>(null)

    const isEdit = Boolean(productId)

    // fetch product if editing
    useEffect(() => {
        if (!productId) return

        const loadProduct = async () => {
            const { data } = await supabase
                .from("products")
                .select("name, price, cover_url")
                .eq("id", productId)
                .single()

            if (data) {
                setName(data.name)
                setPrice(String(data.price))
                setCoverUrl(data.cover_url)
                //console.log("Image url ", coverUrl)
            }
        }

        loadProduct()
    }, [productId, supabase])


    return (
        <Card className="max-w-5xl w-full mx-auto">

            {coverUrl ? (
                <Image

                    src={coverUrl}
                    loading="lazy"
                    alt="Product Cover"
                    className="w-ful"
                    width={256}
                    height={500}
                />
            ) : (
                <div className="avatar no-image" style={{ height: 150, width: 150 }} />
            )}

            <CardHeader>
                <CardAction>
                    <Badge variant="secondary">{price}</Badge>
                </CardAction>
                <CardTitle>{name}</CardTitle>
            </CardHeader>

            <CardFooter>
                <Button className="w-full sm:w-auto" >
                    Message
                </Button>
            </CardFooter>

        </Card>
    )
}
