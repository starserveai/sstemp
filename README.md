# SStemp

SSTemp is a starter React template and framework designed for the rapid development of responsive, cross-platform enterprise SaaS applications. It leverages React, Next.js, and Tailwind CSS.
 
The objective of the project is to create a platform for seamless, connected two way sharing of project information between design, design, development, test and deployment teams.

Based on a responsive web platform, we’ll be working on approaches that allows rapid applications of AI powered apps on de-jure web standards for design and development.  This is a development project, not a product.

Our Vision is to create a template, environment and platform that helps automate the Design--Deployment process.

Processes and Workflows Supported with SStemp: 

**Design Creation**  Use tools such as Figma and others to create your design theme.  Utilize variables, styles, color palettes, typography and more.  

**Design Elements**  Utilize any popular JS or TS component library with your design tool and target a plain vanilla, responsive, react template for SaaS apps.
                                       Unstyled or styled components can be used in Figma and in this project.

**Design Prototyping**  Rapidly create a design prototype for clients in Figma and other design apps and prototype it. Export the functionality of the prototype to your own SStemp template.

**Design to Code**
--Target this SaaS app template and tech stack with your UI designs for rapid dev with or without AI
--Use AI code gen with your design deployed to SStemp
--UI design token export from Figma in JSON and CSS
--UI design export from Figma via Figma API/FigSpec; embed a figma UI design in your app
--
**Develop**  
--Use the generated code as a starting point
--Communicate app UI changes to designers via Figma and Figma API for real-time updates

**Test**
More soon here.

**Deploy**
More soon - for now use your local machine or NextJS.

**Tech Stack**
 React, Tailwind CSS, Next.js.  Flexibility to select your own Component libraries and themes.  Theme switching based on Tailwind CSS.


# SSTemp Getting Started

This is a platform for learning and development, so we've included some helpful info on how to get the environment setup to run react and nextjs in order to speed the process of getting started.

## Project Requirements

To run this project locally, you need the following software installed:

- **Node.js** (Recommended Version: 16.x or later)  
  [Download Node.js here](https://nodejs.org/)
- **npm** (Comes with Node.js installation)
- **Optional: nvm** (Node Version Manager) for managing Node.js versions  
  [Install nvm here](https://github.com/nvm-sh/nvm)

## Checking Installed Versions

Before starting, verify if you have the correct versions of the required software:

1. **Check Node.js version**:
   ```
   node -v
   ```
   If your version is lower than V16, you need to update.

2. **Check npm version**:
   ```
   npm -v
   ```
   If npm is outdated (earlier than V16, update it by running:
   ```
   npm install -g npm
   ```

3. **Optional**: Check nvm version (if installed):
   ```
   nvm --version
   ```

4. **Check React version** (after installing dependencies):
   ```
   npx react --version
   ```

## Updating to the Correct Versions of Required apps

1. **Update Node.js**:  
   Please check the version of NodeJS that you are using.

   - Using nvm (recommended):
     ```
     nvm install 16
     nvm use 16
     ```
   - Without nvm: Download and install the latest Node.js version from the [official site](https://nodejs.org/).

2. **Update React (if necessary)**: React will be installed automatically with dependencies, but if you need to update it.
   This command tells npm (Node Package Manager) to install specified packages and update your node_modules folder with those packages.
   ```
   npm install react@latest react-dom@latest
   ```

## Project Setup

Follow these steps to set up the project on your local machine:

1. **Clone the Repository**:
   ```
   git clone https://github.com/starserveai/sstemp.git
   ```

2. **Navigate to the Project Directory**:
   ```
   cd sstemp
   ```

3. **Install Dependencies**:
   ```
   npm install
   ```

4. **Set Up Environment Variables**:
   - Duplicate the sample environment file:
     ```
     cp .env.sample .env.local
     ```
   - Review and update the variables in `.env.local` to match your local environment settings.

## Project Build and Run

1. **Start the Development Server**:
   ```
   npm run dev
   ```

2. **Access the Application**:  
   Open your web browser and navigate to `http://localhost:3000`.

3. **Linting and Formatting**:  
   To ensure code quality and consistency, run:
   ```
   npm run lint
   ```

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

## Contributing

Contributions are welcome! Here's how you can get started:

1. Fork this repository.
2. Create a feature branch: `git checkout -b my-feature`.
3. Commit your changes: `git commit -m "Add my feature"`.
4. Push to the branch: `git push origin my-feature`.
5. Open a pull request.


**Project Status disclosure**
--We're in the early stages of validating this framework
--Its not production ready
--This is a not for profit project so we work on it when we have time

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.
