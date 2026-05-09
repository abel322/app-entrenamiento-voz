import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth-config'

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const dynamicParams = true;

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
