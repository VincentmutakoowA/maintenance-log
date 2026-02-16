'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardAction, CardDescription } from "@/components/ui/card"
import ProductStatus from "@/components/status"
import { CURRENCY, WHATSAPP_NUMBER } from "@/lib/config"
import { Label } from "@/components/ui/label"
import { MessageCircle } from "lucide-react"
import { getProductById } from "./actions"
import { AvailabilityStatus } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import MediaSection from "./media-section"
import ShareButton from "./share"

export default function ProductInfo({ productId }: { productId?: string }) {
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [name, setName] = useState("")
    const [price, setPrice] = useState<string | null>(null)
    const [coverUrl, setCoverUrl] = useState<string | null>(null)
    const [status, setStatus] = useState<AvailabilityStatus>("available")
    const [description, setDescription] = useState<string | null>(null)
    const [imagesUrls, setImagesUrls] = useState<string[]>([])
    const [videosUrls, setVideosUrls] = useState<string[]>([])

    // fetch product if editing
    useEffect(() => {
        if (!productId) return

        const loadProduct = async () => {

            const data = await getProductById(productId)
            if (data) {
                setName(data.name)
                setPrice(data.price)
                setCoverUrl(data.cover_url)
                setStatus(data.availability)
                setDescription(data.description)
                setImagesUrls(data.images_urls || [])
                setVideosUrls(data.videos_urls || [])
            }
        }

        loadProduct()
            .finally(() => setLoading(false))
    }, [productId, supabase])

    function WhatsAppMessage() {
        const message = `Hello, I am interested in ${name} priced at ${CURRENCY} ${price}, could you provide more details?`
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    //coverUrl
    //const falseii = false


    return (
        <Card className="max-w-5xl w-full mx-auto mt-4 pt-0">

            {coverUrl ? (
                <div className="relative w-full aspect-[20/9] md:aspect-[24/9] lg:aspect-[24/9]">
                    <Image
                        src={coverUrl}
                        loading="lazy"
                        alt="Product Cover"
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw,(max-width: 1024px) 50vw, 33vw"
                    />
                </div>
            ) : (
                <div className="relative w-full aspect-[20/9] md:aspect-[24/9] lg:aspect-[24/9]">
                    <Skeleton className="absolute inset-0 w-full h-full" />
                </div>
            )}

            <CardHeader>
                <CardAction>
                    {loading ? <Skeleton className="h-6 w-24" /> : (
                        <div className="flex items-center gap-2">
                            <ProductStatus status={status} />
                            <ShareButton url={window.location.href} />
                        </div>
                    )}
                </CardAction>
                <CardTitle>
                    <h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        {name || (<Skeleton className="h-8 w-1/3 " />)}
                    </h2>
                </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6">
                <div className="grid gap-2">
                    {loading ? <Skeleton className="h-4 w-48" /> : (description === null ? null : <Label>Description</Label>)}
                    <CardDescription>
                        {loading ? <Skeleton className="h-20 w-full" /> : <p className="text-justify">{description}</p>}
                    </CardDescription>
                </div>
            </CardContent>

            <CardContent className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    {loading ? <Skeleton className="h-6 w-24" /> : `${price === null ? '' : `${CURRENCY} ${price}`}`}
                </h4>
                {loading ? <Skeleton className="h-10 w-full sm:w-auto" /> : <Button className="w-full sm:w-auto" onClick={WhatsAppMessage}>
                    <MessageCircle className="ml-2 h-4 w-4" />
                    Whats App
                </Button>}
            </CardContent>

            <CardContent>
                <MediaSection
                    title="Image gallery"
                    loading={loading}
                    urls={imagesUrls}
                    type="image"
                >
                </MediaSection>

                <MediaSection
                    title="Videos"
                    loading={loading}
                    urls={videosUrls}
                    type="video"
                >
                </MediaSection>
            </CardContent>

        </Card>
    )

}

