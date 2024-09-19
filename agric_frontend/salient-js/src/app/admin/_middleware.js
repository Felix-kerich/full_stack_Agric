// src/app/admin/_middleware.js
import { NextResponse } from 'next/server';
import UserService from '../../hooks/UserService';

export async function middleware(req) {
    const token = UserService.getToken();
    const { pathname } = req.nextUrl;

    // Check if the token exists and user is admin
    if (pathname.startsWith('/admin') && (!token || !UserService.adminOnly())) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}
