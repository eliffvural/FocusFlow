import { AuthForm } from '@/components/auth/auth-form'

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#020617] p-4">
            <AuthForm type="register" />
        </div>
    )
}
