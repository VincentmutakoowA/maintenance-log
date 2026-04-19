'use client'

import ErrorClient from "./error-client"
import { usePathname } from "next/navigation"

export default function Page() {
    const pathname = usePathname()
    if (pathname !== '/error?Invalid%20login%20credentials') {
        return (
        <>
            <ErrorClient message='Invalid login credentials.' />
        </>)
    }
    else {
        return (<ErrorClient message='An unexpected error has occurred.' />)
    }
}