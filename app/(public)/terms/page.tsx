import {
    COMPANY_NAME,
    TERMS_INTRO,
    TERMS_USAGE,
    TERMS_LIMITATION,
    TERMS_CONTACT,
} from "@/lib/config"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function TermsPage() {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-20 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        Terms & Conditions
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                        {TERMS_INTRO.replace("{company}", COMPANY_NAME)}
                    </p>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                            Acceptable use
                        </h3>
                        <p className="text-muted-foreground">
                            {TERMS_USAGE}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                            Limitation of liability
                        </h3>
                        <p className="text-muted-foreground">
                            {TERMS_LIMITATION}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                            Contact
                        </h3>
                        <p className="text-muted-foreground">
                            {TERMS_CONTACT}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
