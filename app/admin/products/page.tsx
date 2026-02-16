'use client'

import { useEffect, useState } from 'react'
import { type User } from '@supabase/supabase-js'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PRODUCT_OR_SERVICE } from '@/lib/config'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import ProductAdminCard from '@/app/admin/products/card'
import { TypeProductCard } from '@/lib/types'
import { getProductsForPage } from './actions'
import { Spinner } from '@/components/ui/spinner'
import { useSearchParams, useRouter } from 'next/navigation'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination"

export default function ProductForm({ user }: { user: User | null }) {

    //const [loading, setLoading] = useState(true)

    const [products, setProducts] = useState<TypeProductCard[]>([])
    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(1)

    const searchParams = useSearchParams()
    const router = useRouter()
    const page = Number(searchParams.get('page')) || 1

    useEffect(() => {
        const getProducts = async () => {
            const data = await getProductsForPage(page)
            console.log('Data', data)
            setProducts(data.products)
            setTotalPages(data.totalPages)
            setLoading(false)
        }

        getProducts()
    }, [user, page])

    function goToPage(newPage: number) {
        if (newPage < 1) return
        router.push(`/admin/products?page=${newPage}`)
    }


    if (loading) {
        return (
            <div className="flex w-full aspect-square items-center justify-center">
                <Spinner className='size-8' />
            </div>
        )
    }


    return (
        <Card className="relative form-widget w-full max-w-7xl ">

            <CardHeader className='flex justify-between'>
                <CardTitle>{PRODUCT_OR_SERVICE}</CardTitle>
                <Link href={'/admin/products/add'}>
                    <Button>
                        Add
                        <Plus />
                    </Button>
                </Link>
            </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
                {products.map(product => (
                    <ProductAdminCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

            <CardFooter>
                <Pagination className='absolute bottom-2 '>
                    {page > 1 && <PaginationPrevious onClick={() => goToPage(page - 1)} />}
                    <PaginationContent>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <PaginationItem key={p}>
                                <PaginationLink onClick={() => goToPage(p)} isActive={p === page}>{p}</PaginationLink>
                            </PaginationItem>
                        ))}
                    </PaginationContent>
                    {page < totalPages && <PaginationNext onClick={() => goToPage(page + 1)} />}
                </Pagination>
            </CardFooter>

        </Card>
    )
}