'use client'


import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { PRODUCT_OR_SERVICE } from '@/lib/config'
import Link from 'next/link'
import ProductCard from '@/app/(public)/products/card'
import { TypeProductCard } from '@/lib/types'
import { getAllProducts } from './actions'
import { Skeleton } from '@/components/ui/skeleton'





export default function ProductForm() {

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<TypeProductCard[]>([])

    useEffect(() => {
        let alive = true

        const getProducts = async () => {
            setLoading(true)
            const data = await getAllProducts()
            if (!alive) return
            setProducts(data)
            setLoading(false)
        }

        getProducts()
        return () => { alive = false }
    }, [])


    return (
        <div className="relative form-widget w-full max-w-7xl mt-4">


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">

                {loading && (
                    <>
                        <Card className='w-full h-64 relative'><Skeleton className="absolute inset-0 " /></Card>
                        <Card className='w-full h-64 relative'><Skeleton className="absolute inset-0 " /></Card>
                        <Card className='w-full h-64 relative'><Skeleton className="absolute inset-0 " /></Card>
                        <Card className='w-full h-64 relative'><Skeleton className="absolute inset-0 " /></Card>

                    </>
                )}

                {!loading && products.length === 0 && (
                    <p className="text-center col-span-full">No {PRODUCT_OR_SERVICE.toLowerCase()} found.</p>
                )}

                {!loading && products.length > 0 && (
                    products.map(product => (

                        <Link href={`/products/${product.id}`} key={product.id}>
                            <ProductCard
                                product={product}
                            />
                        </Link>
                    ))
                )}

            </div>

        </div>
    )
}