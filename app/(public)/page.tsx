import { Button } from "@/components/ui/button";
import { COMPANY_SLOGAN, HERO_INTRO, PRODUCT_OR_SERVICE } from "@/lib/config";
import Link from "next/link";

export default function Page() {
    return (
        <div className="w-full">

            <div className="relative isolate px-6 pt-14 lg:px-8 min-h-screen">
                
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">

                    </div>
                    <div className="text-center">
                        <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
                            {HERO_INTRO} </h1>
                        <p className="mt-8 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
                            {COMPANY_SLOGAN} </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/login"
                            >
                                <Button>Log in</Button>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}