import {
    COMPANY_NAME,
    PRIVACY_POLICY_INTRO,
    PRIVACY_POLICY_DATA,
    PRIVACY_POLICY_CONTACT,
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

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                            Information we collect
                        </h3>
                        <p className="text-muted-foreground">
                            {PRIVACY_POLICY_DATA}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                            Contact
                        </h3>
                        <p className="text-muted-foreground">
                            {PRIVACY_POLICY_CONTACT}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
