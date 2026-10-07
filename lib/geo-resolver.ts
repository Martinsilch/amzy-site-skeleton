export interface MunicipalityMeta {
  cityName: string;
  county: string;
  state?: string;
  zipCodes: string[];
  coords: [number, number];
  wikidataUri?: string;
}

// Default regional municipality catalog (customizable per tenant via site.config.ts / TENANT_MUNICIPALITIES)
export const DEFAULT_MUNICIPALITIES: Record<string, MunicipalityMeta> = {
  'federal-way': {
    cityName: 'Federal Way',
    county: 'King County',
    state: 'WA',
    zipCodes: ['98001', '98003', '98023', '98063', '98093'],
    coords: [47.3223, -122.3126],
    wikidataUri: 'https://www.wikidata.org/wiki/Q852586'
  },
  'auburn': {
    cityName: 'Auburn',
    county: 'King County',
    state: 'WA',
    zipCodes: ['98001', '98002', '98071', '98092'],
    coords: [47.3073, -122.2285],
    wikidataUri: 'https://www.wikidata.org/wiki/Q758414'
  },
  'kent': {
    cityName: 'Kent',
    county: 'King County',
    state: 'WA',
    zipCodes: ['98030', '98031', '98032', '98035', '98042', '98064'],
    coords: [47.3809, -122.2348],
    wikidataUri: 'https://www.wikidata.org/wiki/Q852579'
  },
  'tacoma': {
    cityName: 'Tacoma',
    county: 'Pierce County',
    state: 'WA',
    zipCodes: ['98402', '98403', '98404', '98405', '98406', '98407', '98408', '98409', '98416', '98418', '98421', '98422'],
    coords: [47.2529, -122.4443],
    wikidataUri: 'https://www.wikidata.org/wiki/Q202488'
  },
  'edgewood': {
    cityName: 'Edgewood',
    county: 'Pierce County',
    state: 'WA',
    zipCodes: ['98371', '98372'],
    coords: [47.2504, -122.2935],
    wikidataUri: 'https://www.wikidata.org/wiki/Q852583'
  },
  'des-moines': {
    cityName: 'Des Moines',
    county: 'King County',
    state: 'WA',
    zipCodes: ['98198'],
    coords: [47.4018, -122.3243],
    wikidataUri: 'https://www.wikidata.org/wiki/Q852581'
  },
  'milton': {
    cityName: 'Milton',
    county: 'Pierce County',
    state: 'WA',
    zipCodes: ['98354'],
    coords: [47.2498, -122.3168],
    wikidataUri: 'https://www.wikidata.org/wiki/Q1936495'
  },
  'pacific': {
    cityName: 'Pacific',
    county: 'King County',
    state: 'WA',
    zipCodes: ['98047'],
    coords: [47.2651, -122.2476],
    wikidataUri: 'https://www.wikidata.org/wiki/Q852599'
  },
  'puyallup': {
    cityName: 'Puyallup',
    county: 'Pierce County',
    state: 'WA',
    zipCodes: ['98371', '98372', '98373', '98374', '98375'],
    coords: [47.1854, -122.2929],
    wikidataUri: 'https://www.wikidata.org/wiki/Q852603'
  },
  'seattle': {
    cityName: 'Seattle',
    county: 'King County',
    state: 'WA',
    zipCodes: ['98101', '98102', '98103', '98104', '98105', '98108', '98118', '98144'],
    coords: [47.6062, -122.3321],
    wikidataUri: 'https://www.wikidata.org/wiki/Q5083'
  }
};

// Allow runtime tenant-level override via JSON env var or programmatic registration
let customMunicipalitiesRegistry: Record<string, MunicipalityMeta> = {};

try {
  if (process.env.TENANT_MUNICIPALITIES) {
    customMunicipalitiesRegistry = JSON.parse(process.env.TENANT_MUNICIPALITIES);
  }
} catch (e) {
  // Graceful fallback to default catalog
}

export const AUTHORIZED_MUNICIPALITIES: Record<string, MunicipalityMeta> = {
  ...DEFAULT_MUNICIPALITIES,
  ...customMunicipalitiesRegistry,
};

export function registerMunicipalities(newRegistry: Record<string, MunicipalityMeta>): void {
  Object.assign(AUTHORIZED_MUNICIPALITIES, newRegistry);
}

/**
 * Universal Geo-Resolver:
 * Resolves city, slug, or zip to MunicipalityMeta.
 * If not found in static registry, dynamically synthesizes valid metadata
 * so new customer websites never drop incoming telemetry from any market.
 */
export function resolveMunicipality(cityOrZip: string): MunicipalityMeta | null {
  if (!cityOrZip) return null;

  const normalized = cityOrZip.toLowerCase().trim().replace(/\s+/g, '-');
  if (AUTHORIZED_MUNICIPALITIES[normalized]) {
    return AUTHORIZED_MUNICIPALITIES[normalized];
  }

  for (const meta of Object.values(AUTHORIZED_MUNICIPALITIES)) {
    if (meta.cityName.toLowerCase() === cityOrZip.toLowerCase().trim()) {
      return meta;
    }
    if (meta.zipCodes.includes(cityOrZip.trim())) {
      return meta;
    }
  }

  // Dynamic fallback: Format capital case city name
  const formattedCityName = cityOrZip
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return {
    cityName: formattedCityName,
    county: process.env.NEXT_PUBLIC_MARKET_COUNTY || 'Service County',
    state: process.env.NEXT_PUBLIC_MARKET_STATE || 'WA',
    zipCodes: [cityOrZip],
    coords: [47.3223, -122.3126], // Default fallback coordinates
    wikidataUri: undefined
  };
}
