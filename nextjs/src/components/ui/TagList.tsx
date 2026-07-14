import { tagTone } from '@/lib/utils/tagTone';
import { Badge } from './Badge';

interface TagListProps {
  tags: string[];
  max?: number;
}

export function TagList({ tags, max = 3 }: TagListProps) {
  if (tags.length === 0) return <span className="text-ink-muted">—</span>;

  const visible = tags.slice(0, max);
  const overflow = tags.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((tag) => (
        <Badge key={tag} tone={tagTone(tag)} className="px-2 py-0.5 text-[11px]">
          {tag}
        </Badge>
      ))}
      {overflow > 0 ? <span className="text-xs text-ink-muted">+{overflow}</span> : null}
    </div>
  );
}
