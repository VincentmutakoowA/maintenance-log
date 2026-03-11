'use client'

import { useState } from 'react'
import {
    Menu,
    X,
    ChevronDown,
    Search,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { PHONE_NUMBER, PRODUCT_OR_SERVICE, SITE_TITLE } from '@/lib/config'
import Link from 'next/link'
import Image from 'next/image'

export default function HeaderPublic() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileProductOpen, setMobileProductOpen] = useState(false)

    return (
        <header className="w-full z-50">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:p-3 lg:px-8">

                <div className="flex lg:flex-1">
                    <Link href="/" className="flex items-center gap-4 lg:ml-6">
                        <span className="sr-only">{SITE_TITLE}</span>
                        <div className="relative aspect-square w-10 rounded-md overflow-hidden">
                            <Image
                                fill
                                alt="Logo"
                                src="/logo.png"
                                sizes="(max-width: 768px) 100vw,(max-width: 1024px) 50vw, 33vw"
                            />
                        </div>
                        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                            {SITE_TITLE}
                        </h2>
                    </Link>
                </div>

                <div className="flex lg:hidden gap-5 ">
                    <Link href='/search' aria-label='search'>
                        <Search></Search>
                    </Link>
                    <button
                        aria-label='Menu'
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
                    >
                        <Menu className="size-6" />
                    </button>
                </div>

                <div className="hidden lg:flex lg:gap-x-8 items-center">
                    <Link href='/products'><Button variant="ghost">{PRODUCT_OR_SERVICE}</Button></Link>
                    <Link href='/faults'><Button variant="ghost">Faults</Button></Link>
                    <Link href='/login'><Button variant="outline">Log in</Button></Link>
                </div>



                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Link href='/search'> <Search className='w-5'></Search></Link>
                </div>

            </nav>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 p-4 bg-background lg:hidden">

                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-4">
                            <span className="sr-only">{SITE_TITLE}</span>
                            <div className="relative aspect-square w-10 rounded-md overflow-hidden">
                                <Image
                                    fill
                                    alt="Logo"
                                    src="/logo.png"
                                    sizes="(max-width: 768px) 100vw,(max-width: 1024px) 50vw, 33vw"
                                />
                            </div>
                            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                                {SITE_TITLE}
                            </h2>
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <X className="size-6" />
                        </button>
                    </div>

                    <div className="mt-6 space-y-2">
                        <Link className="block rounded-lg px-3 py-2 font-semibold" href='/products' onClick={() => { setMobileMenuOpen(false) }}>{PRODUCT_OR_SERVICE}</Link>
                        <Link className="block rounded-lg px-3 py-2 font-semibold" href='/faults' onClick={() => { setMobileMenuOpen(false) }}>Faults</Link>
                        <a className="block rounded-lg px-3 py-2 font-semibold" href='/login'>Log in</a>
                    </div>
                </div>
            )}
        </header>
    )
}
