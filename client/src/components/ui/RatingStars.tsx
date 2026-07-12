import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface RatingStarsProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md';
}

export function RatingStars({ value, max = 5, onChange, size = 'sm' }: RatingStarsProps) {
  const starSize = size === 'sm' ? 'size-3.5' : 'size-5';
  const interactive = Boolean(onChange);

  return (
    <div className="inline-flex items-center gap-0.5" role={interactive ? 'radiogroup' : undefined}>
      {Array.from({ length: max }, (_, index) => {
        const filled = index < value;
        const star = (
          <Star
            key={index}
            className={cn(starSize, filled ? 'fill-status-warning text-status-warning' : 'text-border-hairline')}
          />
        );

        if (!interactive) return star;

        return (
          <motion.button
            key={index}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Set confidence to ${index + 1}`}
            onClick={() => onChange?.(index + 1)}
            className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {star}
          </motion.button>
        );
      })}
    </div>
  );
}
