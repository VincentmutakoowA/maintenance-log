import { Card, CardHeader, CardDescription, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <h1 className="text-4xl font-bold ">404 - Page Not Found</h1>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        Sorry, the page you are looking for was removed or does not exist.
                    </CardDescription>
                </CardContent>
                <CardFooter>
                    <Link href="/" className="w-full">
                        <Button className="w-full">
                            Go to Home
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )

}