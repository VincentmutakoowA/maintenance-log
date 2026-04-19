'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import Link from 'next/link'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog'


export default function HeaderAdmin() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [signOutOpen, setSignOutOpen] = useState(false)

    return (
        <header className="w-full z-50">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:p-3 lg:px-8">
                <div className="flex lg:flex-1 gap-2">
                    <Link href='/admin'>
                        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                            Dashboard
                        </h2>
                    </Link>
                </div>

                <div className="flex lg:hidden gap-5">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
                    >
                        <Menu className="size-6" />
                    </button>
                </div>

                <div className="hidden lg:flex lg:gap-x-12">
                    <Link href='/'><Button variant="ghost">Home</Button></Link>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Button variant="ghost" onClick={() => setSignOutOpen(true)}>Sign out</Button>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 p-6 bg-background lg:hidden">

                    <div className="flex items-center justify-between">
                        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                            Dashboard
                        </h2>
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <X className="size-6" />
                        </button>
                    </div>

                    <div className="mt-6 space-y-2">


                        <button
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold text-gray-900 dark:text-white">
                            <Link href='/'>
                                Home
                            </Link>
                        </button>

                        <Button variant="ghost" className="text-md font-bold" onClick={() => setSignOutOpen(true)}>Sign out</Button>

                    </div>
                </div>
            )}

            <Dialog open={signOutOpen} onOpenChange={setSignOutOpen}>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle >Sign out</DialogTitle>
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

