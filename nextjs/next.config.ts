import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `pg` uses native Node APIs (net/tls/dns) that don't exist in the edge
  // runtime — keep it external to the server bundle rather than bundling it,
  // same reasoning as the old Express server just running plain Node.
  serverExternalPackages: ['pg'],

  // Subset of `helmet()`'s defaults that carry zero risk of changing app
  // behavior (unlike a hand-rolled Content-Security-Policy, which could
  // silently block a font/script and *cause* visual drift — left out
  // deliberately, see migration notes).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
        ],
      },
    ];
  },
};

export default nextConfig;
