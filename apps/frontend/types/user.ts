interface SocialLinks {
  facebook?: string;
  linkedin?: string;
}

interface FounderData {
  name: string;
  title: string;
  imageUrl: string;
  bio: string[];
  quote: {
    text: string;
    attribution: string;
  };
}

interface Section<T> {
  heading: string;
  items?: T[];
  paragraphs?: string[];
  description?: string;
}

export type UserTag = 'CURATED' | 'VERIFIED' | 'SELF_HOSTED';

export interface UserProfile {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  ytVideo: string;
  imageUrl: string;
  type: 'org' | 'individual';
  tag: UserTag;
  websiteUrl: string;
  social: SocialLinks;
  founder: FounderData;
  sections: {
    ourMission: Section<never>;
    whatWeDo: Section<{ title: string; description: string }>;
    supportUs: Section<never>;
  };
}