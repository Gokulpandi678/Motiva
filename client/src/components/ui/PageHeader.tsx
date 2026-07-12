import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-wrap items-start justify-between gap-3"
    >
      <div>
        <div className="flex items-center gap-2.5">
          <span className="h-6 w-1.5 rounded-full bg-accent-gradient" />
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-primary">{title}</h1>
        </div>
        {description ? <p className="mt-1.5 ml-4 text-sm text-ink-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </motion.div>
  );
}
