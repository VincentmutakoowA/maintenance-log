import { COMPANY_CORE_VALUES } from "@/lib/config"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function CoreValues() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-20">
            <div className="grid gap-10 lg:grid-cols-3">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight">
                        Core values
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        What we actually stand for, not just what sounds good.
                    </p>
                </div>

                <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
                    {COMPANY_CORE_VALUES.map((value) => (
                        <Card key={value.title}>
                            <CardHeader>
                                <CardTitle>{value.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    {value.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
