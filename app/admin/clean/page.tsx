"use client"

import { useState, useTransition } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { cleanupTempFiles } from "./action"

export default function TempCleanup() {
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)

    function handleCleanup() {
        startTransition(async () => {
            try {
                await cleanupTempFiles()
                alert("Temporary files deleted successfully.")
                setOpen(false)
            } catch (error) {
                alert("Failed to delete temporary files.")
            }
        })
    }

    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle>Temporary Files</CardTitle>
                <CardDescription>
                    Deletes unused files from temp storage. This cannot be undone.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Use this to clean up abandoned uploads that were never saved.
                </p>
            </CardContent>

            <CardFooter>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive">
                            Clean up temp files
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                                This will permanently delete all files in temp storage.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                onClick={handleCleanup}
                                disabled={isPending}
                            >
                                {isPending ? "Deleting…" : "Yes, delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    )
}
