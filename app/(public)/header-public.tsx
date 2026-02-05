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

const products = [
    {
        name: 'Contact us',
        description: 'Contact us for more information',
        href: '/contact',
    },
    {
        name: 'Call us',
        description: 'Get help and support',
        href: `tel:${PHONE_NUMBER}`,
    },

]

export default function HeaderPublic() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileProductOpen, setMobileProductOpen] = useState(false)

    return (
        <header className="w-full z-50">
            <nav className="mx-auto flex max-w-7xl items-center justify-between  lg:p-3 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link href="/" className="flex items-center gap-4 ml-6">
                        <span className="sr-only">{SITE_TITLE}</span>
                        <div className="relative aspect-square w-10 rounded-md overflow-hidden">
                            <Image
                                fill
                                alt="Logo"
                                src="/logo.png"
                            />
                        </div>
                        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                            {SITE_TITLE}
                        </h2>
                    </Link>

                </div>

                <div className="flex lg:hidden gap-5 m-6">
                    <Link href='/search'>
                        <Search></Search>
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
                    >
                        <Menu className="size-6" />
                    </button>
                </div>

                <div className="hidden lg:flex lg:gap-x-8 items-center">
                    <Link href='/products'><Button variant="ghost">{PRODUCT_OR_SERVICE}</Button></Link>
                    <Link href='/about'><Button variant="ghost">About us</Button></Link>
                    <Link href='/contact'><Button variant="ghost">Contact</Button></Link>
                </div>



                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Link href='/search'> <Search className='w-5'></Search></Link>
                </div>

            </nav>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 p-6 bg-background lg:hidden">
                    <div className="flex items-center justify-between">
                        <Image
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                            alt={SITE_TITLE}
                            width={32}
                            height={32}
                            className="h-6"
                        />
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <X className="size-6" />
                        </button>
                    </div>

                    <div className="mt-6 space-y-2">
                        <Link className="block rounded-lg px-3 py-2 font-semibold" href='/products'>{PRODUCT_OR_SERVICE}</Link>
                        <Link className="block rounded-lg px-3 py-2 font-semibold" href='/about'>About us</Link>
                        <button
                            onClick={() => setMobileProductOpen((v) => !v)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold text-gray-900 dark:text-white"
                        >
                            Contact
                            <ChevronDown className={`size-5 ${mobileProductOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {mobileProductOpen &&
                            [...products].map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="block rounded-lg px-6 py-2 text-sm font-semibold text-gray-900 dark:text-white"
                                >
                                    {item.name}
                                </a>
                            ))}

                        <a className="block rounded-lg px-3 py-2 font-semibold" href='/login'>Log in</a>
                    </div>
                </div>
            )}
        </header>
    )
}
