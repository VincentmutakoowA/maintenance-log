import {
    COMPANY_NAME,
    PRIVACY_POLICY_INTRO,
    PRIVACY_POLICY,
} from "@/lib/config"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function PrivacyPolicyPage() {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-20 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        Privacy Policy
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                        {PRIVACY_POLICY_INTRO.replace("{company}", COMPANY_NAME)}
                    </p>
                    <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

                    {PRIVACY_POLICY.map((section, index) => (
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
