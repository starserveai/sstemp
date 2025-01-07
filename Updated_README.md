
### Bypassing Authentication During Development

To simplify development, you can bypass authentication by modifying the authentication logic in the following files:

#### 1. `auth.config.ts`
In the `auth.config.ts` file, add a condition to skip authentication when running in development mode:

```typescript
export const authConfig = {
  pages: {
    signIn: '/users/login',
  },
  callbacks: {
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
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [],
};
```

#### 2. `auth.ts`
In the `auth.ts` file, add hardcoded credentials for development:

```typescript
import Credentials from 'next-auth/providers/credentials';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Hardcoded credentials for development mode
        if (
          process.env.NODE_ENV === 'development' &&
          credentials?.email === 'developer@example.com' &&
          credentials?.password === 'password'
        ) {
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
        return null;
      },
    }),
  ],
});
```

#### Testing the Changes
1. Restart the development server:
   ```bash
   npm run dev
   ```
2. Access the app without authentication or log in with:
   - **Email**: `developer@example.com`
   - **Password**: `password`
