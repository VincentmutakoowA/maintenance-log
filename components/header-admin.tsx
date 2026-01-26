'use client'

import { useState } from 'react'
import {
    Menu,
    X,
    ChevronDown,
    PieChart,
} from 'lucide-react'
import { Button } from './ui/button'
import { PRODUCT_OR_SERVICE, SITE_TITLE } from '@/lib/config'

const products = [
    {
        name: 'Careers',
        description: 'Get hired',
        href: '/admin/careers',
        icon: PieChart,
    },
]


export default function HeaderAdmin() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [productOpen, setProductOpen] = useState(false)
    const [mobileProductOpen, setMobileProductOpen] = useState(false)

    return (
        <header className="w-full z-50">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:p-3 lg:px-8">
                <div className="flex lg:flex-1 gap-2">
                    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                        Admin
                    </h2>
                </div>

                <div className="flex lg:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400"
                    >
                        <Menu className="size-6" />
                    </button>
                </div>

                <div className="hidden lg:flex lg:gap-x-12">
                    <a href='/admin/products'><Button variant="ghost">{PRODUCT_OR_SERVICE}</Button></a>
                    <a href='/admin/products/featured'><Button variant="ghost">Featured</Button></a>
                    <a href='/admin/about'><Button variant="ghost">News</Button></a>
                    <a href='/admin/contact'><Button variant="ghost">Careers</Button></a>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href='/login'><Button variant="ghost">Sign out</Button></a>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 p-6 dark:bg-background lg:hidden">

                    <div className="flex items-center justify-between">
                        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                            Admin
                        </h2>
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <X className="size-6 text-gray-700 dark:text-gray-400" />
                        </button>
                    </div>

                    <div className="mt-6 space-y-2">


                        <a className="block rounded-lg px-3 py-2 font-semibold" href='/admin/products'>{PRODUCT_OR_SERVICE}</a>
                        <a className="block rounded-lg px-3 py-2 font-semibold" href='/admin/products/featured'>Featured</a>
                        <a className="block rounded-lg px-3 py-2 font-semibold" href='/admin/news'>News</a>

                        <button
                            onClick={() => setMobileProductOpen((v) => !v)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold text-gray-900 dark:text-white"
                        >
                            More
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
                            ))
                        }
                        <a className="block rounded-lg px-3 py-2 font-semibold">Sign out</a>

                    </div>
                </div>
            )}
        </header>
    )
}
