'use client'

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"
import { Spinner } from "./ui/spinner"

export default function SubmitButton(){
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="px-4">
            Submit
            {pending && <Spinner className="size-4 mr-2" />}
        </Button>
    )
}