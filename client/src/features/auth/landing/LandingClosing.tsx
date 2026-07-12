import { motion } from 'framer-motion';
import { ArrowRight, Sprout } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export function LandingClosing() {
  return (
    <div className="dark">
      <section className="bg-surface-page px-6 py-24 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-3xl flex-col items-start gap-6"
        >
          <p className="font-mono text-xs font-medium tracking-wide text-accent">// start logging today</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-primary sm:text-4xl">
            Your next ticket is already going to teach you something. Don't let it evaporate.
          </h2>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              window.location.href = `${API_BASE_URL}/auth/login`;
            }}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent-gradient px-6 text-base font-semibold text-accent-ink shadow-lg shadow-accent-glow hover:brightness-110"
          >
            Continue with WorkOS
            <ArrowRight className="size-4" />
          </motion.button>
        </motion.div>
      </section>

      <footer className="flex flex-col items-center gap-2 border-t border-border-hairline bg-surface-page px-6 py-8 text-center">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink-secondary">
          <Sprout className="size-4 text-accent" />
          Motiva
        </div>
        <p className="text-xs text-ink-muted">A personal growth tracker for IT/tech work.</p>
      </footer>
    </div>
  );
}
