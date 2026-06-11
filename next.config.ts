import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production'

const securityHeaders = [
  // Clickjacking protection
  { key: 'X-Frame-Options', value: 'DENY' },
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Minimal referrer to avoid leaking URLs containing patient IDs
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable unused browser features
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  // HSTS — force HTTPS for 1 year in production
  ...(isProd
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }]
    : []),
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // unsafe-eval is required by Next.js/Turbopack in dev; tighten in prod if using nonces
      `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline'",
      // blob: for QR code canvas, data: for base64 images
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      // All API calls go through the Next.js proxy (same origin)
      "connect-src 'self' https://healthbridge-backend-65sj.onrender.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.56.1'],

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://healthbridge-backend-65sj.onrender.com/api/v1/:path*',
      },
    ]
  },
};

export default nextConfig;
