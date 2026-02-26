'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { PRODUCT_OR_SERVICE } from '@/lib/config'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { searchProducts } from './actions'
import Link from 'next/link'
import { TypeProductCard } from '@/lib/types'
import { Spinner } from '@/components/ui/spinner'

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<TypeProductCard[]>([])
    const [isPending, startTransition] = useTransition()
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

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
                ref={inputRef}
            />

            <div className="w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {!isPending && query && results.length === 0 && (
                    <Card className='col-start-1 col-end-4 flex items-center justify-center '>
                        <div className='h-18  flex items-center justify-center '>
                            <CardContent className="  text-center text-muted-foreground ">
                                No results found.
                            </CardContent>
                        </div>
                    </Card>
                )}

                {isPending && (
                    <Card className='col-start-1 col-end-4 flex items-center justify-center '>
                        <div className='h-18  flex items-center justify-center '>
                            <CardContent className="  text-center text-muted-foreground ">
                                <Spinner className='size-6' />
                            </CardContent>
                        </div>
                    </Card>
                )}

                {results.map((product) => (
                    <Link href={`/products/${product.id}`} key={product.id}>
                        <Card key={product.id} className='border'>
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
