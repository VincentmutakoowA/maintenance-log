'use client'

import HeaderAdmin from "@/app/admin/header-admin";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname()

  return (
    <div className="flex flex-col items-center min-h-screen w-full min-h-screen ">
      <HeaderAdmin />
      <div className="px-4 border-b-2 border-primary w-full flex justify-center "></div>
      
      <div className="flex gap-4 w-full py-2 max-w-6xl px-4 ">
        <Link href={'/admin/home'}> <Button variant={pathname === '/admin/home' ? 'default' : 'outline'} >Home</Button></Link>
        <Link href={'/admin/faults'}> <Button variant={pathname === '/admin/faults' ? 'default' : 'outline'} >Fault Report Form</Button></Link>
        <Link href={'/admin/maintenance'}> <Button variant={pathname === '/admin/maintenance' ? 'default' : 'outline'} >Maintenance Flow</Button></Link>
        <Link href={'/admin/computers'}> <Button variant={pathname === '/admin/computers' ? 'default' : 'outline'}>Computer List</Button></Link>
        <Link href={'/admin/laboratories'}> <Button variant={pathname === '/admin/laboratories' ? 'default' : 'outline'} >Laboratories</Button></Link>
      </div>
      <div className="border-b-2 border-primary w-full flex justify-center "></div>

      <div className="p-4 w-full max-w-6xl flex justify-center">
        {children}
      </div>

    </div>
  )
}