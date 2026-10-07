export interface SiteConfig {
  tenantId: string;
  name: string;
  tagline: string;
  description: string;
  domain: string;
  phone: {
    display: string;
    raw: string;
  };
  email: string;
  brandColor: string;
  secondaryColor: string;
  marketState: string;
  marketRegion: string;
  hubApiUrl: string;
  social: {
    facebook?: string;
    instagram?: string;
    googleBusiness?: string;
    yelp?: string;
  };
  equipment: {
    truckSize: string;
    features: string[];
  };
}

export const siteConfig: SiteConfig = {
  tenantId: process.env.TENANT_ID || 'amzy_tenant_default',
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Amzy Junk Removal Partner',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Eco-Friendly, High-Authority Junk Removal & Hauling',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Professional full-service junk removal with certified landfill diversion and verified proof-of-work telemetry.',
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'https://starter.amzy.app',
  phone: {
    display: process.env.NEXT_PUBLIC_PHONE_DISPLAY || '(253) 555-0192',
    raw: process.env.NEXT_PUBLIC_PHONE_RAW || '+12535550192',
  },
  email: process.env.NEXT_PUBLIC_EMAIL || 'dispatch@amzy.app',
  brandColor: process.env.NEXT_PUBLIC_BRAND_COLOR || '#D94F04',
  secondaryColor: '#1A1A1A',
  marketState: process.env.NEXT_PUBLIC_MARKET_STATE || 'WA',
  marketRegion: process.env.NEXT_PUBLIC_MARKET_REGION || 'Pacific Northwest',
  hubApiUrl: process.env.NEXT_PUBLIC_AMZY_HUB_URL || 'https://api.amzy.app',
  social: {
    facebook: process.env.NEXT_PUBLIC_FB_URL || '',
    instagram: process.env.NEXT_PUBLIC_IG_URL || '',
    googleBusiness: process.env.NEXT_PUBLIC_GBP_URL || '',
    yelp: process.env.NEXT_PUBLIC_YELP_URL || '',
  },
  equipment: {
    truckSize: '16-ft High-Wall Box Truck with Hydraulic Liftgate',
    features: ['Hydraulic Liftgate', 'Heavy Appliance Dolly', 'Electronic Scale Certification'],
  },
};

export default siteConfig;
