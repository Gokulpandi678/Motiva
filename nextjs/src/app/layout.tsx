import type { Metadata, Viewport } from 'next';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Motiva',
  icons: { icon: '/favicon.svg' },
};

// Same as the old Vite index.html's explicit <meta name="viewport"> tag.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Same blocking inline script the Vite `index.html` used to run before React
// mounted, so the `dark` class is applied before first paint (no theme
// flash). Kept byte-for-byte identical in behavior, just relocated here
// since Next.js has no separate index.html to own it.
const THEME_INIT_SCRIPT = `
try {
  var stored = JSON.parse(localStorage.getItem('motiva:theme') || '"light"');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!localStorage.getItem('motiva:theme') && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the script below mutates this element's
    // class directly (adding "dark") before React hydrates, so the actual
    // DOM never matches the server-rendered markup for this one attribute —
    // by design, same as the old app's pre-mount script. This tells React
    // to trust the DOM here instead of overwriting/warning about it; it
    // doesn't suppress hydration checks anywhere else.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
