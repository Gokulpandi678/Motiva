import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

/** Classic scrolled-nav treatment: transparent over the hero, gains a blurred surface + hairline once you scroll past it. */
export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between px-6 py-4 transition-all duration-300 sm:px-10',
        scrolled
          ? 'border-b border-border-hairline bg-surface/80 shadow-sm backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-accent-gradient text-accent-ink shadow-md shadow-accent-glow">
          <Sprout className="size-5" />
        </div>
        <span className="text-lg font-extrabold tracking-tight text-ink-primary">Motiva</span>
      </div>
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          window.location.href = `${API_BASE_URL}/auth/login`;
        }}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-accent-gradient px-4 text-sm font-semibold text-accent-ink shadow-sm shadow-accent-glow hover:brightness-110"
      >
        Sign in
      </motion.button>
    </motion.header>
  );
}
