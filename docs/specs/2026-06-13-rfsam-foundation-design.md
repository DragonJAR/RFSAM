# RFSAM Foundation — Design Spec

**Date:** 2026-06-13
**Owner:** Electronic Cats
**Status:** Draft for review
**Scope of this spec:** The *Foundation* only. The full methodology is a multi-phase program; this spec covers the groundwork we build, review, and stop at before committing to deep content for any whole protocol.

---

## 1. Context & problem

RFSAM (Radio Frequency Security Assessment Methodology) currently exists as `rfsam-data.js` — 26 controls, 15 resources, 10 tools across 6 protocols — plus a single-file render prototype. The content is **thin**: each control is ~5 short strings. The goal is to grow RFSAM into a genuinely authoritative methodology with the depth and breadth of an established standard (OSSTMM, BSAM), then publish it as a contributor-driven static site.

Two decisions frame everything:

- **Depth & breadth:** deepen all existing controls **and** broaden coverage to a full RF set (6 existing + 8 new protocols).
- **Authority model:** *every control is researched and drafted with citations, then verified before publishing.* In RF security, wrong depth is worse than missing depth — every nontrivial claim must carry a checkable source, nothing is asserted that cannot be proven, and every draft exposes its confidence so verification is efficient.

Because the full program is too large for one spec, we build the **Foundation** first: the depth bar, the coverage map, the site shell, and one fully-realized exemplar control — enough that the author can judge the quality bar before we scale.

## 2. Goals / non-goals

**Goals (this Foundation):**
1. Define and encode the **enriched control schema** (the "depth bar") as a real validated schema + template.
2. Produce the **coverage map**: the full target taxonomy (14 protocols × applicable layers, every target control enumerated) as a trimmable artifact.
3. Build the **site shell**: plain Astro + Content Collections, the four-area structure, deploy config, validation, rendering existing content and the new schema with visible review state.
4. Write **one exemplar control** (`RFSAM-BLE-AT-01`) to full depth — researched, cited, rendered live — so the bar is concrete.
5. Establish **repo + project meta**: git, hygiene, README, CONTRIBUTING (incl. the research→verify workflow), LICENSE (CC BY-SA 4.0), CI.

**Non-goals (deferred to later phases):**
- Writing deep content for any protocol beyond the single exemplar control.
- Finalizing the exact control list (the map is explicitly the author's to trim/extend).
- Search, i18n, analytics, comments, versioned releases.
- Migrating away from `rfsam-data.js` permanently before the generated content is verified (it stays in `reference/` for provenance).

## 3. Architecture overview

Two streams, with the Foundation touching both:

- **Stream A — Methodology content** (the substance). Lives as Content Collection files. The Foundation delivers the *schema* for it and *one* exemplar.
- **Stream B — Site** (the vehicle). Plain Astro, static, GitHub Pages at `rfsam.electroniccats.com`. The Foundation delivers the full shell.

### 3.1 Repo layout
```
astro.config.mjs            site: https://rfsam.electroniccats.com  (base "/")
public/CNAME                rfsam.electroniccats.com
src/
  content/
    config.ts               zod schemas: controls / resources / tools
    controls/               *.md (one per control) + _template.md
    resources/              rfsam-res-NN.md
    tools/                  <tool>.md
  data/                     singletons: meta, layers, criticality, protocols,
                            bsam (registry), bsamRelation, coverage-map
  components/               Sidebar, ControlHeader, Tags, Procedure, FieldCase,
                            Attacks, References, DefersToBsam, Resources,
                            Remediation, Pager, LayerStrip, ProtocolCard,
                            ReviewBadge, IqTrace
  layouts/                  BaseLayout (top nav) · DocsLayout (sidebar + content)
  pages/                    index · methodology · tools · resources ·
                            roadmap · controls/[...slug]
  styles/global.css         EC palette + tokens
scripts/                    migrate.mjs (one-time) · validate.mjs (CI + local)
.github/workflows/          deploy.yml · validate.yml
docs/specs/                 this spec
reference/                  prototype-reference.html, rfsam-standalone.html,
                            rfsam-data.js  (provenance; not built)
README.md · CONTRIBUTING.md · LICENSE (CC BY-SA 4.0)
```

### 3.2 Content storage decision
- **Structured frontmatter** for metadata + enumerable lists + citations (validates cleanly, renders directly into styled components).
- **Markdown body** for the long prose (`## Mechanism`, `## Procedure`, `## Field case`, `## Remediation`) — at the target depth this prose is too long for YAML, and the body gives natural code blocks and Markdown.
- Singletons in `src/data/` (TypeScript modules, typed).

## 4. The depth bar — enriched control schema

This is the core deliverable. A control is its frontmatter (metadata + structured lists + citations) plus a Markdown body (prose sections).

### 4.1 Frontmatter
| Field | Type | Notes |
|---|---|---|
| `id` | string | `RFSAM-<PROTO>-<LAYER>-<NN>`; protocol & layer segments must match the fields below |
| `title` | string | |
| `protocol` | enum | one of the 14 protocol ids |
| `layer` | enum | `IG, SP, PHY, LL, CR, AT, AP` |
| `criticality` | enum | `info, low, medium, high, critical` |
| `applicability` | string[] | e.g. `["BLE", "BR/EDR"]` |
| `deferred` | boolean | defers the judgement to BSAM (default false) |
| `objective` | string | one-line, testable: *what this control verifies* |
| `intro` | string | short callout lede |
| `prerequisites` | object | `{ hardware[], software[], signal:{freq?,bandwidth?,modulation?}, skill: beginner\|intermediate\|advanced }` |
| `attacks` | object[] | `{ name, cve?[], refs[] (→ references.key), impact, preconditions, summary }` |
| `references` | object[] | `{ key, title, authors?, venue?, year?, url, type: paper\|cve\|talk\|spec\|standard\|tool\|blog }` |
| `tools` | string[] | slugs into the tools collection |
| `bsam` | string[] | ids into the BSAM registry |
| `resources` | string[] | `RFSAM-RES-NN` ids |
| `reviewStatus` | enum | `stub` (migrated thin) → `draft` (researched & cited) → `verified` (author-verified) |
| `confidence` | enum | `low \| medium \| high` — self-assessed confidence in the draft |
| `lastResearched` | date | when the sources were last pulled (refs date fast) |

### 4.2 Body sections (fixed order)
- `## Mechanism` — how the RF/protocol works and why this control matters (multi-paragraph).
- `## Procedure` — numbered steps; real commands in fenced code blocks with **expected output and how to interpret it**.
- `## Field case` — a worked example with real data (EC field captures where available). Verbatim command strings and war stories (`cur_aa`, `[FILL: …]`) preserved.
- `## Remediation` — specific and layered (developer / integrator / operator).

### 4.3 Inline confidence flags
Claims that are uncertain or not yet verified are marked inline with a single convention — `> [!FLAG] <claim + what to verify>` (a blockquote admonition) — rendered as a visible "verify this" callout. The verification pass resolves flags and flips `reviewStatus` to `verified`.

### 4.4 Validation invariants (`scripts/validate.mjs`, in CI)
1. `id` matches `RFSAM-<PROTO>-<LAYER>-<NN>`; its protocol and layer segments equal the `protocol`/`layer` fields.
2. Every `attacks[].refs` key exists in that control's `references[]`.
3. Every `bsam[]` id exists in the BSAM registry.
4. Every `resources[]` id exists in the resources collection.
5. Every `tools[]` slug exists in the tools collection.
6. `criticality`, `layer`, `protocol`, `reviewStatus`, `confidence` are valid enums.
7. Required fields are non-empty; `verified` controls carry ≥1 reference and have zero unresolved `[!FLAG]`s.

zod enforces types/enums at build; `validate.mjs` adds the cross-reference and flag checks and runs fast in CI without a full build.

## 5. The coverage map

A structured artifact (`src/data/coverage-map.ts`) and a rendered **/roadmap** page. For each of the 14 protocols it lists target controls as `{ id, title, layer, objective, status: existing | planned }`.

**Protocols:** existing — BLE, Wi-Fi, LoRa/LoRaWAN, LTE, RFID/NFC, Sub-GHz; new — Zigbee/802.15.4, Z-Wave, Thread/Matter, GNSS/GPS, ADS-B, 5G-NR, GSM/2G, UWB.

This map is **explicitly the author's to trim and extend** — it sets ambition, not a contract. Existing controls migrate in as `status: existing` / `reviewStatus: stub`; everything else is `planned` and unwritten. The map drives the roadmap view and later phase planning.

## 6. The site shell (Stream B)

- **Plain Astro + Content Collections**, static output, `base: "/"` (custom domain).
- **Four areas** via a global top nav:
  - **Home** — the "north" hero + I/Q-trace motif, the **layer descent** strip (IG excluded), protocol navigator cards. No BSAM/tools dump.
  - **Methodology** — the full layer model, the "Why RFSAM & what it builds on" prior-art note, the Relationship-to-BSAM section (summary + ownership table + link).
  - **Tools** — EC-badged grid.
  - **Controls** — `DocsLayout` with the protocol→layer-colored sidebar tree, plus rich control pages: breadcrumb, ID, tags (applicability/layer/criticality), deferred badge, **review badge**, intro callout, mechanism, numbered procedure, field case, attack cards, references list, related resources, defers-to-BSAM links, remediation, prev/next pager within protocol.
  - **Roadmap** — renders the coverage map (status per control).
- **Resources** reference page (the RES list).
- **Design:** EC palette + layer colors on a clean docs layout. Keep the I/Q-trace SVG; do not port the prototype's heavy CSS.
- **Review state is always visible:** `reviewStatus`/`confidence` render as a badge on each control and aggregate on the roadmap, so it's obvious what is verified vs draft vs stub.

### 6.1 Migration
`scripts/migrate.mjs` reads `rfsam-data.js` and emits all content files (controls/resources/tools) + the `src/data/` singletons, mapping old fields into the new schema and marking migrated controls `reviewStatus: stub`. Run once; `validate.mjs` confirms; generated files become canonical; `rfsam-data.js` moves to `reference/`.

### 6.2 Deploy
GitHub Actions: `validate.yml` (PRs) runs the validation script; `deploy.yml` builds and deploys to Pages on push to `main`. `public/CNAME` = `rfsam.electroniccats.com`.

## 7. The exemplar control — `RFSAM-BLE-AT-01`

Take "hijack a live BLE connection" to **full depth** as the concrete depth bar:
- Real, current research with citations (connection-following / hijack literature, the relevant tooling and CVEs), pulled via deep research — not from memory.
- `## Mechanism` explaining BLE connection following, access-address tracking, and the hijack→terminate→reconnect pattern.
- `## Procedure` with actual tool commands and expected output; the `cur_aa` access-address gotcha preserved verbatim and explained.
- `## Field case` grounded in EC tooling (Sniffle/CatSniffer-class) and field data.
- Populated `attacks[]` (with CVEs/refs where applicable), `references[]`, `prerequisites`, `tools`, `remediation`.
- `confidence` set honestly; any uncertain claim marked with `[!FLAG]`.
- Rendered live in the shell so the bar is visible in situ.

This is the one piece of "deep content" in the Foundation; everything else is structure.

## 8. Research → verify workflow (established here, scaled later)

Per control: **deep-research the sources → draft to the depth bar with citations → self-assess `confidence` and flag uncertain claims → the author verifies → flip to `verified`.** The Foundation establishes this loop by running it once (the exemplar) and documenting it in CONTRIBUTING so later phases and outside contributors follow the same standard. Citation standard: every attack and every nontrivial mechanism/claim ties to a `references[]` entry with a resolvable URL and a type.

## 9. Repo hygiene & project meta

- `git init` (done), `.gitignore`, branch `main`.
- Move `prototype-reference.html`, `rfsam-standalone.html`, `rfsam-data.js` → `reference/`; delete the exact duplicates `index.html` and `rfsam-data copy.js`.
- `README.md` — the "north" purpose, what RFSAM is/isn't, repo structure, how to run locally.
- `CONTRIBUTING.md` — the depth-bar schema documented, ID/layer rules, the criticality rubric, the research→verify workflow, and "how to add a control" (copy `_template.md`, fill, PR).
- `LICENSE` — CC BY-SA 4.0 for the methodology content (helper code may carry a permissive note separately).

## 10. Build order (Foundation)

1. Astro scaffold + `src/content/config.ts` schema + `src/data/` singletons + global styles + deploy/CNAME + validation script + CI + README/CONTRIBUTING/LICENSE.
2. `migrate.mjs` → generate all content files from `rfsam-data.js`; validate; move source to `reference/`; delete duplicates.
3. The four areas + roadmap + resources pages + control template/components + EC design.
4. Coverage map (full target taxonomy) + roadmap rendering.
5. The `RFSAM-BLE-AT-01` exemplar to full depth, rendered.
6. Final validation pass; **stop for the author's review of the bar.**

## 11. Acceptance criteria (definition of done)

- `npm run dev` serves the four areas + roadmap; `npm run build` succeeds; `npm run validate` passes with zero errors.
- All 26 existing controls migrated faithfully (verbatim strings preserved): 25 render as `stub`, and `RFSAM-BLE-AT-01` is deepened to `draft` (see below).
- Coverage map lists all 14 protocols with enumerated planned controls; roadmap page renders it.
- `RFSAM-BLE-AT-01` is `draft`, fully populated to the schema, cited, flags where uncertain, and renders with all sections.
- Review/confidence badges visible across controls and aggregated on the roadmap.
- README, CONTRIBUTING, LICENSE present; `reference/` populated; duplicates removed.

## 12. Risks & mitigations

- **Accuracy of researched claims.** → Every claim cited; `confidence` + inline flags expose uncertainty; `verified` gated on the author. The exemplar tests this loop before scaling.
- **Reference rot (CVEs/tools date fast).** → `lastResearched` per control; corpora framed as "representative, check current advisories," not exhaustive.
- **Schema churn after first protocols.** → Foundation deliberately stops at one exemplar so the schema can change cheaply before bulk content exists.
- **Scope creep into the full program.** → This spec is Foundation-only; the map sets ambition without committing writing effort.

## 13. Deferred decisions

- Final control list per protocol (the author trims the map).
- Which protocol(s) to write first after the bar is approved, and the rollout order.
- Whether to add site search (Pagefind) — revisit once content volume justifies it.
