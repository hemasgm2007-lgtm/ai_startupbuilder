import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Testimonials } from '../components/landing/Testimonials';
import { Pricing } from '../components/landing/Pricing';
import { FAQ } from '../components/landing/FAQ';
import { Footer } from '../components/landing/Footer';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar onNavigate={onNavigate} onLogin={() => onNavigate('/login')} />
      <main>
        <Hero onGetStarted={() => onNavigate('/register')} onLogin={() => onNavigate('/login')} />
        <Features />
        <Testimonials />
        <Pricing onGetStarted={() => onNavigate('/register')} />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
