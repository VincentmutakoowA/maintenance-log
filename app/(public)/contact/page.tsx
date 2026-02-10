import {
    CONTACT_EMAIL,
    CONTACT_PHONE,
    LOCATION,
    GOOGLE_MAP_IFRAME_URL,
} from '@/lib/config'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

export default function ContactPage() {
    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Email</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="text-sm text-muted-foreground hover:underline"
                        >
                            {CONTACT_EMAIL}
                        </a>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Phone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <a
                            href={`tel:${CONTACT_PHONE}`}
                            className="text-sm text-muted-foreground hover:underline"
                        >
                            {CONTACT_PHONE}
                        </a>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {LOCATION}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className='p-0'>
                <CardHeader>
                    <CardTitle className='pt-6'>Find us</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <iframe
                        src={GOOGLE_MAP_IFRAME_URL}
                        className="w-full h-[400px] rounded-b-lg border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
