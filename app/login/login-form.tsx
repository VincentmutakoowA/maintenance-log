"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useActionState, useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Field,
    //FieldDescription,
    FieldGroup,
    FieldLabel,
    //FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeClosed } from "lucide-react"
//import { SITE_TITLE } from "@/lib/config"

const initialState = { success: false, message: '' }
type SignupState = {
    success: boolean
    message: string
}
type LoginFormProps = {
    loginAction: (formData: FormData) => void
    signupAction: (
        prevState: SignupState,
        formData: FormData
    ) => Promise<SignupState>
    className?: string
}


export function LoginForm({
    className,
    loginAction,
    signupAction,
}: LoginFormProps) {

    const [signupState, signupFormAction, isPending] = useActionState(signupAction, initialState)
    const [passwordView, setPasswordView] = useState(false)
    const [isDialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (signupState.success) setDialogOpen(true);
    }, [signupState.success]);

    return (
        <div className={cn("flex flex-col gap-6", className)}>

            <Dialog open={signupState.success} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm your email</DialogTitle>
                        <DialogDescription>
                            {signupState.message}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card className="overflow-hidden p-0 max-w-sm mx-auto w-full"> {/* md:max-w-md for image */ }
                <CardContent className="grid p-0 md:grid-cols-1"> {/* md:grid-cols-2 for image*/}
                    <form className="p-6 md:p-8">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <div className="flex">
                                    <Input
                                        id="password"
                                        type={passwordView === false ? "password" : "text"}
                                        name="password"
                                        required
                                        className="rounded-r-none"
                                    />
                                    <Button type="button" variant="outline" className="rounded-l-none border-l-0" onClick={() => { setPasswordView(!passwordView) }}>{passwordView === true ? <EyeClosed /> : <Eye />}</Button>
                                </div>
                            </Field>
                            <Field>
                                <Button formAction={loginAction}>Login</Button>
                                <Button formAction={signupFormAction} variant="outline">Sign up</Button>

                            </Field>

                            {
                                /*
                                 <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                                </FieldSeparator>
                                <Field className="grid grid-cols-1 gap-4">
                                <Button variant="outline" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="sr-only">Login with Google</span>
                                </Button>
                                </Field>
                                */
                            }
                        </FieldGroup>
                    </form>
                    {
                        //Side Image
                        /*
                         <div className="bg-muted relative hidden md:block">
                        <img
                            src="/placeholder.svg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                         </div>
                        */
                    }
                   
                </CardContent>
            </Card>
            {
                /*
                 <FieldDescription className="px-6 text-center">
                 By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                 and <a href="#">Privacy Policy</a>.
                 </FieldDescription>
                */ 
            }
        </div>
    )
}
