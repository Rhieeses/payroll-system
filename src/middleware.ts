import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
	let token = req.cookies.get('token')?.value;
	const { pathname } = req.nextUrl;

	if (pathname === '/login' || pathname === '/') {
		return NextResponse.next();
	}

	if (!token) {
		const loginUrl = `${req.nextUrl.origin}/login`;
		return NextResponse.redirect(loginUrl);
	}

	/**
	if (pathname === '/login' && token) {
		try {
			const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
			return NextResponse.redirect(new URL('/dashboard', req.url));
		} catch (err) {
			console.error('Invalid token on /login:', err);
			// If token is invalid, allow access to /login
			return NextResponse.next();
		}
	} */

	try {
		const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

		const decoded = payload;

		const userRoutes = ['/dashboard', '/employees', '/departments', '/attendance', '/payroll'];
		const adminRoutes = ['/admin'];

		if (adminRoutes.some((route) => pathname.startsWith(route))) {
			if (decoded.position !== 'Admin') {
				const unauthorizedUrl = `${req.nextUrl.origin}/unauthorized`;
				return NextResponse.redirect(unauthorizedUrl);
			}
		}

		if (userRoutes.some((route) => pathname.startsWith(route))) {
			if (decoded.position !== 'User' && decoded.position !== 'Admin') {
				const unauthorizedUrl = `${req.nextUrl.origin}/unauthorized`;
				return NextResponse.redirect(unauthorizedUrl);
			}
		}

		if (
			decoded.position === 'Admin' &&
			!adminRoutes.some((route) => pathname.startsWith(route))
		) {
			const adminUrl = `${req.nextUrl.origin}/admin`;
			return NextResponse.redirect(adminUrl);
		}

		return NextResponse.next();
	} catch (err) {
		console.error('JWT verification error:', err);
		const loginUrl = `${req.nextUrl.origin}/login`;
		return NextResponse.redirect(loginUrl);
	}
}

export const config = {
	matcher: [
		'/dashboard',
		'/departments',
		'/employees',
		'/employees/:path*',
		'/login',
		'/attendance',
		'/payroll',
	],
};
