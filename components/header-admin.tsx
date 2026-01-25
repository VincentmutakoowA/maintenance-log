'use client'

import { useState } from 'react'
import {
    Menu,
    X,
    ChevronDown,
    PieChart,
    MousePointerClick,
    Fingerprint,
    SquarePlus,
    RefreshCw,
    PlayCircle,
    Phone,
} from 'lucide-react'
import { Button } from './ui/button'
import { PRODUCT_OR_SERVICE, SITE_TITLE } from '@/lib/config'

const products = [
    {
        name: 'Analytics',
        description: 'Get a better understanding of your traffic',
        href: '#',
        icon: PieChart,
    },
    {
        name: 'Engagement',
        description: 'Speak directly to your customers',
        href: '#',
        icon: MousePointerClick,
    },
    {
        name: 'Security',
        description: 'Your customers’ data will be safe and secure',
        href: '#',
        icon: Fingerprint,
    },
    {
        name: 'Integrations',
        description: 'Connect with third-party tools',
        href: '#',
        icon: SquarePlus,
    },
    {
        name: 'Automations',
        description: 'Build strategic funnels that will convert',
        href: '#',
        icon: RefreshCw,
    },
]

const callsToAction = [
    { name: 'Watch demo', href: '#', icon: PlayCircle },
    { name: 'Contact sales', href: '#', icon: Phone },
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
                    <div className="relative">
                        <Button
                            variant="ghost"
                            onClick={() => setProductOpen((v) => !v)}
                            className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-white"
                        >
                            {PRODUCT_OR_SERVICE}
                            <ChevronDown className="size-5 text-gray-400" />
                        </Button>

                        {productOpen && (
                            <div className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 rounded-3xl bg-white shadow-lg dark:bg-gray-800">
                                <div className="p-4">
                                    {products.map((item) => (
                                        <div
                                            key={item.name}
                                            className="group flex items-center gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-white/5"
                                        >
                                            <div className="flex size-11 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                                <item.icon className="size-6 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <a href={item.href} className="font-semibold text-gray-900 dark:text-white">
                                                    {item.name}
                                                </a>
                                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 divide-x bg-gray-50 dark:bg-gray-700/50">
                                    {callsToAction.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="flex items-center justify-center gap-x-2 p-3 text-sm font-semibold text-gray-900 dark:text-white"
                                        >
                                            <item.icon className="size-5 text-gray-400" />
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <a href='/about'><Button variant="ghost">About us</Button></a>
                    <a href='/contact'><Button variant="ghost">Contact</Button></a>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href='/login'><Button variant="ghost">Login</Button></a>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-white p-6 dark:bg-gray-900 lg:hidden">
                    <div className="flex items-center justify-between">
                         <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                        Admin
                    </h2>
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <X className="size-6 text-gray-700 dark:text-gray-400" />
                        </button>
                    </div>

                    <div className="mt-6 space-y-2">
                        <button
                            onClick={() => setMobileProductOpen((v) => !v)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold text-gray-900 dark:text-white"
                        >
                            Product
                            <ChevronDown className={`size-5 ${mobileProductOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {mobileProductOpen &&
                            [...products, ...callsToAction].map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="block rounded-lg px-6 py-2 text-sm font-semibold text-gray-900 dark:text-white"
                                >
                                    {item.name}
                                </a>
                            ))}

                        <a className="block rounded-lg px-3 py-2 font-semibold">Features</a>
                        <a className="block rounded-lg px-3 py-2 font-semibold">Marketplace</a>
                        <a className="block rounded-lg px-3 py-2 font-semibold">Company</a>
                        <a className="block rounded-lg px-3 py-2 font-semibold">Log in</a>
                    </div>
                </div>
            )}
        </header>
    )
}
