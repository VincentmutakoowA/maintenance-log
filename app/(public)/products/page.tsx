'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle, CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PRODUCT_OR_SERVICE } from '@/lib/config'
import Link from 'next/link'
import ProductCard from '@/app/(public)/products/product-card'
import { TypeProduct } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { getAllProducts } from './actions'
import { Skeleton } from '@/components/ui/skeleton'

// ...

export default function ProductForm({ user }: { user: User | null }) {

    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<TypeProduct[]>([])


    const getProducts = useCallback(async () => {

        const data = await getAllProducts()
        setProducts(data)
        setLoading(false)

    }, [user, supabase])

    useEffect(() => {
        getProducts()
    }, [user, getProducts])

    return (
        <div className="relative form-widget w-full max-w-7xl">

            <CardHeader className='flex justify-between items-center p-4'>
                <CardTitle>{PRODUCT_OR_SERVICE}</CardTitle>
                <Input
                    type="search"
                    placeholder={`Search ${PRODUCT_OR_SERVICE.toLowerCase()}...`}
                    className="max-w-sm "
                />
            </CardHeader>

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