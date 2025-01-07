import type { NextAuthConfig } from 'next-auth';

// Authentication configuration for the application
export const authConfig = {
  pages: {
    signIn: '/users/login', // The login page
  },
  callbacks: {
    /**
     * Authorized callback to determine if a user is allowed to access a route.
     * In development mode, authentication is bypassed entirely.
     */
    authorized({ auth, request: { nextUrl } }) {
      // Bypass authentication in development mode
      if (process.env.NODE_ENV === 'development') {
        return true;
      }

      // Regular authentication logic
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Authentication providers (empty for now)
} satisfies NextAuthConfig;