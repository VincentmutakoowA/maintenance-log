"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeClosed } from "lucide-react"

type LoginFormProps = {
  loginAction: (formData: FormData) => void
  signupAction: ( formData: FormData ) => void
  className?: string
}


export function LoginForm({ className, loginAction, signupAction,}: LoginFormProps) {

  const [passwordView, setPasswordView] = useState(false)

  return (
    <div className={cn("flex flex-col gap-6", className)}>

      <Card className="overflow-hidden p-0 max-w-sm mx-auto w-full">
        <CardContent className="grid p-0">
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
                    type={passwordView ? "text" : "password"}
                    name="password"
                    required
                    className="rounded-r-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-l-none border-l-0"
                    onClick={() => setPasswordView(!passwordView)}
                  >
                    {passwordView ? <EyeClosed /> : <Eye />}
                  </Button>
                </div>
              </Field>

              <Field>
                <Button formAction={loginAction}>Login</Button>
                <Button formAction={signupAction} variant="outline" >  Sign up </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
