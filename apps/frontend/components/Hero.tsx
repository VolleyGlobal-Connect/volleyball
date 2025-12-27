"use client";

import { Button } from "@/components/ui/button";
type HeroProps = {
  title: string;
  subtitle: string;
  primaryCtaText: string;
  onPrimaryCtaClick?: () => void;
};
const Hero = ({
  title,
  subtitle,
  primaryCtaText,
  onPrimaryCtaClick
}: HeroProps) => {
  return <section className="relative min-h-screen w-full overflow-hidden bg-background font-bricolage">
    
    {/* Top-left diagonal shape */}
    <div
      className="absolute top-0 left-0 h-[100%] w-[46%] -skew-x-50 origin-top-left"
      style={{
      background: "linear-gradient(135deg, #d97706 0%, #fbbf24 65%, #f2d35aff 100%)",
      }}
    />
    
    {/* Bottom-right diagonal shape */}
    <div
      className="absolute bottom-0 right-0 h-[100%] w-[50%] -skew-x-50 origin-bottom-right"
      style={{
        background: "linear-gradient(315deg, #d97706 0%, #fbbf24 65%, #f2d35aff 100%)",
      }}
    />


      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-around px-6 md:px-16 lg:px-24 py-6 ">
        {/* Logo */}
        <div className="flex flex-col leading-tight md:ml-[-330px] lg:ml-[-330px]">
          <span className="text-sm md:text-base font-semibold text-foreground">
            VolleyGlobal
          </span>
          <span className="text-sm md:text-base font-semibold text-foreground text-center">
            Connect
          </span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-8 md:gap-16 lg:gap-24">
          <a href="#" className="text-xs md:text-sm font-medium text-foreground uppercase tracking-wide hover:text-primary transition-colors">
            Home
          </a>
          <a href="#" className="text-xs md:text-sm font-medium text-foreground uppercase tracking-wide hover:text-primary transition-colors">
            Teams
          </a>
          <a href="#" className="text-xs md:text-sm font-medium text-foreground uppercase tracking-wide hover:text-primary transition-colors">
            Matches
          </a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-16 md:pt-24 lg:pt-32">
        <div className="max-w-12xl ">
          {/* Heading */}
          <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold leading-tight mt-10 mb-8 font-bricolage">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-3xl md:text-3xl lg:text-4xl text-muted-foreground max-w-4xl mb-24 mt-12 leading-relaxed font-bricolage">
            {subtitle}
          </p>

          {/* CTA Button */}
          <Button
            variant="default"
            size="lg"
            onClick={onPrimaryCtaClick}
            className="
              px-8 py-10
              text-3xl
              rounded-3xl
              mt-24
              mb-6
              bg-[#F2A11A]
              text-[#0f2a44]
              hover:bg-[#E09114]
              font-semibold
              shadow-sm
              font-bricolage
            "
          >
            {primaryCtaText}
          </Button>

          {/* Trust Indicators */}
          <p className="text-sm font-medium text-foreground color-#0f2a44 font-bricolage">
            Transparent funding • Verified partners • Secure payments
          </p>
        </div>
      </div>
    </section>;
};
export default Hero;