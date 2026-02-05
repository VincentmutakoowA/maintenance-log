import {
    COMPANY_SLOGAN,
    COMPANYY_DESCRIPTION as COMPANY_DESCRIPTION,
    COMPANY_MISSION,
} from "@/lib/config"
import Team from "./team"
import CoreValues from "./core-values"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
    return (
        <div className="w-full">
            {/* Intro */}
            <section className="w-full max-w-7xl mx-auto px-4 py-20">
                <Card className="border-none shadow-none">
                    <CardContent className="space-y-6">
                        <h1 className="text-4xl font-extrabold tracking-tight text-balance">
                            {COMPANY_SLOGAN}
                        </h1>
                        <p className="text-muted-foreground leading-7 max-w-3xl">
                            {COMPANY_DESCRIPTION}
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Mission */}
            <section className="w-full max-w-7xl mx-auto px-4 pb-20">
                <Card>
                    <CardContent className="space-y-4 py-10">
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Our mission
                        </h2>
                        <p className="text-muted-foreground leading-7 max-w-3xl">
                            {COMPANY_MISSION}
                        </p>
                    </CardContent>
                </Card>
            </section>

            <CoreValues />
            <Team />
        </div>
    )
}
