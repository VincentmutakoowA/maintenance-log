import {
    COMPANY_NAME,
    TERMS_INTRO,
    TERMS_AND_CONDITIONS,
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
                        Terms of Service
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                        {TERMS_INTRO.replace("{company}", COMPANY_NAME)} By using our platform,
                        you agree to these Terms of Service.
                    </p>
                    <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

                    {TERMS_AND_CONDITIONS.map((section, index) => (
                        <div key={index} className="space-y-2">
                            <h2 className="text-l font-semibold">
                                {section.title}
                            </h2>
                            <p className="text-muted-foreground">
                                {section.description}
                            </p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
