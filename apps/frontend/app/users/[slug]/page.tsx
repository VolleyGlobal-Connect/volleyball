"use client";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import users from '@/lib/users.json';
import { UserProfile } from '@/types/user';
import {
  Facebook,
  Linkedin,
  Globe,
  Heart,
  Menu,
  Youtube,
  Instagram,
  Twitter,
  X
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
console.log( Facebook, Twitter, Linkedin, Instagram, Youtube);


function OrganizationProfile({ organization }: { organization: UserProfile }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getYouTubeId = (url?: string) => {
  if (!url) return null;

  // Already an embed URL
  if (url.includes('/embed/')) {
    return url.split('/embed/')[1].split('?')[0];
  }

  // Short youtu.be URL
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split('?')[0];
  }

  // Standard watch URL
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
};


  const videoId = getYouTubeId(organization.ytVideo);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {children}
      </h2>
      <div className="mt-4 h-1 w-20 bg-brand-primary mx-auto rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-brand-primary hover:text-brand-secondary transition-colors">
              Volleyball
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('about')} className="font-medium text-gray-700 hover:text-brand-primary transition-colors">About</button>
              <button onClick={() => scrollToSection('what-we-do')} className="font-medium text-gray-700 hover:text-brand-primary transition-colors">What We Do</button>
              <button onClick={() => scrollToSection('founder')} className="font-medium text-gray-700 hover:text-brand-primary transition-colors">Our Founder</button>
              <Button className="bg-brand-primary hover:bg-orange-700 text-white" onClick={() => scrollToSection('support')}>
                <Heart className="w-4 h-4 mr-2" />
                Support Us
              </Button>
            </div>
            <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
              <button onClick={() => scrollToSection('about')} className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-primary hover:bg-gray-50">About</button>
              <button onClick={() => scrollToSection('what-we-do')} className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-primary hover:bg-gray-50">What We Do</button>
              <button onClick={() => scrollToSection('founder')} className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-primary hover:bg-gray-50">Our Founder</button>
              <Button className="bg-brand-primary hover:bg-orange-700 text-white w-full mt-2" onClick={() => scrollToSection('support')}><Heart className="w-4 h-4 mr-2" />Support Us</Button>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {videoId && (
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title="Organization video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
            </div>
          )}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{organization.name}</h1>
            <p className="text-lg text-gray-700 leading-relaxed">{organization.shortDescription}</p>
            <div className="flex flex-wrap gap-3">
              {organization.websiteUrl && <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-orange-50" onClick={() => window.open(organization.websiteUrl, '_blank')}><Globe className="w-4 h-4 mr-2" />Visit Website</Button>}
              {organization.social.facebook && <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => window.open(organization.social.facebook, '_blank')}><Facebook className="w-4 h-4 mr-2" />Facebook</Button>}
              {organization.social.linkedin && <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => window.open(organization.social.linkedin, '_blank')}><Linkedin className="w-4 h-4 mr-2" />LinkedIn</Button>}
              {organization.social.twitter && <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => window.open(organization.social.twitter, '_blank')}><Twitter className="w-4 h-4 mr-2" />Twitter</Button>}
              {organization.social.instagram && <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => window.open(organization.social.instagram, '_blank')}><Instagram className="w-4 h-4 mr-2" />Instagram</Button>}
              {organization.social.youtube && <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => window.open(organization.social.youtube, '_blank')}><Youtube className="w-4 h-4 mr-2" />Youtube</Button>}
            </div>
          </div>
        </div>
      </div>

      <div id="about" className="bg-gray-50 py-20"><div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"><SectionHeading>{organization.sections.ourMission.heading}</SectionHeading><div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">{organization.sections.ourMission.paragraphs?.map((p, index) => <p key={index}>{p}</p>)}</div></div></div>
      <div id="what-we-do" className="py-20"><div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"><SectionHeading>{organization.sections.whatWeDo.heading}</SectionHeading><div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">{organization.sections.whatWeDo.items?.map((item, index) => <p key={index}><strong className="text-brand-primary">{item.title}:</strong> {item.description}</p>)}</div></div></div>
      <div id="founder" className="bg-gradient-to-br from-orange-50 to-white py-20"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><SectionHeading>Meet Our Founder</SectionHeading><div className="grid md:grid-cols-2 gap-12 items-center"><div className="relative"><div className="aspect-square rounded-2xl overflow-hidden shadow-xl"><img src={organization.founder.imageUrl} alt={organization.founder.name} className="w-full h-full object-cover" /></div></div><div className="space-y-6"><div><h3 className="text-2xl font-bold text-gray-900">{organization.founder.name}</h3><p className="text-brand-primary font-medium">{organization.founder.title}</p></div><div className="prose prose-lg text-gray-700 leading-relaxed space-y-4">{organization.founder.bio.map((p, index) => <p key={index}>{p}</p>)}</div><Card className="p-6 bg-gradient-to-br from-brand-primary to-brand-primary border-0 shadow-lg"><blockquote className="text-white space-y-3"><p className="text-lg italic leading-relaxed">&quot;{organization.founder.quote.text}&quot;</p><footer className="text-orange-100">{organization.founder.quote.attribution}</footer></blockquote></Card></div></div></div></div>
      <div id="support" className="bg-white py-20 border-t border-gray-200"><div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><SectionHeading>{organization.sections.supportUs.heading}</SectionHeading><p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">{organization.sections.supportUs.description}</p><Button size="lg" className="bg-brand-primary hover:bg-orange-700 text-white"><Heart className="w-5 h-5 mr-2" />Make a Contribution</Button><p className="text-sm text-gray-500 mt-4">Secure payment via blockchain technology</p></div></div>
    </div>
  );
}

const UserPage = ({ params }: { params: { slug: string } }) => {
  const allUsers = users as UserProfile[];
  const user = allUsers.find(u => u.slug === params.slug);

  if (!user) {
    notFound();
  }

  return <OrganizationProfile organization={user} />;
};

export default UserPage;