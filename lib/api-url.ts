// 'development' / 'production'

export const API_URL =
    process.env.NODE_ENV === 'development'
        ? (process.env.DEV_API_URL || process.env.NEXT_PUBLIC_DEV_API_URL)
        : process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error('Missing API_URL / DEV_API_URL in the .env.local file');
}
