'use client'

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { TypeProductCard } from "@/lib/types"
import { getFeaturedProducts } from "./actions"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ProductStatus from "@/components/status"
import Autoplay from "embla-carousel-autoplay"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { PRODUCT_OR_SERVICE } from "@/lib/config"

export function CarouselFeatured() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<TypeProductCard[]>([])
  const router = useRouter()

  useEffect(() => {
    let alive = true

    const getProducts = async () => {
      const data = await getFeaturedProducts()
      if (!alive) return
      setProducts(data)
      setLoading(false)
    }

    getProducts()
    return () => {
      alive = false
    }
  }, [])

  if (!loading && products.length === 0) {
    return null
  }

  return (
    <div>
      {loading ? (
        <div className="w-60 h-12">
          <Skeleton className="w-full h-8 rounded-full" />
        </div>
      ) : (
        <h2 className="h-12 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
          Featured
        </h2>
      )}

      <Carousel
        className="w-full mb-16"
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
      >
        <CarouselContent>
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3">
                <Card
                  className="overflow-hidden p-0">
                  <Skeleton className="w-full h-full rounded-t-md aspect-video" />

                  <CardHeader>
                    <CardAction>
                      <Skeleton className="w-20 h-5 rounded-full" />
                    </CardAction>
                    <CardTitle><Skeleton className="w-32 h-5 rounded-full" /></CardTitle>
                    <CardDescription><Skeleton className="w-24 h-4 rounded-full" /></CardDescription>
                  </CardHeader>

                  <CardContent />
                </Card>
              </CarouselItem>
            ))
          ) : (
            products.map(product => (
              <CarouselItem
                key={product.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <Card
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="cursor-pointer overflow-hidden group p-0 border border-primary"
                >
                  <div className="relative aspect-video w-full">
                    <Image
                      src={product.cover_url || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  <CardHeader>
                    <CardAction>
                      <ProductStatus status={product.availability} />
                    </CardAction>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.price}</CardDescription>
                  </CardHeader>

                  <CardContent />
                </Card>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
      </Carousel>

      <Link href="/products">
        <Button variant="outline">
          View all {PRODUCT_OR_SERVICE}
        </Button>
      </Link>
    </div>
  )
}
