import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { ImageWithFallback } from '../lib/ImageWithFallback';
import { UserProfile, UserTag } from '../types/user';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ProfileCardProps {
  profile: UserProfile;
}

const tagStyles: Record<UserTag, { text: string; className: string }> = {
  CURATED: { text: 'Curated', className: 'bg-blue-500' },
  VERIFIED: { text: 'Verified', className: 'bg-green-500' },
  SELF_HOSTED: { text: 'Community', className: 'bg-gray-500' },
};

export function ProfileCard({ profile }: ProfileCardProps) {
  const tagInfo = tagStyles[profile.tag] || tagStyles['SELF_HOSTED'];

  return (
    <Card className="group relative flex flex-col overflow-hidden bg-white border-2 border-gray-200 hover:border-brand-primary transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      {/* Hero Image with Overlay */}
      <div className="relative h-60 overflow-hidden">
        <ImageWithFallback
          src={profile.imageUrl}
          alt={profile.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        {/* Tag */}
        <div className="absolute top-3 right-3">
            <Badge className={`${tagInfo.className} text-white border-0 flex items-center gap-1`}>
              {tagInfo.text}
            </Badge>
        </div>
        
        {/* Type Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-brand-primary text-white border-0 text-xs font-bold uppercase tracking-wide">
            {profile.type === 'org' ? 'Organization' : 'Individual'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 flex flex-col flex-1">
        {/* Name */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-secondary transition-colors h-14">
            {profile.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed h-20 overflow-hidden">
          {profile.shortDescription.slice(0, 150)}...
        </p>
        
        <div className="flex-grow" />

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-100">
          <Link href={`/users/${profile.slug}`} passHref>
            <Button className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold uppercase tracking-wide">
              Learn More
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}