import Link from 'next/link'
import { LoginForm } from '@/components/features/auth/LoginForm'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            AI Social Coach
          </h1>
          <p className="text-gray-600">Inicia sesión para continuar</p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">¿No tienes cuenta? </span>
          <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
            Regístrate gratis
          </Link>
        </div>
      </Card>
    </div>
  )
}
