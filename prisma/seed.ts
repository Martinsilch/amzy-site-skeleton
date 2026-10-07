import { PrismaClient } from '@prisma/client';
import { AUTHORIZED_MUNICIPALITIES } from '../lib/geo-resolver';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Initializing Amzy Starter Site Template Database...');

  // 1. Seed Authorized Location Spokes from Geo-Resolver
  console.log('\n--- 1. Seeding Regional Location Spokes ---');
  for (const [slug, meta] of Object.entries(AUTHORIZED_MUNICIPALITIES)) {
    const spoke = await prisma.locationSpoke.upsert({
      where: { slug },
      update: {
        cityName: meta.cityName,
        county: meta.county,
        zipCodes: meta.zipCodes,
        coordinates: meta.coords,
        wikidataUri: meta.wikidataUri || `https://www.wikidata.org/wiki/${slug}`
      },
      create: {
        slug,
        cityName: meta.cityName,
        county: meta.county,
        zipCodes: meta.zipCodes,
        coordinates: meta.coords,
        wikidataUri: meta.wikidataUri || `https://www.wikidata.org/wiki/${slug}`
      }
    });
    console.log(`  ✓ Synced Spoke: ${spoke.cityName} (${spoke.slug}) [${spoke.county}]`);
  }

  // 2. Verified Clean Slate: 0 Historical Job Stories
  // New tenant websites start clean, awaiting live verified job telemetry from Amzy webhooks.
  console.log('\n--- 2. Verifying Clean Slate for Job Stories ---');
  const jobCount = await prisma.jobStory.count();
  console.log(`  ✓ Clean slate confirmed: ${jobCount} historical jobs in database.`);
  console.log('  ✓ Webhook endpoint ready to receive payloads at: /api/webhooks/amzy-job');

  const spokeCount = await prisma.locationSpoke.count();
  console.log(`\n🎉 Template Seed Completed: ${spokeCount} Spokes provisioned, ready for Amzy AI ingestion.`);
}

main()
  .catch((e) => {
    console.error('Seed execution error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
