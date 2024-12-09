import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ req }) => {
      const path = req.nextUrl.pathname;
      return path !== '/checkout' || req.nextauth?.token;
    },
  },
});

export const config = { matcher: ['/checkout'] };
