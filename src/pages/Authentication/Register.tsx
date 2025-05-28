import { RegisterForm } from "@/components/blocks/authentication/register/register-form"

export default function Register() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 bg-login">
      <div className="flex w-full max-w-md flex-col gap-6">
        <RegisterForm />
      </div>
    </div>
  )
}

