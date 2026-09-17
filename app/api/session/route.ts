// @ts-ignore
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'session_token';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return Response.json({ valid: false });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        jwt.verify(token, JWT_SECRET);
        return Response.json({ valid: true, user_id: payload.user_id });
    } catch {
        return Response.json({ valid: false });
    }
}

export async function POST() {
    const cookieStore = await cookies();
    const existing = cookieStore.get(COOKIE_NAME)?.value;

    if (existing) {
        try {
            jwt.verify(existing, JWT_SECRET);
            return Response.json({ ok: true, created: false });
        } catch { }
    }

    const user_id = uuidv4();
    const token = jwt.sign({ user_id }, JWT_SECRET, { expiresIn: '30d' });

    const isProd = process.env.NODE_ENV === 'production';

    const cookieParts = [
        `${COOKIE_NAME}=${token}`,
        'HttpOnly',
        'Path=/',
        `Max-Age=${MAX_AGE_SECONDS}`,
    ];

    if (isProd) cookieParts.push('SameSite=None', 'Secure', 'Domain=.varely.co');
    else cookieParts.push('SameSite=Lax');

    return new Response(JSON.stringify({ ok: true, user_id }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookieParts.join('; '),
        },
    });
}
