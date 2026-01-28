'use client'

import { useState } from 'react'
import { Menu, X, ChevronDown, PieChart } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { PRODUCT_OR_SERVICE } from '@/lib/config'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import Link from 'next/link'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog'

const products = [
    {
        name: 'Careers',
        description: 'Get hired',
        href: '/admin/careers',
        icon: PieChart,
    },
    {
        name: 'Clean',
        description: 'Clean up temporary files',
        href: '/admin/clean',
        icon: PieChart,
    }
]

export default function HeaderAdmin() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [signOutOpen, setSignOutOpen] = useState(false)
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
                    <a href='/admin/news'><Button variant="ghost">News</Button></a>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>More</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="right-50 w-40">
                                        <ListItem href="/admin/career" title="Careers">
                                            Manage Careers
                                        </ListItem>
                                        <ListItem href="/admin/clean" title="Clean">
                                            Clean up temporary files
                                        </ListItem>

                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Button variant="ghost" onClick={() => setSignOutOpen(true)}>Sign out</Button>
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

                        <Button variant="ghost" className="text-md font-bold" onClick={() => setSignOutOpen(true)}>Sign out</Button>

                    </div>
                </div>
            )}

            <Dialog open={signOutOpen} onOpenChange={setSignOutOpen}>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sign out</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to sign out?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className='w-full sm:w-auto'>Cancel</Button>
                        </DialogClose>
                        <form action="/auth/signout" method="post">
                            <Button className='w-full sm:w-auto' type="submit">Sign out</Button>
                        </form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </header>
    )
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="leading-none font-medium">{title}</div>
                        <div className="text-muted-foreground line-clamp-2">{children}</div>
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}