import { LandingNav } from './landing/LandingNav';
import { LandingHero } from './landing/LandingHero';
import { TagMarquee } from './landing/TagMarquee';
import { FeatureShowcase } from './landing/FeatureShowcase';
import { LandingClosing } from './landing/LandingClosing';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-page">
      <LandingNav />
      <LandingHero />
      <TagMarquee />
      <FeatureShowcase />
      <LandingClosing />
    </div>
  );
}
