import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/app/lib/db';
import User from '@/app/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user) throw new Error('No user found');

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) throw new Error('Invalid password');

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();
        if (account?.provider === 'google') {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: user.id,
              authProvider: 'google',
            });
            user.id = newUser._id.toString();
          } else {
            user.id = existingUser._id.toString();
            if (!existingUser.googleId) {
              await User.findByIdAndUpdate(existingUser._id, {
                googleId: user.id,
                image: user.image,
                authProvider: 'google',
              });
            }
          }
        }
        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false;
      }
    },

    async jwt({ token, user, account, trigger, session }) {
      if (trigger === 'update' && session?.user) {
        // Update the token if the session is manually updated
        token.name = session.user.name;
        token.email = session.user.email;
        token.picture = session.user.image;
      }

      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },

    async session({ session, token }) {
      try {
        if (session?.user) {
          // Fetch fresh user data on each session
          await connectDB();
          const user = await User.findById(token.id).select('-password').lean();

          if (user) {
            session.user = {
              ...session.user,
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              image: user.image || session.user.image,
              provider: token.provider,
            };
          }
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
  },
  events: {
    async signOut({ session }) {
      // Cleanup or logging logic on signout if needed
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV === 'development',
};
