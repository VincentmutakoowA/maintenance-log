import { COMPANY_TEAM_MESSAGE, COMPANY_TEAM } from "@/lib/config"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image"

export default function Team() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-20">
            <div className="grid gap-10 lg:grid-cols-3">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight">
                        Our team
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {COMPANY_TEAM_MESSAGE}
                    </p>
                </div>

                <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
                    {COMPANY_TEAM.map((member) => (
                        <Card key={member.name} className="overflow-hidden p-0">
                            <div className="relative aspect-square">
                                <Image
                                    src={member.imageUrl}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <CardHeader>
                                <CardTitle>{member.name}</CardTitle>
                                <CardDescription>
                                    {member.role}
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {member.bio}
                                </p>
                            </CardContent>
                            <CardFooter/>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
