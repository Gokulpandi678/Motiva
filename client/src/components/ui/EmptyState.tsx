import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {icon ? <div className="text-ink-muted">{icon}</div> : null}
      <div className="space-y-1">
        <p className="text-sm font-medium text-ink-primary">{title}</p>
        {description ? <p className="text-sm text-ink-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
