import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { themeAtom } from '@/atoms/theme';

export function useTheme() {
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggle = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return { theme, setTheme, toggle };
}
