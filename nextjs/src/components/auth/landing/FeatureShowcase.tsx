'use client';

import { motion } from 'framer-motion';
import { BarChart3, CheckSquare, GraduationCap, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.45, delay },
});

export function FeatureShowcase() {
  return (
    <section id="showcase" className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
      <motion.div {...fadeUp(0)} className="max-w-lg">
        <p className="font-mono text-xs font-medium tracking-wide text-accent">// what it actually tracks</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-primary">One habit, five views</h2>
      </motion.div>

      <div className="mt-10 grid gap-4 lg:grid-cols-4 lg:grid-rows-2">
        <motion.div {...fadeUp(0.05)} className="rounded-2xl border border-border-hairline bg-surface p-6 lg:col-span-2 lg:row-span-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-status-good" />
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Tickets → FAQ</span>
          </div>
          <h3 className="mt-3 text-xl font-bold text-ink-primary">Resolve it once, find it forever</h3>
          <p className="mt-2 max-w-sm text-sm text-ink-secondary">
            A status lifecycle, an activity timeline, and a similar-ticket nudge so repeat issues never start from a
            blank page — and a resolved ticket can draft its own searchable FAQ entry in one click.
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-border-hairline bg-surface-page p-3">
            <span className="flex-1 truncate text-sm font-medium text-ink-primary">Rate limit on /reports export</span>
            <Badge tone="good">Resolved</Badge>
            <Badge tone="blue">FAQ</Badge>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="rounded-2xl border border-border-hairline bg-surface p-5">
          <GraduationCap className="size-5 text-cat-aqua" />
          <h3 className="mt-3 text-sm font-semibold text-ink-primary">Learning & topics</h3>
          <p className="mt-1.5 text-sm text-ink-muted">See which topics are going stale before the details fade.</p>
        </motion.div>

        <motion.div {...fadeUp(0.15)} className="rounded-2xl border border-border-hairline bg-surface p-5">
          <BarChart3 className="size-5 text-cat-orange" />
          <h3 className="mt-3 text-sm font-semibold text-ink-primary">Skill growth</h3>
          <p className="mt-1.5 text-sm text-ink-muted">Reps and blind spots, fully derived — no manual bookkeeping.</p>
        </motion.div>

        <motion.div
          {...fadeUp(0.2)}
          className="dark rounded-2xl border border-border-hairline bg-surface p-5 text-ink-primary"
        >
          <Users className="size-5 text-cat-magenta" />
          <h3 className="mt-3 text-sm font-semibold">Relationships</h3>
          <p className="mt-1.5 text-sm text-ink-muted">Never miss a follow-up you meant to send.</p>
        </motion.div>

        <motion.div {...fadeUp(0.25)} className="rounded-2xl border border-border-hairline bg-surface p-5">
          <CheckSquare className="size-5 text-cat-green" />
          <h3 className="mt-3 text-sm font-semibold text-ink-primary">Tasks</h3>
          <p className="mt-1.5 text-sm text-ink-muted">Standalone, or linked straight to the ticket they came from.</p>
        </motion.div>
      </div>
    </section>
  );
}
