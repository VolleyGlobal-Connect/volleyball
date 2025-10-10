"use client"

import usersData from '@/lib/users.json';
import { UserProfile } from '@/types/user';
import { useEffect, useState } from 'react';
import { ProfileCard } from './ProfileCard';
import { VolleyballIcon } from './VolleyballIcon';

export function ProfilesSection() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be a fetch call. Here, we're loading from a local JSON.
    setIsLoading(true);
    // The type assertion is safe here as we control the JSON structure.
    setProfiles(usersData as UserProfile[]);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profiles...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 transform rotate-12"><VolleyballIcon className="w-32 h-32 text-orange-500" /></div>
        <div className="absolute top-32 right-20 transform -rotate-12"><VolleyballIcon className="w-24 h-24 text-orange-500" /></div>
        <div className="absolute bottom-20 left-1/4 transform rotate-45"><VolleyballIcon className="w-20 h-20 text-orange-500" /></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full mb-4">
            <VolleyballIcon className="w-5 h-5" />
            <span className="font-bold uppercase tracking-wide text-sm">Our Community</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Support the Future of
            <span className="block text-orange-500 relative">
              Volleyball in India
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-orange-500 rounded-full"></div>
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Discover the organizations and individuals driving the volleyball revolution. Your support helps build champions and create opportunities.
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </section>
  );
}