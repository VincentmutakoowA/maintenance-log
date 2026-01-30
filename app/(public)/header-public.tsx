'use client'

import { useState } from 'react'
import {
    Menu,
    X,
    ChevronDown,
    PlayCircle,
    Phone,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { PHONE_NUMBER, PRODUCT_OR_SERVICE } from '@/lib/config'

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

const callsToAction = [
    { name: 'Contact sales', href: '#', icon: Phone },
]

export default function HeaderPublic() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [productOpen, setProductOpen] = useState(false)
    const [mobileProductOpen, setMobileProductOpen] = useState(false)

    return (
        <header className="w-full z-50">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:p-3 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            alt=""
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                            className="h-8 w-auto dark:hidden"
                        />
                        <img
                            alt=""
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                            className="h-8 w-auto not-dark:hidden"
                        />
                    </a>
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
                    <a href='/products'><Button variant="ghost">{PRODUCT_OR_SERVICE}</Button></a>
                    <a href='/about'><Button variant="ghost">About us</Button></a>
                    <a href='/contact'><Button variant="ghost">Contact</Button></a>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href='/login'><Button variant="ghost">Login</Button></a>
                </div>

            </nav>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 p-6 bg-background lg:hidden">
                    <div className="flex items-center justify-between">
                        <img
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                            className="h-8"
                        />
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <X className="size-6 text-gray-700 dark:text-gray-400" />
                        </button>
                    </div>

                    <div className="mt-6 space-y-2">
                        <a className="block rounded-lg px-3 py-2 font-semibold" href='/products'>{PRODUCT_OR_SERVICE}</a>
                        <a className="block rounded-lg px-3 py-2 font-semibold" href='/about'>About us</a>
                        <button
                            onClick={() => setMobileProductOpen((v) => !v)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold text-gray-900 dark:text-white"
                        >
                            Contact
                            <ChevronDown className={`size-5 ${mobileProductOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {mobileProductOpen &&
                            [...products ].map((item) => (
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
