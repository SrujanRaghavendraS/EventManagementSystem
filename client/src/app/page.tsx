// pages/Home.js
import HeroSection from '@/app/(Components)/HeroSection';
import FeatureSection from '@/app/(Components)/FeatureSection';
import FooterSection from '@/app/(Components)/FooterSection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <HeroSection />
      <FeatureSection />
      <FooterSection />
    </div>
  );
}
