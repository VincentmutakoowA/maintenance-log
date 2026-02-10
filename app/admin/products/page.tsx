'use client'

import { useEffect, useState } from 'react'
import { type User } from '@supabase/supabase-js'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PRODUCT_OR_SERVICE } from '@/lib/config'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import ProductAdminCard from '@/app/admin/products/card'
import { TypeProductCard } from '@/lib/types'
import { getAllProducts } from './actions'
import { Spinner } from '@/components/ui/spinner'

// ...

export default function ProductForm({ user }: { user: User | null }) {

    //const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<TypeProductCard[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const getProducts = async () => {
            const data = await getAllProducts()
            console.log('Data', data)
            setProducts(data)
            setLoading(false)
        }

        getProducts()
    }, [user])

    if (loading) {
        return (
            <div className="flex w-full aspect-square items-center justify-center">
                <Spinner className='size-8' />
            </div>
        )
    }


    return (
        <Card className="relative form-widget w-full max-w-4xl">

            <CardHeader className='flex justify-between'>
                <CardTitle>{PRODUCT_OR_SERVICE}</CardTitle>
                <Link href={'/admin/products/add'}>
                    <Button>
                        Add
                        <Plus />
                    </Button>
                </Link>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                {products.map(product => (
                    <ProductAdminCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

        </Card>
    )
}