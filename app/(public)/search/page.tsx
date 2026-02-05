'use client'

import { useState, useTransition } from 'react'
import { PRODUCT_OR_SERVICE } from '@/lib/config'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { searchProducts } from './actions'
import Link from 'next/link'
import { TypeProductCard } from '@/lib/types'

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<TypeProductCard[]>([])
    const [isPending, startTransition] = useTransition()

    function handleSearch(value: string) {
        setQuery(value)

        startTransition(async () => {
            const data = await searchProducts(value)
            setResults(data)
        })
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4 flex flex-col items-center">
            <Input
                type="search"
                placeholder={`Search ${PRODUCT_OR_SERVICE.toLowerCase()}...`}
                className="w-full max-w-lg mb-6"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
            />

            <div className="w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {!isPending && query && results.length === 0 && (
                    <Card className='col-start-1 col-end-4'>
                        <CardContent className="p-6 text-center text-muted-foreground ">
                            No results found.
                        </CardContent>
                    </Card>
                )}

                {results.map((product) => (
                    <Link href={`/products/${product.id}`} key={product.id}>
                        <Card key={product.id}>
                            <CardHeader>
                                <CardTitle>{product.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Add price, description, etc if you want */}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
