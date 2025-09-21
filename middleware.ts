// middleware.ts (in your root directory)
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow public routes
        if (pathname.startsWith('/auth/') || 
            pathname === '/' || 
            pathname.startsWith('/api/auth/') ||
            pathname.startsWith('/api/staff/search') ||
            pathname.startsWith('/booking')) {
          return true
        }

        // Require authentication for protected routes
        if (pathname.startsWith('/booking') ||
            pathname.startsWith('/booking/') ||
            pathname.startsWith('/staff/') && !pathname.startsWith('/api/staff/search')) {
          return !!token
        }

        // Staff-only routes
        if (pathname.startsWith('/staff/dashboard')) {
          return token?.role === 'STAFF'
        }

        // Client-only routes
        if (pathname.startsWith('/booking') || 
            pathname.startsWith('/booking/')) {
          return token?.role === 'CLIENT'
        }

        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}