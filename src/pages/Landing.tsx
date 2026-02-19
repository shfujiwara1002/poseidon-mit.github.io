import { LandingPage } from '@/components/landing/LandingPage';

export default function Landing() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to main content
      </a>
      <main id="main-content" role="main">
        <LandingPage />
      </main>
    </>
  );
}
