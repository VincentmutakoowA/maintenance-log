import { COMPANY_TEAM_MESSAGE } from "@/lib/config";
import { COMPANY_TEAM } from "@/lib/config";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default function Team() {
    return (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <div className="w-full max-w-sm p-4">
                <h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Our team
                </h2>
                <p className="text-justify">
                    {COMPANY_TEAM_MESSAGE}
                </p>
            </div>

            <div className="w-full p-4 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 lg:col-span-2">
                {COMPANY_TEAM.map((member) => (
                    <Card key={member.name} className="p-0 w-full ">
                        <div className="aspect-square relative">
                            <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            className="object-cover"/>
                        </div>
                        <CardHeader>{member.name}</CardHeader>
                        <CardContent>
                            {member.role}
                            <CardDescription>{member.bio}</CardDescription>
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}