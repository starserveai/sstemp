import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { getUser } from './app/lib/users/data';
import bcrypt from 'bcrypt';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      /**
       * Authorize function for the Credentials provider.
       * In development mode, bypass authentication and return a default user.
       */
      async authorize(credentials) {
        // Bypass authentication in development mode
        if (process.env.NODE_ENV === 'development') {
          return { id: 1, name: 'Developer', email: 'developer@example.com' };
        }

        // Regular authentication logic
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }
        return null; // Login failed
      },
    }),
  ],
});