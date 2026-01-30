'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Loader2 } from 'lucide-react'

function LoginContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const error = searchParams.get('error')

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl)
    }
  }, [status, router, callbackUrl])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (status === 'authenticated') {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">AARI Docs</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-semibold text-center text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Sign in to access your documents
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error === 'OAuthSignin' && 'Error starting sign in process'}
              {error === 'OAuthCallback' && 'Error during sign in callback'}
              {error === 'OAuthAccountNotLinked' && 'Email already linked to another account'}
              {error === 'Callback' && 'Error in callback'}
              {error === 'Default' && 'An error occurred'}
              {!['OAuthSignin', 'OAuthCallback', 'OAuthAccountNotLinked', 'Callback', 'Default'].includes(error) && 'An error occurred'}
            </div>
          )}

          {/* Sign in button */}
          <Button
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
            variant="outline"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}