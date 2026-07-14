import { Badge } from '@/components/ui/Badge';
import { tagTone } from '@/lib/utils/tagTone';

const TAGS = [
  'kubernetes', 'redis', 'postgres', 'aws', 'react', 'python', 'terraform', 'docker',
  'nginx', 'graphql', 'ci-cd', 'monitoring', 'spanish', 'guitar', 'writing',
];

/** A living strip of the exact tag vocabulary the app is built around — not stock icons. */
export function TagMarquee() {
  return (
    <div className="overflow-hidden border-y border-border-hairline bg-surface py-4">
      <div className="flex w-max gap-3 animate-marquee">
        {[...TAGS, ...TAGS].map((tag, index) => (
          <Badge key={`${tag}-${index}`} tone={tagTone(tag)} className="shrink-0 py-1.5 text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
