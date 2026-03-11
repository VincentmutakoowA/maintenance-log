import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Instagram,  } from "lucide-react"
import { COMPANY_INSTAGRAM_URL, COMPANY_SLOGAN, LOCATION, PHONE_NUMBER, PRODUCT_OR_SERVICE, SITE_TITLE } from "@/lib/config"
import { ThemeSwitcher } from "../../components/kibo-ui/theme-switcher"

export function FooterPublic() {

    return (
        <footer className=" w-full z-10">


            <div className="container mx-auto px-8 py-12 max-w-7xl">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 ">
                    {/* Brand */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">{SITE_TITLE}</h2>
                        <p className="text-sm text-muted-foreground">
                            {COMPANY_SLOGAN}
                        </p>
                    </div>

                    {/* Main Pages */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold">Pages</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/products">Maintenance</Link></li>
                            <li><Link href="/faults">Faults</Link></li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between">
                    <span>© {new Date().getFullYear()} {SITE_TITLE}</span>
                    <div className="flex flex-col gap-2">
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </footer>
    )
}
