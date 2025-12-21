"use client"
import Hero from '@/components/Hero';
import { ProfilesSection } from '../components/ProfilesSection';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero 
        title="Support the Future of Volleyball in India."
        subtitle="Discover the organizations and individuals shaping the next generation of Indian volleyball."
        primaryCtaText="Support the Future"
        onPrimaryCtaClick={() => console.log("CTA clicked")}/>
      <ProfilesSection />
    </div>
  );
}