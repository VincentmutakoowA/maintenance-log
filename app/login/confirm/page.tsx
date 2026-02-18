import { Card, CardContent } from "@/components/ui/card";

export default function ConfirmEmail(){
 return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <Card>
            <CardContent>
                <p>Please check your email to confirm your email address.</p>
            </CardContent>
        </Card>
    </div>
 )   
}