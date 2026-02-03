import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin, Instagram } from "lucide-react"
import { COMPANY_SLOGAN, LOCATION, PHONE_NUMBER, PRODUCT_OR_SERVICE, SITE_TITLE } from "@/lib/config"
import { ThemeSwitcher } from "../../components/kibo-ui/theme-switcher"
import WhatsAppButton from "./whatsapp-button"

export function FooterPublic() {
    
    return (
        <footer className=" w-full">

            <WhatsAppButton />

            <div className="container mx-auto px-8 py-12 max-w-7xl">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">{SITE_TITLE}</h3>
                        <p className="text-sm text-muted-foreground">
                            {COMPANY_SLOGAN}
                        </p>
                    </div>

                    {/* Main Pages */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Pages</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/products">{PRODUCT_OR_SERVICE}</Link></li>
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Sub Pages */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Resources</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><Link href="/terms">Terms of Service</Link></li>
                            <hr></hr>
                            <li>{LOCATION}</li>
                            <li>{PHONE_NUMBER}</li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Social</h4>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="https://github.com" aria-label="GitHub">
                                    <Github className="h-5 w-5" />
                                </Link>
                            </Button>

                            <Button variant="ghost" size="icon" asChild>
                                <Link href="https://twitter.com" aria-label="Twitter">
                                    <Twitter className="h-5 w-5" />
                                </Link>
                            </Button>

                            <Button variant="ghost" size="icon" asChild>
                                <Link href="https://linkedin.com" aria-label="LinkedIn">
                                    <Linkedin className="h-5 w-5" />
                                </Link>
                            </Button>

                            <Button variant="ghost" size="icon" asChild>
                                <Link href="https://instagram.com" aria-label="Instagram">
                                    <Instagram className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between">
                    <span>© {new Date().getFullYear()} {SITE_TITLE}. All rights reserved.</span>
                    <div className="flex flex-col gap-2">
                        <span>Made with love by Vilosoft inc.</span>
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </footer>
    )
}
