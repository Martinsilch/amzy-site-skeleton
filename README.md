# Amzy Site Skeleton (Universal Tenant Template)

The universal Next.js 14 client template for home service operators (junk removal, hauling, and cleanout businesses) powered by the **Amzy Vertical AI Operating System**.

---

## Architecture Overview

```
                                      ┌───────────────────────────────────┐
                                      │         Amzy Hub Engine           │
                                      │ (OAuth Reviews + Field Telemetry) │
                                      └─────────────────┬─────────────────┘
                                                        │
                                                        ▼ POST /api/webhooks/amzy-job
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    Tenant Website (amzy-site-skeleton)                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│  • Next.js 14 App Router + Tailwind CSS                                         │
│  • Prisma ORM + Neon Serverless PostgreSQL                                      │
│  • Centralized site.config.ts (Parameterizes branding, phone, colors, market)   │
│  • Dynamic lib/geo-resolver.ts (Decoupled regional city & county resolver)      │
│  • Autonomous 200 OK Response (Returns canonicalUrl for social publishing)      │
│  • On-Demand Incremental Static Regeneration (ISR via revalidatePath)           │
│  • Schema.org JSON-LD Review & AggregateRating Structured Data                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Quick Setup & Local Development

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Provide your Neon PostgreSQL `DATABASE_URL` and `DISPATCH_WEBHOOK_SECRET`.

### 1.3 Apply Database Schema & Clean Seed
```bash
npx prisma db push
npx prisma db seed
```
> The seed script provisions regional `LocationSpoke` records and verifies a **clean slate (0 historical jobs)** ready for live Amzy webhook ingestion.

### 1.4 Start Dev Server
```bash
npm run dev
# Visit http://localhost:3000
```

---

## 2. Re-skinning & Parameterization

### Brand Configuration (`site.config.ts`)
Change brand name, contact info, accent colors, and market coverage in a single place:
```typescript
import siteConfig from './site.config';

// Injected variables:
// - siteConfig.name (e.g. "Seattle Green Hauling")
// - siteConfig.phone.display (e.g. "(206) 555-0199")
// - siteConfig.brandColor (e.g. "#D94F04")
// - siteConfig.marketRegion (e.g. "Greater Seattle & Eastside")
```

### Universal Geo-Resolver (`lib/geo-resolver.ts`)
Decoupled from hardcoded regional constraints. Supports any market via:
* `DEFAULT_MUNICIPALITIES`
* `TENANT_MUNICIPALITIES` JSON environment variable
* Runtime `resolveMunicipality(cityOrZip)` dynamic synthesis

---

## 3. Webhook Contract (`/api/webhooks/amzy-job`)

* **Endpoint:** `POST /api/webhooks/amzy-job`
* **Authentication:** `Authorization: Bearer <DISPATCH_WEBHOOK_SECRET>` or `x-webhook-secret: <SECRET>`
* **Autonomous Response (200 OK):**
```json
{
  "success": true,
  "action": "CREATED_NEW_JOB_STORY",
  "jobId": "cm8xxxxxxxxxx",
  "externalJobId": "amzy-98421",
  "canonicalSlug": "commercial-appliance-removal-federal-way-98421",
  "canonicalUrl": "/jobs/commercial-appliance-removal-federal-way-98421",
  "spokeSlug": "federal-way",
  "cityName": "Federal Way",
  "timestamp": "2026-10-06T21:44:00.000Z"
}
```

Amzy captures `canonicalUrl` from this response to link directly to the live case study when syndicating to Facebook, Instagram, and Google Business Profile.

---

## 4. Automated 60-Second Multi-Cloud Deployment

When launched via the **Amzy Developer Portal** (`SiteProvisioningTab`):
1. **GitHub API:** Clones `amzy-site-skeleton` into the tenant's repository.
2. **Neon API:** Spawns an isolated PostgreSQL database branch and runs Prisma migrations.
3. **Vercel API:** Deploys Next.js 14 project, binds custom domain, and injects tenant environment variables.
4. **Health Handshake:** Pings `POST /api/webhooks/amzy-job` to confirm immediate webhook readiness.
