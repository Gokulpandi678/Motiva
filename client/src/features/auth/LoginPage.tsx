import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm"
      >
        <Card className="flex flex-col items-center gap-5 p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-accent-gradient text-accent-ink shadow-md shadow-accent-glow">
            <Sprout className="size-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-ink-primary">Welcome to Motiva</h1>
            <p className="mt-1.5 text-sm text-ink-muted">Sign in to track your tickets, learnings, and growth.</p>
          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              window.location.href = `${API_BASE_URL}/auth/login`;
            }}
          >
            Continue with WorkOS
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
