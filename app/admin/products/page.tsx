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
import { Plus } from 'lucide-react'
import Link from 'next/link'
import ProductAdminCard from '@/components/product-admin-card'
import { TypeProduct } from '@/lib/types'

// ...

export default function ProductForm({ user }: { user: User | null }) {

    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<TypeProduct[]>([])


    const getProducts = useCallback(async () => {
        try {
            setLoading(true)

            const { data, error, status } = await supabase
                .from('products')
                .select(`id, name, price, cover_url`)
            //.eq('id', user?.id)
            //.single()

            if (error && status !== 406) {
                console.log(error)
                throw error
            }

            if (data) {
                setProducts(data)
            }
        } catch (error) {
            console.log('Error loading Products')
        } finally {
            setLoading(false)
        }
    }, [user, supabase])

    useEffect(() => {
        getProducts()
    }, [user, getProducts])

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