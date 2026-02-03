import { Copy, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function ShareButton({ url }: { url: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='ghost' size='icon'>
                    <Share2></Share2>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share</DialogTitle>
                    <DialogDescription>
                        Share using the link below:
                    </DialogDescription>
                </DialogHeader>
                <div className="my-4 flex">
                    <Input
                        type="text"
                        readOnly
                        value={url}
                        className="w-full rounded-l-full"
                        onFocus={(e) => e.target.select()}
                    />
                    <Button variant='outline' className="rounded-r-full border-input" size="icon" onClick={() => {
                        navigator.clipboard.writeText(url)
                        alert("Link copied to clipboard!")
                    }}>
                        <Copy />
                    </Button>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}