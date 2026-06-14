# RFSAM Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the RFSAM Foundation — the enriched control schema, the coverage map, a validated Astro site shell that renders the migrated content, and one fully-researched exemplar control — then stop for the author's review of the depth bar.

**Architecture:** Plain Astro + Content Collections (static, GitHub Pages at `rfsam.electroniccats.com`). `rfsam-data.js` is migrated once into per-control Markdown files via a script (guaranteeing faithful migration), then retired to `reference/`. A standalone Node validator enforces ID/layer and cross-reference invariants in CI alongside Astro's build-time zod schema. The four areas (Home / Methodology / Tools / Controls) plus a Roadmap and Resources page render from the collections and `src/data/` singletons. Review state (`stub`/`draft`/`verified` + `confidence`) is visible throughout.

**Tech Stack:** Astro 5 (Content Collections, `glob` loader, `astro/zod`), Node 20+ (ESM scripts, built-in `node:test`), `gray-matter` (frontmatter parse/stringify), GitHub Actions (official `withastro/action` + `actions/deploy-pages`).

**Hard rules for this repo (apply to every task):**
- **No attribution trace.** No mention of any AI/assistant anywhere — content, comments, commit messages, authors, PRs. Commit as `Electronic Cats <e@electroniccats.com>`. No `Co-Authored-By` trailer, no "Generated with" footer.
- **Nothing unproven.** Never write a technical claim (frequency, CVE, command, tool behavior, protocol detail) that cannot be cited. Uncertain or unverified claims get an inline `> [!FLAG] <claim — what to verify>`. This applies hardest to Task 23 (the exemplar) — research and cite, never fabricate.

---

## File structure

```
package.json                      scripts, deps
astro.config.mjs                  site, integrations
tsconfig.json                     strict TS for components
public/CNAME                      rfsam.electroniccats.com
src/
  content.config.ts               zod collections: controls / resources / tools
  content/
    controls/*.md                 26 migrated + _template.md
    resources/*.md                15 migrated
    tools/*.md                    10 migrated
  data/
    meta.js layers.js criticality.js bsam.js bsamRelation.js   (migrated)
    protocols.js                  authored (14 protocols)
    coverage-map.js               authored (target taxonomy)
  lib/
    taxonomy.js                   shared enums/helpers (layer/proto ids, ID regex)
  styles/global.css               EC palette + tokens + component styles
  layouts/
    BaseLayout.astro              top nav + footer
    DocsLayout.astro              sidebar + content (Controls section)
  components/
    Sidebar.astro Tags.astro ReviewBadge.astro Attacks.astro
    References.astro DefersToBsam.astro RelatedResources.astro
    Pager.astro LayerStrip.astro ProtocolCard.astro IqTrace.astro
  pages/
    index.astro methodology.astro tools.astro resources.astro
    roadmap.astro controls/[...slug].astro
scripts/
  migrate.mjs                     rfsam-data.js -> content + data files
  migrate.test.mjs                unit tests for the mapping
  validate.mjs                    cross-reference + ID invariants
  validate.test.mjs               unit tests for the checks
.github/workflows/
  validate.yml deploy.yml
reference/                        prototype-reference.html, rfsam-standalone.html, rfsam-data.js
README.md CONTRIBUTING.md LICENSE
```

Git is already initialized (branch `main`, committer `Electronic Cats <e@electroniccats.com>`). `CLAUDE.md` and `CLAUDE-CODE-PROMPT.md` are git-ignored and stay local.

---

## Part 0 — Project meta & hygiene

### Task 1: Repo hygiene — move provenance, remove duplicates

**Files:**
- Create: `reference/` (move targets in)
- Delete: `index.html`, `rfsam-data copy.js`

- [ ] **Step 1: Move provenance files and remove exact duplicates**

```bash
cd /Users/wero1414/RFSAM
mkdir -p reference
git mv rfsam-data.js reference/rfsam-data.js
git mv prototype-reference.html reference/prototype-reference.html
git mv rfsam-standalone.html reference/rfsam-standalone.html
git rm -f --ignore-unmatch index.html
rm -f "rfsam-data copy.js"   # untracked duplicate
```

- [ ] **Step 2: Verify the tree is clean**

Run: `git status --porcelain && ls reference/`
Expected: `index.html` gone; `reference/` holds `rfsam-data.js`, `prototype-reference.html`, `rfsam-standalone.html`; no `rfsam-data copy.js` anywhere.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Move source/prototype to reference/, drop duplicate files"
```

### Task 2: LICENSE (CC BY-SA 4.0)

**Files:**
- Create: `LICENSE`

- [ ] **Step 1: Fetch the canonical license text**

Run: `curl -fsSL https://creativecommons.org/licenses/by-sa/4.0/legalcode.txt -o LICENSE`
Expected: `LICENSE` contains the full "Creative Commons Attribution-ShareAlike 4.0 International" legal code.

- [ ] **Step 2: Verify it is the right license and not an error page**

Run: `head -3 LICENSE`
Expected: first lines reference "Creative Commons Attribution-ShareAlike 4.0 International". If `curl` failed, copy the text from https://creativecommons.org/licenses/by-sa/4.0/legalcode.txt manually instead.

- [ ] **Step 3: Commit**

```bash
git add LICENSE
git commit -m "Add CC BY-SA 4.0 license for methodology content"
```

---

## Part 1 — Astro scaffold

### Task 3: package.json and dependencies

**Files:**
- Create: `package.json`

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "rfsam",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "migrate": "node scripts/migrate.mjs",
    "validate": "node scripts/validate.mjs",
    "test": "node --test scripts/"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "gray-matter": "^4.0.3"
  }
}
```

- [ ] **Step 2: Install**

Run: `npm install`
Expected: `node_modules/` created, `package-lock.json` written, no error. (If `astro@^5` resolves to a newer major at install time, accept the latest 5.x.)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add package.json and install dependencies"
```

### Task 4: astro.config, tsconfig, CNAME

**Files:**
- Create: `astro.config.mjs`, `tsconfig.json`, `public/CNAME`

- [ ] **Step 1: Write `astro.config.mjs`** (custom domain → `site` set, no `base`)

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rfsam.electroniccats.com',
  // Custom domain at the apex: do NOT set `base`.
});
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 3: Write `public/CNAME`**

```
rfsam.electroniccats.com
```

- [ ] **Step 4: Verify Astro boots**

Run: `npm run build`
Expected: build succeeds (an empty site is fine — "0 page(s) built" or similar). No config errors.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs tsconfig.json public/CNAME
git commit -m "Configure Astro for GitHub Pages custom domain"
```

---

## Part 2 — Shared taxonomy & authored data

### Task 5: Shared taxonomy module

**Files:**
- Create: `src/lib/taxonomy.js`
- Test: `scripts/taxonomy.test.mjs`

This is the single source of truth for enums and the ID rule, imported by the schema, the validator, and the migrator.

- [ ] **Step 1: Write the failing test**

```js
// scripts/taxonomy.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LAYER_IDS, PROTOCOL_IDS, parseControlId } from '../src/lib/taxonomy.js';

test('layer and protocol id sets', () => {
  assert.deepEqual(LAYER_IDS, ['IG', 'SP', 'PHY', 'LL', 'CR', 'AT', 'AP']);
  assert.ok(PROTOCOL_IDS.includes('BLE'));
  assert.ok(PROTOCOL_IDS.includes('ZIGBEE'));
  assert.equal(PROTOCOL_IDS.length, 14);
});

test('parseControlId splits a valid id', () => {
  assert.deepEqual(parseControlId('RFSAM-BLE-CR-01'), { protocol: 'BLE', layer: 'CR', nn: '01' });
});

test('parseControlId rejects a malformed id', () => {
  assert.equal(parseControlId('RFSAM-BLE-XX-01'), null);
  assert.equal(parseControlId('BLE-CR-01'), null);
  assert.equal(parseControlId('RFSAM-BLE-CR-1'), null);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test scripts/taxonomy.test.mjs`
Expected: FAIL — cannot find module `../src/lib/taxonomy.js`.

- [ ] **Step 3: Write `src/lib/taxonomy.js`**

```js
export const LAYER_IDS = ['IG', 'SP', 'PHY', 'LL', 'CR', 'AT', 'AP'];

export const PROTOCOL_IDS = [
  'BLE', 'WIFI', 'LORA', 'LTE', 'RFID', 'SUBG',
  'ZIGBEE', 'ZWAVE', 'THREAD', 'GNSS', 'ADSB', 'NR5G', 'GSM', 'UWB',
];

export const CRITICALITY_IDS = ['info', 'low', 'medium', 'high', 'critical'];
export const REVIEW_STATUSES = ['stub', 'draft', 'verified'];
export const CONFIDENCE_LEVELS = ['low', 'medium', 'high'];

const ID_RE = new RegExp(
  `^RFSAM-(${PROTOCOL_IDS.join('|')})-(${LAYER_IDS.join('|')})-(\\d{2})$`,
);

export function parseControlId(id) {
  const m = ID_RE.exec(id);
  if (!m) return null;
  return { protocol: m[1], layer: m[2], nn: m[3] };
}
```

> [!FLAG] Protocol segment `NR5G` is used for 5G-NR because an ID segment starting with a digit (`5GNR`) is awkward in regex/filenames. Confirm this naming choice when the coverage map is reviewed.

- [ ] **Step 4: Run to verify it passes**

Run: `node --test scripts/taxonomy.test.mjs`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/taxonomy.js scripts/taxonomy.test.mjs
git commit -m "Add shared taxonomy: layer/protocol ids and control-id parser"
```

### Task 6: Authored protocols data (14)

**Files:**
- Create: `src/data/protocols.js`

Bands below are standard, published allocations. Where a band is region-dependent it is labeled as such.

- [ ] **Step 1: Write `src/data/protocols.js`**

```js
// Each protocol: id (matches the ID segment), name, band, prefix, status.
// `status: 'deepen'` = exists in the legacy corpus; `status: 'new'` = added for the full map.
export const protocols = [
  { id: 'BLE',    name: 'Bluetooth Low Energy', band: '2.400–2.480 GHz',                 prefix: 'RFSAM-BLE',    status: 'deepen' },
  { id: 'WIFI',   name: 'Wi-Fi (802.11)',       band: '2.4 / 5 / 6 GHz',                 prefix: 'RFSAM-WIFI',   status: 'deepen' },
  { id: 'LORA',   name: 'LoRa / LoRaWAN',        band: 'ISM sub-GHz (US915 / EU868)',     prefix: 'RFSAM-LORA',   status: 'deepen' },
  { id: 'LTE',    name: 'LTE / 4G',              band: 'Licensed cellular',               prefix: 'RFSAM-LTE',    status: 'deepen' },
  { id: 'RFID',   name: 'RFID / NFC',            band: '125 kHz LF / 13.56 MHz HF',       prefix: 'RFSAM-RFID',   status: 'deepen' },
  { id: 'SUBG',   name: 'Sub-GHz ISM / Remotes', band: '315 / 433 / 868 / 915 MHz',      prefix: 'RFSAM-SUBG',   status: 'deepen' },
  { id: 'ZIGBEE', name: 'Zigbee / 802.15.4',     band: '2.4 GHz (+ 868/915 MHz)',         prefix: 'RFSAM-ZIGBEE', status: 'new' },
  { id: 'ZWAVE',  name: 'Z-Wave',                band: 'Sub-GHz, region-specific (~868/908 MHz)', prefix: 'RFSAM-ZWAVE', status: 'new' },
  { id: 'THREAD', name: 'Thread / Matter',       band: '2.4 GHz (802.15.4)',              prefix: 'RFSAM-THREAD', status: 'new' },
  { id: 'GNSS',   name: 'GNSS / GPS',            band: 'L-band (e.g. GPS L1 1575.42 MHz)', prefix: 'RFSAM-GNSS',  status: 'new' },
  { id: 'ADSB',   name: 'ADS-B (aviation)',      band: '1090 MHz / 978 MHz UAT',          prefix: 'RFSAM-ADSB',   status: 'new' },
  { id: 'NR5G',   name: '5G NR',                 band: 'FR1 sub-6 GHz / FR2 mmWave',      prefix: 'RFSAM-NR5G',   status: 'new' },
  { id: 'GSM',    name: 'GSM / 2G',              band: '850 / 900 / 1800 / 1900 MHz',     prefix: 'RFSAM-GSM',    status: 'new' },
  { id: 'UWB',    name: 'Ultra-Wideband',        band: '3.1–10.6 GHz',                    prefix: 'RFSAM-UWB',    status: 'new' },
];
```

> [!FLAG] Z-Wave / GNSS / ADS-B / 5G / GSM / UWB band strings are standard allocations but region- and variant-dependent. Confirm exact phrasing during the author's review; do not present any of these as exhaustive.

- [ ] **Step 2: Verify it imports**

Run: `node -e "import('./src/data/protocols.js').then(m=>console.log(m.protocols.length))"`
Expected: `14`.

- [ ] **Step 3: Commit**

```bash
git add src/data/protocols.js
git commit -m "Add 14-protocol taxonomy (6 to deepen + 8 new)"
```

### Task 7: Authored coverage map

**Files:**
- Create: `src/data/coverage-map.js`

The map enumerates *target* controls. Existing protocols list their real controls (filled by the migrator's id list, transcribed here as `existing`). New protocols list **proposed** controls as scope statements — explicitly the author's to trim. No proposed objective asserts an unverified technical fact; each is phrased as an assessment goal to be researched when written.

- [ ] **Step 1: Write `src/data/coverage-map.js`**

```js
// status: 'existing' = a control file exists today; 'planned' = proposed scope, unwritten.
// Objectives for 'planned' entries are scope statements to be researched & cited on authoring.
export const coverageMap = [
  { protocol: 'BLE', controls: [
    { id: 'RFSAM-BLE-IG-01',  title: 'Known vulnerabilities of the SoC and host stack', layer: 'IG',  status: 'existing' },
    { id: 'RFSAM-BLE-SP-01',  title: 'Channel map and capture feasibility',             layer: 'SP',  status: 'existing' },
    { id: 'RFSAM-BLE-PHY-01', title: 'Demodulation and bit recovery',                   layer: 'PHY', status: 'existing' },
    { id: 'RFSAM-BLE-LL-01',  title: 'Advertising and identifier exposure',             layer: 'LL',  status: 'existing' },
    { id: 'RFSAM-BLE-LL-02',  title: 'Connection-data capture',                         layer: 'LL',  status: 'existing' },
    { id: 'RFSAM-BLE-CR-01',  title: 'Pairing and encryption assessment',               layer: 'CR',  status: 'existing' },
    { id: 'RFSAM-BLE-AT-01',  title: 'Hijack a live BLE connection',                    layer: 'AT',  status: 'existing' },
  ]},
  { protocol: 'WIFI', controls: [
    { id: 'RFSAM-WIFI-SP-01', title: 'Band and channel survey',         layer: 'SP', status: 'existing' },
    { id: 'RFSAM-WIFI-LL-01', title: 'Management-frame exposure',       layer: 'LL', status: 'existing' },
    { id: 'RFSAM-WIFI-CR-01', title: 'WPA handshake / PMKID assessment', layer: 'CR', status: 'existing' },
  ]},
  { protocol: 'LORA', controls: [
    { id: 'RFSAM-LORA-SP-01',  title: 'Sub-band occupancy and capture', layer: 'SP',  status: 'existing' },
    { id: 'RFSAM-LORA-PHY-01', title: 'Chirp demodulation',            layer: 'PHY', status: 'existing' },
    { id: 'RFSAM-LORA-LL-01',  title: 'LoRaWAN frame profiling',       layer: 'LL',  status: 'existing' },
    { id: 'RFSAM-LORA-CR-01',  title: 'Join and session-key assessment', layer: 'CR', status: 'existing' },
  ]},
  { protocol: 'LTE', controls: [
    { id: 'RFSAM-LTE-IG-01',  title: 'Baseband and modem vulnerabilities', layer: 'IG',  status: 'existing' },
    { id: 'RFSAM-LTE-SP-01',  title: 'Cell identification and capture',    layer: 'SP',  status: 'existing' },
    { id: 'RFSAM-LTE-PHY-01', title: 'Resource-grid recovery',            layer: 'PHY', status: 'existing' },
    { id: 'RFSAM-LTE-LL-01',  title: 'Control-channel / identity exposure', layer: 'LL', status: 'existing' },
  ]},
  { protocol: 'RFID', controls: [
    { id: 'RFSAM-RFID-SP-01', title: 'Carrier and standard identification', layer: 'SP', status: 'existing' },
    { id: 'RFSAM-RFID-CR-01', title: 'Crypto1 / key-strength assessment',  layer: 'CR', status: 'existing' },
    { id: 'RFSAM-RFID-AT-01', title: 'Clone, emulate and relay',           layer: 'AT', status: 'existing' },
  ]},
  { protocol: 'SUBG', controls: [
    { id: 'RFSAM-SUBG-SP-01',  title: 'Burst discovery and characterisation', layer: 'SP',  status: 'existing' },
    { id: 'RFSAM-SUBG-PHY-01', title: 'Demodulation and framing',           layer: 'PHY', status: 'existing' },
    { id: 'RFSAM-SUBG-LL-01',  title: 'Frame and addressing recovery',      layer: 'LL',  status: 'existing' },
    { id: 'RFSAM-SUBG-CR-01',  title: 'Rolling-code assessment',            layer: 'CR',  status: 'existing' },
    { id: 'RFSAM-SUBG-AT-01',  title: 'Replay and forge',                   layer: 'AT',  status: 'existing' },
  ]},
  // ---- proposed new protocols (author to trim) ----
  { protocol: 'ZIGBEE', controls: [
    { id: 'RFSAM-ZIGBEE-SP-01', title: 'Channel survey and capture feasibility', layer: 'SP', status: 'planned', objective: 'Assess which 802.15.4 channels carry the target PAN and whether they can be observed.' },
    { id: 'RFSAM-ZIGBEE-LL-01', title: 'PAN, addressing and device discovery',   layer: 'LL', status: 'planned', objective: 'Assess what network topology and identifiers are exposed passively.' },
    { id: 'RFSAM-ZIGBEE-CR-01', title: 'Network-key provisioning and rotation',  layer: 'CR', status: 'planned', objective: 'Assess how the network key is established, transported, and rotated.' },
  ]},
  { protocol: 'ZWAVE',  controls: [
    { id: 'RFSAM-ZWAVE-SP-01', title: 'Region/frequency identification', layer: 'SP', status: 'planned', objective: 'Assess the regional frequency in use and capture feasibility.' },
    { id: 'RFSAM-ZWAVE-CR-01', title: 'Key establishment assessment',    layer: 'CR', status: 'planned', objective: 'Assess the security class and key-establishment scheme in use.' },
  ]},
  { protocol: 'THREAD', controls: [
    { id: 'RFSAM-THREAD-LL-01', title: 'Mesh discovery and commissioning exposure', layer: 'LL', status: 'planned', objective: 'Assess what commissioning and mesh-topology data is exposed.' },
    { id: 'RFSAM-THREAD-CR-01', title: 'Network credential assessment',            layer: 'CR', status: 'planned', objective: 'Assess how mesh credentials are provisioned and protected.' },
  ]},
  { protocol: 'GNSS',   controls: [
    { id: 'RFSAM-GNSS-SP-01', title: 'Signal presence and interference survey', layer: 'SP', status: 'planned', objective: 'Assess received GNSS signal conditions and presence of interference.' },
    { id: 'RFSAM-GNSS-AT-01', title: 'Spoofing and jamming resilience',         layer: 'AT', status: 'planned', objective: 'Assess receiver resilience to spoofed or jammed GNSS signals (authorised testing only).' },
  ]},
  { protocol: 'ADSB',   controls: [
    { id: 'RFSAM-ADSB-PHY-01', title: 'Message capture and decode',     layer: 'PHY', status: 'planned', objective: 'Assess capture and decoding of ADS-B messages.' },
    { id: 'RFSAM-ADSB-LL-01',  title: 'Message authenticity assessment', layer: 'LL', status: 'planned', objective: 'Assess what authenticity guarantees, if any, the link provides.' },
  ]},
  { protocol: 'NR5G',   controls: [
    { id: 'RFSAM-NR5G-SP-01', title: 'Cell identification and capture', layer: 'SP', status: 'planned', objective: 'Assess identification and capture of the target 5G NR cell.' },
    { id: 'RFSAM-NR5G-LL-01', title: 'Broadcast / identity exposure',   layer: 'LL', status: 'planned', objective: 'Assess identity and configuration data exposed on broadcast channels.' },
  ]},
  { protocol: 'GSM',    controls: [
    { id: 'RFSAM-GSM-SP-01', title: 'ARFCN survey and capture',     layer: 'SP', status: 'planned', objective: 'Assess identification and capture of GSM carriers.' },
    { id: 'RFSAM-GSM-CR-01', title: 'Cipher and identity exposure', layer: 'CR', status: 'planned', objective: 'Assess ciphering negotiation and identity exposure.' },
  ]},
  { protocol: 'UWB',    controls: [
    { id: 'RFSAM-UWB-PHY-01', title: 'Ranging signal capture',         layer: 'PHY', status: 'planned', objective: 'Assess capture and characterisation of UWB ranging exchanges.' },
    { id: 'RFSAM-UWB-AT-01',  title: 'Distance-manipulation resilience', layer: 'AT', status: 'planned', objective: 'Assess resilience to relay/distance-manipulation against the ranging scheme (authorised testing only).' },
  ]},
];
```

> [!FLAG] Every `existing` title above is transcribed from the legacy corpus for the roadmap; Task 22 cross-checks them against the actual migrated control files and fails if any id/title drifts. All `planned` entries are proposed scope only.

- [ ] **Step 2: Verify import and id format**

Run:
```bash
node -e "import('./src/data/coverage-map.js').then(async m=>{const {parseControlId}=await import('./src/lib/taxonomy.js');const bad=m.coverageMap.flatMap(p=>p.controls).filter(c=>!parseControlId(c.id));console.log('bad ids:',bad.map(c=>c.id))})"
```
Expected: `bad ids: []`.

- [ ] **Step 3: Commit**

```bash
git add src/data/coverage-map.js
git commit -m "Add coverage map: existing controls + proposed new-protocol scope"
```

---

## Part 3 — Content schema

### Task 8: Content collections schema

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Write `src/content.config.ts`**

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  LAYER_IDS, PROTOCOL_IDS, CRITICALITY_IDS, REVIEW_STATUSES, CONFIDENCE_LEVELS,
} from './lib/taxonomy.js';

const layer = z.enum(LAYER_IDS as [string, ...string[]]);
const protocol = z.enum(PROTOCOL_IDS as [string, ...string[]]);

const reference = z.object({
  key: z.string(),
  title: z.string(),
  authors: z.string().optional(),
  venue: z.string().optional(),
  year: z.number().int().optional(),
  url: z.string().url(),
  type: z.enum(['paper', 'cve', 'talk', 'spec', 'standard', 'tool', 'blog']),
});

const attack = z.object({
  name: z.string(),
  cve: z.array(z.string()).optional(),
  refs: z.array(z.string()).default([]),   // keys into references[]
  note: z.string().optional(),             // freeform citation (legacy/quick)
  impact: z.string().optional(),
  preconditions: z.string().optional(),
  summary: z.string(),
});

const controls = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/controls' }),
  schema: z.object({
    id: z.string().regex(/^RFSAM-[A-Z0-9]+-[A-Z]+-\d{2}$/),
    title: z.string().min(1),
    protocol,
    layer,
    criticality: z.enum(CRITICALITY_IDS as [string, ...string[]]),
    applicability: z.array(z.string()).default([]),
    deferred: z.boolean().default(false),
    objective: z.string().optional(),
    intro: z.string().optional(),
    prerequisites: z.object({
      hardware: z.array(z.string()).default([]),
      software: z.array(z.string()).default([]),
      signal: z.object({
        freq: z.string().optional(),
        bandwidth: z.string().optional(),
        modulation: z.string().optional(),
      }).optional(),
      skill: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    }).optional(),
    attacks: z.array(attack).default([]),
    references: z.array(reference).default([]),
    tools: z.array(z.string()).default([]),
    bsam: z.array(z.string()).default([]),
    resources: z.array(z.string()).default([]),
    reviewStatus: z.enum(REVIEW_STATUSES as [string, ...string[]]).default('stub'),
    confidence: z.enum(CONFIDENCE_LEVELS as [string, ...string[]]).default('low'),
    lastResearched: z.coerce.date().optional(),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({ id: z.string(), title: z.string() }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    name: z.string(),
    vendor: z.string(),
    ec: z.boolean().default(false),
    protocols: z.array(z.string()).default([]),
    note: z.string(),
  }),
});

export const collections = { controls, resources, tools };
```

Note: the schema's `id` regex is intentionally loose (`[A-Z0-9]+` for the protocol segment); the strict protocol/layer-segment-vs-field match is enforced by `validate.mjs` (Task 18), which can produce a clearer error than a zod regex.

- [ ] **Step 2: Verify it type-checks against an empty collection**

Run: `npm run build`
Expected: build succeeds (collections empty until migration). If Astro reports the content config is invalid, fix before proceeding.

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "Add content-collection schemas for controls, resources, tools"
```

---

## Part 4 — Migration

### Task 9: Migration mapping (pure functions, TDD)

**Files:**
- Create: `scripts/migrate.mjs` (mapping functions only this task)
- Test: `scripts/migrate.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// scripts/migrate.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { controlToFile, toolSlug } from './migrate.mjs';

const legacy = {
  id: 'RFSAM-BLE-AT-01', protocol: 'BLE', layer: 'AT', criticality: 'high',
  title: 'Hijack a live BLE connection', applicability: ['BLE'],
  intro: 'Intro text.', description: 'Description text.',
  procedure: ['First step.', 'Second `cmd` step.'],
  attacks: [{ name: 'BTLEJack', ref: 'Cauquil 2018', what: 'Follows and hijacks.' }],
  resources: ['RFSAM-RES-06'], example: 'A `cur_aa` war story.',
  remediation: 'Fix it.',
};

test('controlToFile maps frontmatter and body faithfully', () => {
  const { frontmatter, body } = controlToFile(legacy);
  assert.equal(frontmatter.id, 'RFSAM-BLE-AT-01');
  assert.equal(frontmatter.reviewStatus, 'stub');
  assert.equal(frontmatter.confidence, 'low');
  assert.equal(frontmatter.intro, 'Intro text.');
  // legacy attack ref preserved as note; refs empty so validator stays green
  assert.equal(frontmatter.attacks[0].note, 'Cauquil 2018');
  assert.deepEqual(frontmatter.attacks[0].refs, []);
  assert.equal(frontmatter.attacks[0].summary, 'Follows and hijacks.');
  // prose goes to the body verbatim under fixed headings
  assert.match(body, /## Mechanism\n\nDescription text\./);
  assert.match(body, /## Procedure\n\n1\. First step\.\n2\. Second `cmd` step\./);
  assert.match(body, /## Field case\n\nA `cur_aa` war story\./);
  assert.match(body, /## Remediation\n\nFix it\./);
});

test('toolSlug slugifies names', () => {
  assert.equal(toolSlug('YARD Stick One'), 'yard-stick-one');
  assert.equal(toolSlug('Universal Radio Hacker'), 'universal-radio-hacker');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test scripts/migrate.test.mjs`
Expected: FAIL — cannot import from `./migrate.mjs`.

- [ ] **Step 3: Write the mapping section of `scripts/migrate.mjs`**

```js
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

export function toolSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function controlToFile(c) {
  const frontmatter = {
    id: c.id,
    title: c.title,
    protocol: c.protocol,
    layer: c.layer,
    criticality: c.criticality,
    applicability: c.applicability ?? [],
    ...(c.deferred ? { deferred: true } : {}),
    ...(c.intro ? { intro: c.intro } : {}),
    attacks: (c.attacks ?? []).map((a) => ({
      name: a.name,
      refs: [],
      ...(a.ref ? { note: a.ref } : {}),
      summary: a.what ?? '',
    })),
    references: [],
    ...(c.bsam ? { bsam: c.bsam } : {}),
    ...(c.resources ? { resources: c.resources } : {}),
    reviewStatus: 'stub',
    confidence: 'low',
  };

  const sections = [];
  if (c.description) sections.push(`## Mechanism\n\n${c.description}`);
  if (c.procedure?.length) {
    const steps = c.procedure.map((s, i) => `${i + 1}. ${s}`).join('\n');
    sections.push(`## Procedure\n\n${steps}`);
  }
  if (c.example) sections.push(`## Field case\n\n${c.example}`);
  if (c.remediation) sections.push(`## Remediation\n\n${c.remediation}`);
  const body = sections.join('\n\n') + '\n';

  return { frontmatter, body };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `node --test scripts/migrate.test.mjs`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate.mjs scripts/migrate.test.mjs
git commit -m "Add migration mapping for legacy controls and tool slugs"
```

### Task 10: Migration runner (loads legacy data, writes all files)

**Files:**
- Modify: `scripts/migrate.mjs` (append loader + writers + CLI)

- [ ] **Step 1: Append the loader and writers to `scripts/migrate.mjs`**

```js
// ---- legacy loader ----
export function loadLegacy(path = 'reference/rfsam-data.js') {
  const text = readFileSync(path, 'utf8');
  // The file is `const RFSAM = { ... };` with no export; evaluate and return it.
  const fn = new Function(`${text}\n;return RFSAM;`);
  return fn();
}

function writeData(dir, name, exportName, value) {
  const out = `export const ${exportName} = ${JSON.stringify(value, null, 2)};\n`;
  writeFileSync(join(dir, name), out);
}

export function runMigration() {
  const R = loadLegacy();
  const cDir = 'src/content/controls';
  const rDir = 'src/content/resources';
  const tDir = 'src/content/tools';
  const dDir = 'src/data';
  for (const d of [cDir, rDir, tDir, dDir]) {
    if (existsSync(d)) rmSync(d, { recursive: true, force: true });
    mkdirSync(d, { recursive: true });
  }

  for (const c of R.controls) {
    const { frontmatter, body } = controlToFile(c);
    writeFileSync(join(cDir, `${c.id.toLowerCase()}.md`), matter.stringify(body, frontmatter));
  }
  for (const r of R.resources) {
    writeFileSync(join(rDir, `${r.id.toLowerCase()}.md`),
      matter.stringify(`${r.body}\n`, { id: r.id, title: r.title }));
  }
  for (const t of R.tools) {
    writeFileSync(join(tDir, `${toolSlug(t.name)}.md`),
      matter.stringify(`${t.note}\n`,
        { name: t.name, vendor: t.vendor, ec: !!t.ec, protocols: t.protocols ?? [], note: t.note }));
  }

  // singletons (protocols.js and coverage-map.js are authored, not generated)
  writeData(dDir, 'meta.js', 'meta', R.meta);
  writeData(dDir, 'layers.js', 'layers', R.layers);
  writeData(dDir, 'criticality.js', 'criticality', R.criticality);
  writeData(dDir, 'bsam.js', 'bsam', R.bsam);
  writeData(dDir, 'bsamRelation.js', 'bsamRelation', R.bsamRelation);

  return {
    controls: R.controls.length, resources: R.resources.length, tools: R.tools.length,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const counts = runMigration();
  console.log(`Migrated ${counts.controls} controls, ${counts.resources} resources, ${counts.tools} tools.`);
}
```

> [!FLAG] `runMigration` deletes and regenerates `src/data/` — but `protocols.js` and `coverage-map.js` are authored by hand (Tasks 6–7). The writer above only emits `meta/layers/criticality/bsam/bsamRelation`, so the authored files survive **only if** they live in `src/data/` and are not overwritten. Because the runner `rmSync`s `src/data`, the authored files WOULD be deleted. Step 2 fixes the order: author files are re-created after migration. Confirm this sequencing holds.

- [ ] **Step 2: Make migration safe for authored data**

Change the loop so it does **not** wipe `src/data`; instead only remove the three content dirs, and `mkdir -p src/data` without deleting:

```js
  for (const d of [cDir, rDir, tDir]) {
    if (existsSync(d)) rmSync(d, { recursive: true, force: true });
    mkdirSync(d, { recursive: true });
  }
  mkdirSync(dDir, { recursive: true });
```

- [ ] **Step 3: Run the migration**

Run: `npm run migrate`
Expected: `Migrated 26 controls, 15 resources, 10 tools.`

- [ ] **Step 4: Verify counts and faithfulness of a load-bearing string**

Run:
```bash
ls src/content/controls/*.md | wc -l        # 26
ls src/content/resources/*.md | wc -l        # 15
ls src/content/tools/*.md | wc -l            # 10
grep -rl 'cur_aa' src/content/controls/ || echo 'MISSING cur_aa'
grep -rl '\[FILL' src/content/controls/      # the LoRa field-case note must survive
```
Expected: counts 26 / 15 / 10; `cur_aa` found; `[FILL` found in `rfsam-lora-cr-01.md`.

- [ ] **Step 5: Build to confirm the schema accepts every migrated file**

Run: `npm run build`
Expected: build succeeds; no zod content errors. (Pages render in later tasks; here we only need the collections to validate.)

- [ ] **Step 6: Commit**

```bash
git add scripts/migrate.mjs src/content src/data
git commit -m "Migrate legacy corpus into content collections and data singletons"
```

### Task 11: Control template for contributors

**Files:**
- Create: `src/content/controls/_template.md`

- [ ] **Step 1: Write `_template.md`** (the loader ignores `_`-prefixed files via the `[^_]` glob)

```md
---
id: RFSAM-PROTO-LAYER-NN          # e.g. RFSAM-ZIGBEE-CR-01; segments must match protocol+layer below
title: Short imperative title
protocol: ZIGBEE                   # one of the protocol ids
layer: CR                          # IG | SP | PHY | LL | CR | AT | AP
criticality: medium                # info | low | medium | high | critical
applicability: ["Zigbee"]
deferred: false
objective: The one testable thing this control verifies.
intro: One- or two-sentence callout shown above the body.
prerequisites:
  hardware: ["..."]
  software: ["..."]
  signal: { freq: "...", bandwidth: "...", modulation: "..." }
  skill: intermediate              # beginner | intermediate | advanced
attacks:
  - name: Example attack
    cve: ["CVE-YYYY-NNNNN"]
    refs: ["smith2024"]            # keys that MUST exist in references below
    impact: What it lets an attacker do.
    preconditions: What must be true first.
    summary: One-line description.
references:
  - key: smith2024
    title: Paper or advisory title
    authors: A. Smith et al.
    venue: Conference / journal / vendor
    year: 2024
    url: https://example.org/source
    type: paper                    # paper | cve | talk | spec | standard | tool | blog
tools: ["proxmark3"]               # slugs from the tools collection
bsam: []                           # BSAM registry ids, if deferring
resources: []                      # RFSAM-RES-NN ids
reviewStatus: draft                # stub | draft | verified
confidence: medium                 # low | medium | high
lastResearched: 2026-01-01
---

## Mechanism

How the RF/protocol works and why this control matters. Every nontrivial claim
cites a `references[]` entry. Mark anything unverified with:

> [!FLAG] claim — what still needs to be checked

## Procedure

1. Step with a real command:
   ```bash
   tool --flag value
   ```
   Expected output and how to read it.

## Field case

A worked example with real data. Preserve command strings verbatim.

## Remediation

Specific, layered guidance (developer / integrator / operator).
```

- [ ] **Step 2: Confirm the template is excluded from the collection**

Run: `npm run build`
Expected: build succeeds; no schema error from `_template.md` (the `[^_]` glob skips it).

- [ ] **Step 3: Commit**

```bash
git add src/content/controls/_template.md
git commit -m "Add contributor control template"
```

---

## Part 5 — Validation

### Task 12: Validator checks (pure functions, TDD)

**Files:**
- Create: `scripts/validate.mjs` (pure check functions this task)
- Test: `scripts/validate.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// scripts/validate.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkControl } from './validate.mjs';

const registries = {
  bsamKeys: new Set(['BSAM-EN-01']),
  resourceIds: new Set(['RFSAM-RES-06']),
  toolSlugs: new Set(['btlejack']),
};

function base(overrides = {}) {
  return {
    data: {
      id: 'RFSAM-BLE-AT-01', protocol: 'BLE', layer: 'AT', criticality: 'high',
      title: 'Hijack', reviewStatus: 'stub', confidence: 'low',
      attacks: [], references: [], bsam: [], resources: [], tools: [],
      ...overrides.data,
    },
    body: overrides.body ?? '## Mechanism\n\nx\n',
    file: 'rfsam-ble-at-01.md',
  };
}

test('a clean stub passes', () => {
  assert.deepEqual(checkControl(base(), registries), []);
});

test('id layer/protocol segment must match fields', () => {
  const errs = checkControl(base({ data: { layer: 'CR' } }), registries);
  assert.ok(errs.some((e) => /layer segment/i.test(e)));
});

test('attack refs must exist in references', () => {
  const errs = checkControl(base({ data: { attacks: [{ name: 'x', refs: ['ghost'], summary: 's' }] } }), registries);
  assert.ok(errs.some((e) => /unknown reference key 'ghost'/i.test(e)));
});

test('bsam, resource and tool refs must resolve', () => {
  const errs = checkControl(base({ data: { bsam: ['BSAM-XX-99'], resources: ['RFSAM-RES-99'], tools: ['ghosttool'] } }), registries);
  assert.equal(errs.filter((e) => /unknown/i.test(e)).length, 3);
});

test('verified controls need objective, a reference and zero open flags', () => {
  const errs = checkControl(base({
    data: { reviewStatus: 'verified', references: [] },
    body: '## Mechanism\n\n> [!FLAG] unsure\n',
  }), registries);
  assert.ok(errs.some((e) => /objective/i.test(e)));
  assert.ok(errs.some((e) => /at least one reference/i.test(e)));
  assert.ok(errs.some((e) => /unresolved \[!FLAG\]/i.test(e)));
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test scripts/validate.test.mjs`
Expected: FAIL — cannot import `checkControl`.

- [ ] **Step 3: Write the check functions in `scripts/validate.mjs`**

```js
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { parseControlId, CRITICALITY_IDS } from '../src/lib/taxonomy.js';

export function checkControl({ data, body, file }, reg) {
  const errs = [];
  const tag = `${file}: `;
  const parsed = parseControlId(data.id);
  if (!parsed) {
    errs.push(`${tag}id '${data.id}' is not a valid RFSAM-<PROTO>-<LAYER>-<NN>`);
  } else {
    if (parsed.protocol !== data.protocol) errs.push(`${tag}id protocol segment '${parsed.protocol}' != protocol field '${data.protocol}'`);
    if (parsed.layer !== data.layer) errs.push(`${tag}id layer segment '${parsed.layer}' != layer field '${data.layer}'`);
  }
  if (!CRITICALITY_IDS.includes(data.criticality)) errs.push(`${tag}invalid criticality '${data.criticality}'`);
  if (!data.title?.trim()) errs.push(`${tag}empty title`);

  const refKeys = new Set((data.references ?? []).map((r) => r.key));
  for (const a of data.attacks ?? []) {
    for (const k of a.refs ?? []) {
      if (!refKeys.has(k)) errs.push(`${tag}attack '${a.name}' cites unknown reference key '${k}'`);
    }
  }
  for (const b of data.bsam ?? []) if (!reg.bsamKeys.has(b)) errs.push(`${tag}unknown BSAM id '${b}'`);
  for (const r of data.resources ?? []) if (!reg.resourceIds.has(r)) errs.push(`${tag}unknown resource id '${r}'`);
  for (const t of data.tools ?? []) if (!reg.toolSlugs.has(t)) errs.push(`${tag}unknown tool slug '${t}'`);

  if (data.reviewStatus === 'draft' || data.reviewStatus === 'verified') {
    if (!data.objective?.trim()) errs.push(`${tag}${data.reviewStatus} control needs a non-empty objective`);
  }
  if (data.reviewStatus === 'verified') {
    if (!(data.references ?? []).length) errs.push(`${tag}verified control needs at least one reference`);
    if (/\[!FLAG\]/.test(body)) errs.push(`${tag}verified control has unresolved [!FLAG] markers`);
  }
  return errs;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `node --test scripts/validate.test.mjs`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/validate.mjs scripts/validate.test.mjs
git commit -m "Add control validation checks with unit tests"
```

### Task 13: Validator CLI (loads registries, scans all controls)

**Files:**
- Modify: `scripts/validate.mjs` (append loader + CLI)

- [ ] **Step 1: Append the registry loader and CLI to `scripts/validate.mjs`**

```js
function idsFromDir(dir, field) {
  const out = new Set();
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const { data } = matter(readFileSync(join(dir, f), 'utf8'));
    out.add(field ? data[field] : f.replace(/\.md$/, ''));
  }
  return out;
}

export async function loadRegistries() {
  const { bsam } = await import('../src/data/bsam.js');
  return {
    bsamKeys: new Set(Object.keys(bsam)),
    resourceIds: idsFromDir('src/content/resources', 'id'),
    toolSlugs: idsFromDir('src/content/tools', null),
  };
}

export async function runValidation() {
  const reg = await loadRegistries();
  const dir = 'src/content/controls';
  const files = readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
  const all = [];
  for (const f of files) {
    const { data, content } = matter(readFileSync(join(dir, f), 'utf8'));
    all.push(...checkControl({ data, body: content, file: f }, reg));
  }
  return all;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const errs = await runValidation();
  if (errs.length) {
    console.error(`✖ ${errs.length} validation error(s):`);
    for (const e of errs) console.error('  - ' + e);
    process.exit(1);
  }
  console.log('✔ all controls valid');
}
```

- [ ] **Step 2: Run the validator against the migrated corpus**

Run: `npm run validate`
Expected: `✔ all controls valid` (migrated stubs reference real BSAM ids and resources, with empty attack `refs`).

- [ ] **Step 3: Prove the validator catches a real fault**

Run:
```bash
cp src/content/controls/rfsam-ble-at-01.md /tmp/at01.bak
sed -i '' 's/^layer: AT/layer: CR/' src/content/controls/rfsam-ble-at-01.md
npm run validate; echo "exit=$?"
cp /tmp/at01.bak src/content/controls/rfsam-ble-at-01.md
```
Expected: a `layer segment 'AT' != layer field 'CR'` error and `exit=1`, then the file is restored.

- [ ] **Step 4: Confirm restoration**

Run: `npm run validate`
Expected: `✔ all controls valid`.

- [ ] **Step 5: Commit**

```bash
git add scripts/validate.mjs
git commit -m "Add validator CLI scanning all controls against registries"
```

### Task 14: CI workflows

**Files:**
- Create: `.github/workflows/validate.yml`, `.github/workflows/deploy.yml`

- [ ] **Step 1: Write `.github/workflows/validate.yml`**

```yaml
name: Validate
on:
  pull_request:
  push:
    branches: [main]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
      - run: npm run validate
      - run: npm run build
```

- [ ] **Step 2: Write `.github/workflows/deploy.yml`**

Before writing, open https://docs.astro.build/en/guides/deploy/github/ and copy the **current** action versions (they bump). The structure is:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3      # confirm version against the docs page
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4   # confirm version against the docs page
```

> [!FLAG] Action versions (`withastro/action`, `actions/deploy-pages`, `actions/checkout`) change over time. The executor MUST set them from the live Astro deploy docs at implementation time rather than trusting the numbers above.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows
git commit -m "Add validate and GitHub Pages deploy workflows"
```

---

## Part 6 — Site UI

### Task 15: Global styles (EC palette + tokens)

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Write `src/styles/global.css`**

```css
:root {
  --bg:#0A1119; --bg2:#0E1722; --panel:#131F2E; --panel2:#18283A;
  --line:#22344A; --line2:#2C4258;
  --ink:#E6EDF3; --mut:#8B9AAB; --mut2:#5E7088;
  --orange:#FF7A1A; --cyan:#2FB8E0; --green:#3FD17C; --purple:#9B8CFF;
  --amber:#FFC24B; --red:#FF5A5F;
  /* layer colors */
  --ly-IG:#C9D4E0; --ly-SP:#2FB8E0; --ly-PHY:#3FD17C; --ly-LL:#9B8CFF;
  --ly-CR:#FFC24B; --ly-AT:#FF7A1A; --ly-AP:#FF5A5F;
  --mono:'IBM Plex Mono',ui-monospace,monospace;
  --disp:'Space Grotesk',system-ui,sans-serif;
  --body:'Inter',system-ui,sans-serif;
}
* { box-sizing:border-box; margin:0; padding:0; }
body { background:var(--bg); color:var(--ink); font-family:var(--body); font-size:15px; line-height:1.6; }
a { color:inherit; text-decoration:none; }
a:hover { color:var(--cyan); }
code { font-family:var(--mono); font-size:.92em; background:rgba(63,209,124,.10); color:var(--green); padding:1px 5px; border-radius:3px; }
pre { background:var(--bg2); border:1px solid var(--line); border-radius:8px; padding:14px 16px; overflow:auto; }
pre code { background:none; color:var(--ink); padding:0; }
h1,h2,h3 { font-family:var(--disp); letter-spacing:-.01em; }
.container { max-width:920px; margin:0 auto; padding:40px 24px 120px; }
.mono { font-family:var(--mono); }
/* nav */
.topnav { position:sticky; top:0; z-index:30; display:flex; gap:22px; align-items:center;
  background:rgba(10,17,25,.86); backdrop-filter:blur(12px); border-bottom:1px solid var(--line); padding:14px 24px; }
.topnav .brand { font-family:var(--disp); font-weight:700; font-size:18px; }
.topnav a.nav { font-family:var(--mono); font-size:12px; color:var(--mut); letter-spacing:.04em; }
.topnav a.nav[aria-current="page"] { color:var(--orange); }
/* review badge */
.review { font-family:var(--mono); font-size:10px; padding:2px 7px; border-radius:3px; border:1px solid var(--line2); letter-spacing:.06em; }
.review.stub { color:var(--mut2); }
.review.draft { color:var(--amber); border-color:var(--amber); }
.review.verified { color:var(--green); border-color:var(--green); }
/* flag admonition */
blockquote.flag { border-left:3px solid var(--amber); background:rgba(255,194,75,.07);
  padding:10px 14px; margin:14px 0; border-radius:6px; color:#E7DCC2; font-size:14px; }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "Add global EC-palette styles and design tokens"
```

### Task 16: BaseLayout + IqTrace + ReviewBadge

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/IqTrace.astro`, `src/components/ReviewBadge.astro`

- [ ] **Step 1: Write `src/components/ReviewBadge.astro`**

```astro
---
const { status = 'stub', confidence } = Astro.props;
const label = status.toUpperCase() + (confidence ? ` · ${confidence}` : '');
---
<span class={`review ${status}`}>{label}</span>
```

- [ ] **Step 2: Write `src/components/IqTrace.astro`** (the signature dual-trace motif, computed at build time)

```astro
---
const W = 1000, H = 54, mid = H / 2;
let pI = '', pQ = '';
for (let x = 0; x <= W; x += 4) {
  const t = (x / W) * Math.PI * 8;
  const env = Math.exp((-x / W) * 0.3);
  pI += (x === 0 ? 'M' : 'L') + x + ' ' + (mid + Math.sin(t) * 15 * env).toFixed(1) + ' ';
  pQ += (x === 0 ? 'M' : 'L') + x + ' ' + (mid + Math.cos(t) * 15 * env).toFixed(1) + ' ';
}
---
<svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" style="width:100%;height:54px;display:block;margin:28px 0">
  <path d={pI} fill="none" stroke="#2FB8E0" stroke-width="1.2" opacity="0.85" />
  <path d={pQ} fill="none" stroke="#FF7A1A" stroke-width="1.2" opacity="0.7" />
</svg>
```

- [ ] **Step 3: Write `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import { meta } from '../data/meta.js';
const { title } = Astro.props;
const path = Astro.url.pathname.replace(/\/$/, '') || '/';
const nav = [
  { href: '/', label: 'Home' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/controls', label: 'Controls' },
  { href: '/tools', label: 'Tools' },
  { href: '/resources', label: 'Resources' },
  { href: '/roadmap', label: 'Roadmap' },
];
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title ? `${title} — RFSAM` : 'RFSAM'}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <nav class="topnav">
      <a class="brand" href="/">RFSAM</a>
      {nav.filter(n => n.href !== '/').map(n => (
        <a class="nav" href={n.href} aria-current={path === n.href || path.startsWith(n.href + '/') ? 'page' : undefined}>{n.label}</a>
      ))}
    </nav>
    <slot />
    <footer style="border-top:1px solid var(--line);padding:24px;color:var(--mut2);font-size:12px;text-align:center">
      {meta.org} · {meta.title} {meta.version} · CC BY-SA 4.0
    </footer>
  </body>
</html>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds (layout/components compile; no pages yet beyond defaults).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/IqTrace.astro src/components/ReviewBadge.astro
git commit -m "Add base layout, I/Q-trace motif, and review badge"
```

### Task 17: Home page

**Files:**
- Create: `src/pages/index.astro`, `src/components/LayerStrip.astro`, `src/components/ProtocolCard.astro`

- [ ] **Step 1: Write `src/components/LayerStrip.astro`** (the descent — IG excluded)

```astro
---
import { layers } from '../data/layers.js';
const descent = layers.filter((l) => l.id !== 'IG');
---
<div style="display:flex;border:1px solid var(--line);border-radius:8px;overflow:hidden;margin:28px 0">
  {descent.map((l) => (
    <div style="flex:1;padding:14px;border-right:1px solid var(--line);position:relative">
      <div style={`position:absolute;top:0;left:0;right:0;height:3px;background:${l.color}`}></div>
      <div class="mono" style={`font-size:10px;color:${l.color}`}>{l.id}</div>
      <div style="font-family:var(--disp);font-weight:600;font-size:13px;margin:5px 0 4px">{l.name}</div>
      <div style="font-size:11px;color:var(--mut);line-height:1.45">{l.note}</div>
    </div>
  ))}
</div>
```

- [ ] **Step 2: Write `src/components/ProtocolCard.astro`**

```astro
---
const { protocol, count, href } = Astro.props;
---
<a href={href} style="display:block;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:20px">
  <div style="font-family:var(--disp);font-weight:600;font-size:17px">{protocol.name}</div>
  <div class="mono" style="font-size:10.5px;color:var(--mut2);margin-top:3px">{protocol.band}</div>
  <div class="mono" style="font-size:11px;color:var(--orange);margin-top:12px">{protocol.prefix}-·· · {count} control{count === 1 ? '' : 's'}</div>
</a>
```

- [ ] **Step 3: Write `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import LayerStrip from '../components/LayerStrip.astro';
import ProtocolCard from '../components/ProtocolCard.astro';
import IqTrace from '../components/IqTrace.astro';
import { meta } from '../data/meta.js';
import { protocols } from '../data/protocols.js';

const controls = await getCollection('controls');
const countFor = (pid) => controls.filter((c) => c.data.protocol === pid).length;
const withControls = protocols.filter((p) => countFor(p.id) > 0);
---
<BaseLayout title="A north for RF research and auditing">
  <div class="container">
    <div class="mono" style="font-size:11px;letter-spacing:.18em;color:var(--orange);text-transform:uppercase">Open methodology · {meta.org}</div>
    <h1 style="font-size:46px;line-height:1.05;margin:16px 0 0;max-width:16ch">A <span style="color:var(--cyan)">north</span> for RF research and auditing.</h1>
    <p style="font-size:17px;color:var(--mut);max-width:62ch;margin-top:18px">{meta.blurb}</p>
    <IqTrace />
    <h2 style="font-size:13px" class="mono">THE DESCENT</h2>
    <LayerStrip />
    <h2 style="font-size:13px;margin-top:40px" class="mono">PROTOCOLS</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px;margin-top:16px">
      {withControls.map((p) => <ProtocolCard protocol={p} count={countFor(p.id)} href={`/controls/${p.id.toLowerCase()}`} />)}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 4: Verify the home page renders**

Run: `npm run build && npm run preview`
Expected: build succeeds; visiting the preview URL shows the hero, descent strip, and one card per protocol that has controls. Stop preview after checking.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/components/LayerStrip.astro src/components/ProtocolCard.astro
git commit -m "Add home page with descent strip and protocol navigator"
```

### Task 18: Methodology page

**Files:**
- Create: `src/pages/methodology.astro`

- [ ] **Step 1: Write `src/pages/methodology.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { layers } from '../data/layers.js';
import { bsamRelation } from '../data/bsamRelation.js';
---
<BaseLayout title="Methodology">
  <div class="container">
    <h1 style="font-size:34px">Methodology</h1>

    <h2 class="mono" style="font-size:13px;margin-top:32px;color:var(--mut2)">THE LAYER MODEL</h2>
    {layers.map((l) => (
      <div style="display:flex;gap:14px;padding:12px 0;border-bottom:1px solid var(--line)">
        <div class="mono" style={`width:46px;color:${l.color}`}>{l.id}</div>
        <div>
          <div style="font-family:var(--disp);font-weight:600">{l.name}</div>
          <div style="color:var(--mut);font-size:13px">{l.note}</div>
        </div>
      </div>
    ))}

    <h2 class="mono" style="font-size:13px;margin-top:40px;color:var(--mut2)">WHY RFSAM & WHAT IT BUILDS ON</h2>
    <p style="color:#CFD9E4;line-height:1.7;margin-top:10px">{bsamRelation.priorArt}</p>

    <h2 class="mono" style="font-size:13px;margin-top:40px;color:var(--mut2)">RELATIONSHIP TO BSAM</h2>
    <p style="color:#CFD9E4;line-height:1.7;margin:10px 0">{bsamRelation.summary}</p>
    <div style="border:1px solid var(--line);border-radius:8px;overflow:hidden;margin-top:12px">
      {bsamRelation.ownership.map((o) => (
        <div style="display:flex;gap:16px;padding:12px 16px;background:var(--bg2);border-bottom:1px solid var(--line)">
          <div class="mono" style="flex:0 0 230px;color:var(--cyan);font-size:12px">{o.rfsam}</div>
          <div style="color:var(--mut);font-size:13px">{o.note}</div>
        </div>
      ))}
    </div>
    <a class="mono" style="display:inline-block;margin-top:16px;color:var(--amber);font-size:12px" href={bsamRelation.url} target="_blank" rel="noopener">View BSAM at tarlogic.com/bsam ↗</a>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: `/methodology` builds; prose pulls from `bsamRelation` data.

- [ ] **Step 3: Commit**

```bash
git add src/pages/methodology.astro
git commit -m "Add methodology page (layer model, prior art, BSAM relationship)"
```

### Task 19: Tools and Resources pages

**Files:**
- Create: `src/pages/tools.astro`, `src/pages/resources.astro`

- [ ] **Step 1: Write `src/pages/tools.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
const tools = (await getCollection('tools')).sort((a, b) => Number(b.data.ec) - Number(a.data.ec));
---
<BaseLayout title="Tools">
  <div class="container">
    <h1 style="font-size:34px">Standard tooling</h1>
    <p style="color:var(--mut);margin-top:8px">Representative tools — Electronic Cats tooling is badged; community tools sit alongside it. Check current advisories; this is not exhaustive.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-top:20px">
      {tools.map((t) => (
        <div style={`border:1px solid ${t.data.ec ? 'var(--orange)' : 'var(--line)'};border-radius:10px;padding:18px;background:var(--panel)`}>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-family:var(--disp);font-weight:600;font-size:15px">{t.data.name}</span>
            {t.data.ec && <span class="mono" style="font-size:9px;color:var(--orange);border:1px solid var(--orange);border-radius:3px;padding:1px 5px">EC</span>}
          </div>
          <div class="mono" style="font-size:10px;color:var(--mut2);margin-top:2px">{t.data.vendor}</div>
          <div class="mono" style="font-size:10.5px;color:var(--cyan);margin-top:10px">{t.data.protocols.join(' · ')}</div>
          <div style="font-size:12px;color:var(--mut);margin-top:8px;line-height:1.5">{t.data.note}</div>
        </div>
      ))}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Write `src/pages/resources.astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
const resources = (await getCollection('resources')).sort((a, b) => a.data.id.localeCompare(b.data.id));
const rendered = await Promise.all(resources.map(async (r) => ({ data: r.data, Content: (await render(r)).Content })));
---
<BaseLayout title="Resources">
  <div class="container">
    <h1 style="font-size:34px">Resources</h1>
    <p style="color:var(--mut);margin-top:8px">Reusable procedures referenced by the controls.</p>
    <div style="margin-top:20px">
      {rendered.map(({ data, Content }) => (
        <div style="border-bottom:1px solid var(--line);padding:16px 0">
          <div class="mono" style="font-size:11.5px;color:var(--cyan)">{data.id}</div>
          <div style="font-family:var(--disp);font-weight:600;margin:4px 0 6px">{data.title}</div>
          <div style="color:var(--mut);font-size:13.5px;line-height:1.6"><Content /></div>
        </div>
      ))}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: `/tools` and `/resources` build; 10 tool cards (EC first) and 15 resource entries.

- [ ] **Step 4: Commit**

```bash
git add src/pages/tools.astro src/pages/resources.astro
git commit -m "Add tools and resources pages"
```

### Task 20: Roadmap page

**Files:**
- Create: `src/pages/roadmap.astro`

- [ ] **Step 1: Write `src/pages/roadmap.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import { coverageMap } from '../data/coverage-map.js';
import { protocols } from '../data/protocols.js';
import { layers } from '../data/layers.js';

const controls = await getCollection('controls');
const statusOf = (id) => controls.find((c) => c.data.id === id)?.data.reviewStatus;
const color = (lid) => layers.find((l) => l.id === lid)?.color ?? 'var(--mut)';
const nameOf = (pid) => protocols.find((p) => p.id === pid)?.name ?? pid;
---
<BaseLayout title="Roadmap">
  <div class="container">
    <h1 style="font-size:34px">Roadmap</h1>
    <p style="color:var(--mut);margin-top:8px">Target coverage across protocols and layers. <span class="mono" style="color:var(--mut2)">existing</span> controls have a page; <span class="mono" style="color:var(--mut2)">planned</span> entries are proposed scope.</p>
    {coverageMap.map((p) => (
      <section style="margin-top:28px">
        <h2 style="font-family:var(--disp);font-size:18px">{nameOf(p.protocol)}</h2>
        <div style="margin-top:8px">
          {p.controls.map((c) => {
            const live = statusOf(c.id);
            return (
              <div style="display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--line)">
                <span class="mono" style={`width:8px;height:8px;border-radius:50%;background:${color(c.layer)};display:inline-block`}></span>
                <span class="mono" style="font-size:11px;color:var(--mut2);width:170px">{c.id}</span>
                <span style="flex:1">{c.title}</span>
                {c.status === 'existing'
                  ? <a class="review" style="color:var(--cyan)" href={`/controls/${c.id.toLowerCase()}`}>{(live ?? 'existing').toUpperCase()}</a>
                  : <span class="review stub">PLANNED</span>}
              </div>
            );
          })}
        </div>
      </section>
    ))}
  </div>
</BaseLayout>
```

- [ ] **Step 2: Verify build and that existing ids resolve**

Run: `npm run build`
Expected: `/roadmap` builds; existing rows link to control pages and show their review status; planned rows show `PLANNED`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/roadmap.astro
git commit -m "Add roadmap page rendering the coverage map"
```

### Task 21: Control components (Tags, Attacks, References, DefersToBsam, RelatedResources, Pager)

**Files:**
- Create: `src/components/Tags.astro`, `Attacks.astro`, `References.astro`, `DefersToBsam.astro`, `RelatedResources.astro`, `Pager.astro`

- [ ] **Step 1: Write `src/components/Tags.astro`**

```astro
---
import { layers } from '../data/layers.js';
import { criticality } from '../data/criticality.js';
const { control } = Astro.props;
const ly = layers.find((l) => l.id === control.layer);
const cr = criticality[control.criticality];
const darkText = control.criticality === 'low' || control.criticality === 'medium';
---
<div style="display:flex;flex-wrap:wrap;gap:8px;margin:16px 0">
  {control.applicability.map((a) => (
    <span class="mono" style="font-size:10.5px;padding:3px 10px;border-radius:4px;background:var(--panel2);color:var(--cyan)">{a}</span>
  ))}
  <span class="mono" style={`font-size:10.5px;padding:3px 10px;border-radius:4px;border:1px solid ${ly.color};color:${ly.color}`}>{ly.id} · {ly.name}</span>
  <span class="mono" style={`font-size:10.5px;padding:3px 10px;border-radius:4px;background:${cr.color};color:${darkText ? '#0A1119' : '#fff'};font-weight:600`}>{cr.label.toUpperCase()}</span>
  {control.deferred && <span class="mono" style="font-size:10.5px;padding:3px 10px;border-radius:4px;border:1px solid var(--cyan);color:var(--cyan)">↗ DEFERS TO BSAM</span>}
</div>
```

- [ ] **Step 2: Write `src/components/Attacks.astro`**

```astro
---
const { attacks } = Astro.props;
---
{attacks?.length > 0 && (
  <div style="display:flex;flex-direction:column;gap:10px;margin:6px 0">
    {attacks.map((a) => (
      <div style="border:1px solid var(--line);border-left:3px solid var(--red);border-radius:8px;padding:14px 18px;background:var(--panel)">
        <div style="display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap">
          <span style="font-family:var(--disp);font-weight:600">{a.name}</span>
          {a.cve?.length > 0 && <span class="mono" style="font-size:10.5px;color:var(--amber)">{a.cve.join(', ')}</span>}
        </div>
        <p style="font-size:13.5px;color:#CFD9E4;margin-top:6px;line-height:1.6">{a.summary}</p>
        {(a.impact || a.preconditions) && (
          <div class="mono" style="font-size:11px;color:var(--mut2);margin-top:8px;line-height:1.6">
            {a.impact && <div><span style="color:var(--mut)">Impact:</span> {a.impact}</div>}
            {a.preconditions && <div><span style="color:var(--mut)">Preconditions:</span> {a.preconditions}</div>}
          </div>
        )}
        {(a.refs?.length > 0 || a.note) && (
          <div class="mono" style="font-size:11px;color:var(--cyan);margin-top:8px">
            {a.note ?? a.refs.join(', ')}
          </div>
        )}
      </div>
    ))}
  </div>
)}
```

- [ ] **Step 3: Write `src/components/References.astro`**

```astro
---
const { references } = Astro.props;
---
{references?.length > 0 && (
  <ol style="list-style:none;counter-reset:r;margin:6px 0;padding:0">
    {references.map((r) => (
      <li style="counter-increment:r;position:relative;padding:8px 0 8px 28px;border-bottom:1px solid var(--line);font-size:13.5px">
        <span class="mono" style="position:absolute;left:0;color:var(--mut2);font-size:11px">[{r.key}]</span>
        <a href={r.url} target="_blank" rel="noopener">{r.title}</a>
        <span style="color:var(--mut)"> — {[r.authors, r.venue, r.year].filter(Boolean).join(', ')} <span class="mono" style="color:var(--mut2)">({r.type})</span></span>
      </li>
    ))}
  </ol>
)}
```

- [ ] **Step 4: Write `src/components/DefersToBsam.astro`**

```astro
---
import { bsam } from '../data/bsam.js';
const { ids, deferred } = Astro.props;
const note = deferred
  ? 'This layer is covered by BSAM. RFSAM does not duplicate it — run these BSAM controls and carry the result into the RF assessment flow.'
  : 'For the link-layer judgement, RFSAM defers to these BSAM controls. RFSAM’s role here is the RF capture that gets you to the point where they apply.';
---
{ids?.length > 0 && (
  <div>
    <p style="font-size:13.5px;color:var(--mut);font-style:italic;margin-bottom:10px">{note}</p>
    {ids.map((id) => (
      <a href={bsam[id]?.url ?? 'https://www.tarlogic.com/bsam/'} target="_blank" rel="noopener"
         style="display:flex;gap:14px;align-items:center;padding:11px 16px;background:var(--bg2);border:1px solid var(--line);border-radius:8px;margin-bottom:6px">
        <span class="mono" style="font-size:11.5px;color:var(--amber);width:110px">{id}</span>
        <span style="font-size:13.5px">{bsam[id]?.title ?? id}</span>
        <span style="margin-left:auto;color:var(--mut2)">↗</span>
      </a>
    ))}
  </div>
)}
```

- [ ] **Step 5: Write `src/components/RelatedResources.astro`**

```astro
---
import { getCollection } from 'astro:content';
const { ids } = Astro.props;
const resources = await getCollection('resources');
const title = (id) => resources.find((r) => r.data.id === id)?.data.title ?? id;
---
{ids?.length > 0 && (
  <div style="border:1px solid var(--line);border-radius:8px;overflow:hidden">
    {ids.map((id) => (
      <a href={`/resources#${id.toLowerCase()}`} style="display:flex;gap:14px;padding:12px 16px;background:var(--bg2);border-bottom:1px solid var(--line)">
        <span class="mono" style="font-size:11.5px;color:var(--cyan);width:124px">{id}</span>
        <span style="font-size:13.5px">{title(id)}</span>
      </a>
    ))}
  </div>
)}
```

- [ ] **Step 6: Write `src/components/Pager.astro`**

```astro
---
const { prev, next } = Astro.props;
---
<div style="display:flex;justify-content:space-between;gap:14px;margin-top:48px">
  {prev
    ? <a href={`/controls/${prev.id.toLowerCase()}`} style="flex:1;border:1px solid var(--line);border-radius:8px;padding:14px 18px">
        <div class="mono" style="font-size:9.5px;color:var(--mut2)">← PREVIOUS</div>
        <div style="font-family:var(--disp);font-weight:600;font-size:14px;margin-top:4px">{prev.title}</div>
      </a>
    : <span style="flex:1"></span>}
  {next
    ? <a href={`/controls/${next.id.toLowerCase()}`} style="flex:1;text-align:right;border:1px solid var(--line);border-radius:8px;padding:14px 18px">
        <div class="mono" style="font-size:9.5px;color:var(--mut2)">NEXT →</div>
        <div style="font-family:var(--disp);font-weight:600;font-size:14px;margin-top:4px">{next.title}</div>
      </a>
    : <span style="flex:1"></span>}
</div>
```

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: components compile (they are unused until Task 22, so no rendering yet — just no type/parse errors).

- [ ] **Step 8: Commit**

```bash
git add src/components/Tags.astro src/components/Attacks.astro src/components/References.astro src/components/DefersToBsam.astro src/components/RelatedResources.astro src/components/Pager.astro
git commit -m "Add control-page section components"
```

### Task 22: Sidebar, DocsLayout, control pages & section index

**Files:**
- Create: `src/components/Sidebar.astro`, `src/layouts/DocsLayout.astro`, `src/pages/controls/[...slug].astro`

This task renders the protocol→layer sidebar tree, the rich control page, and a per-protocol index (`/controls/<proto>`). The `[...slug]` route handles both `/controls` (full index) and `/controls/<proto>` and `/controls/<proto>/...` via control ids.

- [ ] **Step 1: Write `src/components/Sidebar.astro`**

```astro
---
import { getCollection } from 'astro:content';
import { protocols } from '../data/protocols.js';
import { layers } from '../data/layers.js';
const { activeId } = Astro.props;
const controls = await getCollection('controls');
const color = (lid) => layers.find((l) => l.id === lid)?.color ?? 'var(--mut)';
const groups = protocols
  .map((p) => ({ p, items: controls.filter((c) => c.data.protocol === p.id).sort((a, b) => a.data.id.localeCompare(b.data.id)) }))
  .filter((g) => g.items.length > 0);
---
<aside style="width:280px;flex:0 0 280px;border-right:1px solid var(--line);height:calc(100vh - 53px);position:sticky;top:53px;overflow-y:auto;padding:18px 0">
  {groups.map((g) => (
    <div style="margin-bottom:8px">
      <div style="font-family:var(--disp);font-weight:600;font-size:13px;padding:8px 20px">{g.p.name}</div>
      {g.items.map((c) => (
        <a href={`/controls/${c.data.id.toLowerCase()}`}
           style={`display:flex;align-items:center;gap:9px;padding:5px 20px;font-size:12.5px;border-left:2px solid ${c.data.id === activeId ? 'var(--orange)' : 'transparent'};color:${c.data.id === activeId ? 'var(--ink)' : 'var(--mut)'};background:${c.data.id === activeId ? 'rgba(255,122,26,.07)' : 'transparent'}`}>
          <span style={`width:7px;height:7px;border-radius:50%;background:${color(c.data.layer)};flex-shrink:0`}></span>
          <span class="mono" style="font-size:10px;color:var(--mut2);width:54px;flex-shrink:0">{c.data.id.split('-').slice(2).join('-')}</span>
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{c.data.title}</span>
        </a>
      ))}
    </div>
  ))}
</aside>
```

- [ ] **Step 2: Write `src/layouts/DocsLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
import Sidebar from '../components/Sidebar.astro';
const { title, activeId } = Astro.props;
---
<BaseLayout title={title}>
  <div style="display:flex">
    <Sidebar activeId={activeId} />
    <div style="min-width:0;flex:1">
      <div style="max-width:880px;padding:36px 48px 120px">
        <slot />
      </div>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Write `src/pages/controls/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import DocsLayout from '../../layouts/DocsLayout.astro';
import Tags from '../../components/Tags.astro';
import ReviewBadge from '../../components/ReviewBadge.astro';
import Attacks from '../../components/Attacks.astro';
import References from '../../components/References.astro';
import DefersToBsam from '../../components/DefersToBsam.astro';
import RelatedResources from '../../components/RelatedResources.astro';
import Pager from '../../components/Pager.astro';
import { protocols } from '../../data/protocols.js';
import { layers } from '../../data/layers.js';

export async function getStaticPaths() {
  const controls = await getCollection('controls');
  const byProto = (pid) => controls.filter((c) => c.data.protocol === pid).sort((a, b) => a.data.id.localeCompare(b.data.id));

  const paths = [];
  // section index at /controls
  paths.push({ params: { slug: undefined }, props: { kind: 'index' } });
  // per-protocol index at /controls/<proto>
  for (const p of protocols) {
    if (byProto(p.id).length) paths.push({ params: { slug: p.id.toLowerCase() }, props: { kind: 'proto', protocolId: p.id } });
  }
  // individual control at /controls/<id>
  for (const p of protocols) {
    const list = byProto(p.id);
    list.forEach((c, i) => {
      paths.push({
        params: { slug: c.data.id.toLowerCase() },
        props: { kind: 'control', id: c.data.id, prev: list[i - 1]?.data ?? null, next: list[i + 1]?.data ?? null },
      });
    });
  }
  return paths;
}

const { kind } = Astro.props;
const allControls = await getCollection('controls');
const layerName = (lid) => layers.find((l) => l.id === lid)?.name ?? lid;
const layerColor = (lid) => layers.find((l) => l.id === lid)?.color ?? 'var(--orange)';
const protoName = (pid) => protocols.find((p) => p.id === pid)?.name ?? pid;

let entry, data, Content, prev, next, listForProto, protoId;
if (kind === 'control') {
  entry = allControls.find((c) => c.data.id === Astro.props.id);
  data = entry.data;
  ({ Content } = await render(entry));
  prev = Astro.props.prev; next = Astro.props.next;
} else {
  protoId = Astro.props.protocolId;
  listForProto = allControls
    .filter((c) => kind === 'index' ? true : c.data.protocol === protoId)
    .sort((a, b) => a.data.id.localeCompare(b.data.id));
}
---
{kind === 'control' ? (
  <DocsLayout title={data.title} activeId={data.id}>
    <div class="mono" style="font-size:11px;color:var(--mut2)">Controls / {protoName(data.protocol)} / {data.id}</div>
    <div style={`border-left:4px solid ${layerColor(data.layer)};padding-left:18px;margin-top:14px`}>
      <div style="display:flex;align-items:center;gap:12px">
        <span class="mono" style={`font-size:13px;color:${layerColor(data.layer)}`}>{data.id}</span>
        <ReviewBadge status={data.reviewStatus} confidence={data.confidence} />
      </div>
      <h1 style="font-size:32px;margin-top:6px">{data.title}</h1>
    </div>
    {data.objective && <p style="color:var(--mut);font-style:italic;margin-top:10px">{data.objective}</p>}
    <Tags control={data} />
    {data.intro && <div style="background:var(--panel);border-left:3px solid var(--cyan);border-radius:8px;padding:16px 20px;margin:14px 0;font-size:16px">{data.intro}</div>}

    <article class="prose"><Content /></article>

    {data.attacks?.length > 0 && <><h2 class="mono" style="font-size:12px;color:var(--mut2);margin-top:36px">KNOWN ATTACKS</h2><Attacks attacks={data.attacks} /></>}
    {data.references?.length > 0 && <><h2 class="mono" style="font-size:12px;color:var(--mut2);margin-top:36px">REFERENCES</h2><References references={data.references} /></>}
    {data.resources?.length > 0 && <><h2 class="mono" style="font-size:12px;color:var(--mut2);margin-top:36px">RELATED RESOURCES</h2><RelatedResources ids={data.resources} /></>}
    {data.bsam?.length > 0 && <><h2 class="mono" style="font-size:12px;color:var(--mut2);margin-top:36px">DEFERS TO BSAM</h2><DefersToBsam ids={data.bsam} deferred={data.deferred} /></>}

    <Pager prev={prev} next={next} />
  </DocsLayout>
) : (
  <DocsLayout title={kind === 'index' ? 'Controls' : protoName(protoId)}>
    <h1 style="font-size:32px">{kind === 'index' ? 'Controls' : protoName(protoId)}</h1>
    <p style="color:var(--mut);margin-top:8px">Select a control from the sidebar, or pick one below.</p>
    <div style="margin-top:18px">
      {listForProto.map((c) => (
        <a href={`/controls/${c.data.id.toLowerCase()}`} style="display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)">
          <span style={`width:7px;height:7px;border-radius:50%;background:${layerColor(c.data.layer)}`}></span>
          <span class="mono" style="font-size:11px;color:var(--mut2);width:170px">{c.data.id}</span>
          <span style="flex:1">{c.data.title}</span>
          <ReviewBadge status={c.data.reviewStatus} />
        </a>
      ))}
    </div>
  </DocsLayout>
)}

<style>
  .prose :global(h2) { font-family:var(--disp); font-size:18px; margin:30px 0 12px; }
  .prose :global(p) { color:#CFD9E4; line-height:1.7; margin:0 0 14px; }
  .prose :global(ol),.prose :global(ul) { margin:0 0 14px 22px; color:#CFD9E4; line-height:1.7; }
  .prose :global(blockquote) { border-left:3px solid var(--amber); background:rgba(255,194,75,.07); padding:10px 14px; margin:14px 0; border-radius:6px; }
</style>
```

> [!FLAG] The inline `[!FLAG]` admonition is GitHub-flavored callout syntax; Astro's default Markdown renders it as a normal blockquote (styled above). If a true callout style is wanted later, add a remark plugin — out of scope for the Foundation.

- [ ] **Step 4: Verify all control pages build and render**

Run: `npm run build`
Expected: build emits `/controls`, `/controls/<proto>` for each protocol with controls, and `/controls/<id>` for all 26. No errors.

- [ ] **Step 5: Cross-check the coverage map against reality**

Run:
```bash
node -e "
import('./src/data/coverage-map.js').then(async m => {
  const { readdirSync } = await import('node:fs');
  const files = new Set(readdirSync('src/content/controls').filter(f=>f.endsWith('.md')&&!f.startsWith('_')).map(f=>f.replace('.md','').toUpperCase()));
  const existing = m.coverageMap.flatMap(p=>p.controls).filter(c=>c.status==='existing');
  const missing = existing.filter(c=>!files.has(c.id));
  console.log('existing-in-map but no file:', missing.map(c=>c.id));
})"
```
Expected: `existing-in-map but no file: []`. If any id is listed, fix the title/id in `coverage-map.js` to match the migrated files.

- [ ] **Step 6: Commit**

```bash
git add src/components/Sidebar.astro src/layouts/DocsLayout.astro src/pages/controls
git commit -m "Add controls section: sidebar tree, docs layout, control pages"
```

---

## Part 7 — The exemplar control

### Task 23: Research and write `RFSAM-BLE-AT-01` to full depth

**Files:**
- Modify: `src/content/controls/rfsam-ble-at-01.md`

**This is the depth-bar exemplar. The accuracy rule is absolute here: every technical claim must be cited; nothing is invented.** The legacy text (intro/procedure/field case incl. the `cur_aa` story) is the author's own and is preserved verbatim as the seed; research adds cited mechanism, attacks, references, prerequisites, and remediation around it.

- [ ] **Step 1: Research the sources (use the deep-research skill or web search)**

Gather primary sources on BLE connection following/hijacking and capture, for example: the tooling for BLE sniffing/connection-following and hijack, the relevant academic/conference work, and any associated CVEs. For each source, record `key`, title, authors, venue, year, URL, and type. **Do not proceed to writing a claim you could not attach to one of these sources.** If a claim cannot be sourced, either drop it or write it under `> [!FLAG]`.

Capture the source list as the `references[]` array. Minimum bar: every attack entry and every nontrivial sentence in `## Mechanism` maps to a reference key.

- [ ] **Step 2: Write the deepened frontmatter**

Fill these fields on `rfsam-ble-at-01.md`, preserving the migrated `id/protocol/layer/criticality/title/applicability/resources` and the body's existing `cur_aa` content:
- `objective`: one testable statement of what the control verifies.
- `intro`: keep or tighten the existing callout.
- `prerequisites`: `hardware` (the sniffer/SDR class actually needed), `software`, `signal` (BLE: `freq: "2.402–2.480 GHz"`, `bandwidth`, `modulation: "GFSK"` — only if confirmed), `skill: advanced`.
- `attacks[]`: each `{ name, cve?, refs:[<reference keys>], impact, preconditions, summary }`, every `refs` key present in `references[]`.
- `references[]`: the sourced list from Step 1.
- `tools[]`: slugs that exist in the tools collection (verify against `src/content/tools/`).
- `reviewStatus: draft`, `confidence:` set honestly (`low`/`medium`), `lastResearched: 2026-06-13`.

- [ ] **Step 3: Deepen the body**

Expand `## Mechanism` with the cited explanation of BLE connection following and the hijack→terminate→reconnect pattern. Keep `## Procedure` runnable with real commands and expected output; keep the `## Field case` `cur_aa` narrative verbatim and explain it. Make `## Remediation` specific and layered. Any uncertain claim gets `> [!FLAG] <claim — what to verify>`.

- [ ] **Step 4: Validate the exemplar**

Run: `npm run validate`
Expected: `✔ all controls valid` — in particular, every attack `refs` key resolves to a `references[]` entry, `tools` slugs exist, and (since status is `draft`) `objective` is non-empty. (Open `[!FLAG]`s are allowed in `draft`.)

- [ ] **Step 5: Render and eyeball**

Run: `npm run build && npm run preview`
Expected: `/controls/rfsam-ble-at-01` shows the review badge (`DRAFT`), objective, deepened mechanism with reference superscripts/links, attack cards with CVEs where applicable, the references list, and any `[!FLAG]` callouts. Stop preview after checking.

- [ ] **Step 6: Commit**

```bash
git add src/content/controls/rfsam-ble-at-01.md
git commit -m "Deepen RFSAM-BLE-AT-01 to full depth with cited references"
```

---

## Part 8 — Docs & finalization

### Task 24: README and CONTRIBUTING

**Files:**
- Create: `README.md`, `CONTRIBUTING.md`

- [ ] **Step 1: Write `README.md`** covering: what RFSAM is (the "north" framing, from `meta.blurb`); what it is and isn't (builds on OSSTMM/BSAM/SDR-pentest lineage, not a claim of novelty); repo structure (collections, `src/data`, scripts, reference); how to run locally (`npm install`, `npm run dev`, `npm run build`, `npm run validate`, `npm test`); and the review-status model (`stub`/`draft`/`verified`). Do not reference any tooling assistant.

- [ ] **Step 2: Write `CONTRIBUTING.md`** covering: the control schema field-by-field (mirroring `_template.md`); the `RFSAM-<PROTO>-<LAYER>-<NN>` ID rule and that segments must match the fields; the criticality rubric (`info`→`critical`, with one line each); the research→verify workflow (cite every claim; `confidence`; `> [!FLAG]`; status lifecycle); and "how to add a control" (copy `_template.md`, fill, `npm run validate`, open a PR). State that every nontrivial claim must carry a citation.

- [ ] **Step 3: Verify no forbidden references**

Run: `grep -rin 'claude\|anthropic\|copilot\|chatgpt\|generated with\|ai assistant' README.md CONTRIBUTING.md && echo 'FOUND — remove' || echo 'clean'`
Expected: `clean`.

- [ ] **Step 4: Commit**

```bash
git add README.md CONTRIBUTING.md
git commit -m "Add README and CONTRIBUTING with schema and contribution workflow"
```

### Task 25: Final verification sweep

**Files:** none (verification only)

- [ ] **Step 1: Full local gate**

Run: `npm ci && npm test && npm run validate && npm run build`
Expected: tests pass, `✔ all controls valid`, build succeeds.

- [ ] **Step 2: Repo-wide attribution scan**

Run:
```bash
git grep -in 'claude\|anthropic\|co-authored\|generated with\|copilot' -- . ':!reference/' ':!package-lock.json' && echo 'FOUND — scrub' || echo 'clean'
git log --format='%an <%ae>%n%B' | grep -in 'claude\|anthropic\|co-authored\|generated with' && echo 'FOUND IN HISTORY' || echo 'history clean'
```
Expected: `clean` and `history clean`. (CLAUDE.md / CLAUDE-CODE-PROMPT.md are git-ignored, so they will not appear.)

- [ ] **Step 3: Confirm review-state visibility and counts**

Run:
```bash
ls src/content/controls/*.md | grep -v _template | wc -l   # 26
grep -l 'reviewStatus: draft' src/content/controls/*.md      # rfsam-ble-at-01.md only
```
Expected: 26 controls; exactly one `draft` (the exemplar); the rest `stub`.

- [ ] **Step 4: Stop for the author's review**

Do not begin deepening any other protocol. Summarize for the author: the depth bar (schema + exemplar), the coverage map to trim, and the open `[!FLAG]`s in the exemplar awaiting verification.

---

## Self-review notes (coverage against the spec)

- Spec §4 depth bar → Tasks 8, 11, 23. §4.4 validation invariants → Tasks 12–13 (id/layer/protocol match, attack-ref closure, bsam/resource/tool resolution, enums via schema, verified-gates). §5 coverage map → Tasks 7, 20, 22-Step5. §6 site shell + review visibility → Tasks 15–22. §6.1 migration → Tasks 9–10. §6.2 deploy → Tasks 4, 14. §7 exemplar → Task 23. §8 research→verify → Tasks 11, 23, 24. §9 hygiene/meta → Tasks 1, 2, 24. §10 build order preserved. §11 acceptance → Task 25.
- No-attribution and no-unproven rules are repeated as task-level gates (Tasks 14, 23, 24, 25).
- Open design `[!FLAG]`s carried for the author: `NR5G` protocol-segment naming (Task 5); new-protocol band strings and proposed scope (Tasks 6–7); CI action versions (Task 14).
```
