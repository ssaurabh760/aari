import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // If authenticated, continue
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page and auth routes without auth
        const path = req.nextUrl.pathname
        if (
          path.startsWith('/login') ||
          path.startsWith('/api/auth') ||
          path.startsWith('/_next') ||
          path.startsWith('/favicon')
        ) {
          return true
        }
        // For all other routes, require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)',
  ],
}