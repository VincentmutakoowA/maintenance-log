'use client'


import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { PRODUCT_OR_SERVICE } from '@/lib/config'
import Link from 'next/link'
import ProductCard from '@/app/(public)/products/card'
import { TypeProductCard } from '@/lib/types'
import { getProductsForPage } from './actions'
import { Skeleton } from '@/components/ui/skeleton'
import {  useRouter } from 'next/navigation'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination"


export default function ProductClient({param}: {param: number}) {

    const page = param || 1

    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<TypeProductCard[]>([])
    const [totalPages, setTotalPages] = useState(1)

    function goToPage(newPage: number) {
        if (newPage < 1) return
        router.push(`?page=${newPage}`)
    }

    useEffect(() => {
        let alive = true

        const getProducts = async () => {
            setLoading(true)
            const data = await getProductsForPage(page)
            if (!alive) return
            setProducts(data.products)
            setTotalPages(data.totalPages)
            setLoading(false)
        }

        getProducts()
        return () => { alive = false }
    }, [page])


    return (
        <div className="relative form-widget w-full max-w-7xl mt-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">

                {loading && (
                    <> {Array.from({ length: 4 }, (_, i) => i).map(i => (
                        <Card key={i} className="w-full h-64 relative ">  <Skeleton className="absolute inset-0 " /> </Card>
                    ))} </>
                )}

                {!loading && products.length > 0 && (
                    products.map(product => (

                        <Link href={`/products/${product.id}`} key={product.id}>
                            <ProductCard product={product} />
                        </Link>
                    ))
                )}

            </div>

            {!loading && products.length === 0 && (
                <p className="text-center col-span-full">No {PRODUCT_OR_SERVICE.toLowerCase()} found.</p>
            )}

            <Pagination className='absolute bottom-0'>
                {page > 1 && <PaginationPrevious onClick={() => goToPage(page - 1)} />  }
                <PaginationContent>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <PaginationItem key={p}>
                            <PaginationLink onClick={() => goToPage(p)} isActive={p === page}>{p}</PaginationLink>
                        </PaginationItem>
                    ))}
                </PaginationContent>
                {page < totalPages && <PaginationNext onClick={() => goToPage(page + 1)} />}
            </Pagination>

        </div>
    )
}