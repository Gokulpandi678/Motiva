'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { DashboardMockup } from './DashboardMockup';
import { TiltCard } from './TiltCard';

// Frontend and API are now one same-origin Next.js app, so this is always a relative path.
const API_BASE_URL = '/api/v1';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-dot-grid px-6 pt-20 pb-20 sm:pt-24 sm:px-10 lg:pb-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-surface-page to-transparent" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="font-mono text-xs font-medium tracking-wide text-accent">
            // built for the work you already do
          </motion.p>

          <motion.h1 variants={item} className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-primary sm:text-5xl">
            The ticket you just closed{' '}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">already taught you something</span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-accent-soft" aria-hidden />
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-md text-base text-ink-secondary sm:text-lg">
            Motiva quietly turns the tickets you resolve, the things you learn, and the people you work with into a
            searchable FAQ, a skills map, and a to-do list — without asking you to fill out a second system of
            record.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
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
            <a href="#showcase" className="text-sm font-medium text-ink-secondary underline decoration-border-hairline underline-offset-4 hover:text-accent">
              See what it tracks
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mx-auto w-full max-w-md"
        >
          <TiltCard className="aspect-[4/3] w-full rounded-2xl border border-border-hairline bg-surface shadow-2xl">
            <DashboardMockup />
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
