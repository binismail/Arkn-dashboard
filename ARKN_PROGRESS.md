# ARKN — Development Progress & Handoff Document
> Last updated: 2026-07-21 (Session 8)
> Status: Initial ARKN Landing Page Created & Deployed · Pure Flat UI Design System · Auth-Aware CTAs · Official Arch Logo · Programmatic OG & AIEO Ready · Mobile Responsive

---

## Session 8 — Initial ARKN Landing Page Design & Launch (2026-07-20 → 2026-07-21)

| Area | Change / Feature | Impact |
|---|---|---|
| **Initial ARKN Landing Page Creation** | Designed, built, and launched the official high-converting landing page at `/` (`src/app/page.tsx`). | Replaces the placeholder page with a complete enterprise landing page showcasing ARKN's browser-first security layer for AI. |
| **Pure Flat Design Language** | Built a unified design system with zero drop shadows, zero unnecessary borders on swatch cards, rounded 24px/28px corners, pale mint background swatches (`#F2F8F4`), Forest Green (`#1A5C38`) primary brand color, and `#7ECBA1` mint text mouse selection highlight (`::selection`). | Establishes a calm, modern aesthetic aligned with Apple, Linear, and Stripe product pages. |
| **Interactive Hero Product Demo** | Created `HeroProductDemo.tsx` (12–15s state machine simulating typing, local scanning, step-by-step entity tokenization, AI response, and local client restoration across ChatGPT, Claude, and Gemini) and `AIBrowserUI.tsx`. | Communicates ARKN's 6 core concepts in under 5 seconds without reading copy. |
| **2x2 Deployment Journey** | Built `Onboarding.tsx` 4-card grid ("Deploy across your team in minutes") covering Create Workspace, Invite Team, Install Extension, and Protection Starts Immediately. | Answers how quickly a company can roll out ARKN with custom per-card vertical entrance offsets. |
| **SensitiveData 3D Composition** | Designed 3-card stage composition (`SensitiveData.tsx`) with subtle 3D perspective depth (`rotateX`, `rotateY`) and ~30% bottom overflow clipping. | Demonstrates real-time PII redaction across NHS clinical notes, legal contracts, and financial documents. |
| **Pipeline Bento Grid** | Built 5-card Bento Grid (`Pipeline.tsx`) showcasing product capabilities across Chrome Extension, VSCode key interceptor, payment sort codes, NHS clinical notes, and M&A codenames. | Highlights ARKN's versatility across developer, legal, healthcare, and enterprise workflows. |
| **Security & Trust Boundary** | Built `Trust.tsx` card grid detailing local browser inspection, zero prompt storage, zero training on customer data, and deterministic token transmission. | Provides verbatim security guarantees for enterprise compliance officers. |
| **Official ARKN Arch Brand Mark** | Recreated the official ARKN logo (`public/favicon.svg`, `src/app/icon.tsx`, and `ArknLogo.tsx`) featuring a forest green rounded square (`#1A5C38`) with white arch (`∩`). | Standardizes brand identity across navbar, footer, auth flows, onboarding, and favicons. |
| **Auth-Aware Dynamic CTAs** | Created `useUserSession` hook to check active Supabase client authentication on landing page load. | Header navbar, Hero, Final CTA, and Footer CTAs automatically switch from `Sign in` / `Create workspace` to **`Go to Dashboard →`** (`/dashboard`) when signed in. |
| **Programmatic OpenGraph Image** | Built `src/app/opengraph-image.tsx` using Next.js `ImageResponse` (`@vercel/og`). | Generates dynamic 1200x630 social preview cards on-the-fly featuring the ARKN arch mark, headline, and live redacted UI snippet preview. |
| **SEO & AIEO Engine Optimization** | Configured `layout.tsx`, `robots.ts`, and `sitemap.ts` for domain `https://myarkn.ai` and `MYARKN LTD`. Injected Schema.org `SoftwareApplication` & `Organization` JSON-LD data. | Explicitly enables AI search engines (GPTBot, PerplexityBot, ClaudeBot, Google-Extended) to index, cite, and recommend ARKN accurately. |
| **Custom Text Selection Highlight** | Added global `::selection` and `::-moz-selection` rules in `globals.css` using `#7ECBA1` mint highlight color. | Any text selected by mouse cursor highlights in ARKN mint green across the entire app. |
| **Mobile Layout & Overflow Fixes** | Fixed long string wrapping (`break-all sm:break-words`) in `Policies.tsx` cards and responsive button stacks (`flex-col sm:flex-row`) on `Hero.tsx` and `FinalCTA.tsx`. | Eliminates horizontal card overflow and text wrapping inside fixed buttons on small mobile screens. |

---

## Session 7 — Major Accomplishments (2026-07-17)

| Area | Change / Feature | Impact |
|---|---|---|
| **Invite Duplicate Auth Bug Fix** | Root-caused duplicate auth user creation in invite flow: Supabase `type=invite` always creates a brand-new `auth.users` row per link click. Switched to `type=signup` (new users) with `type=recovery` fallback (existing users) in `api/invite/route.ts`. | No more duplicate Supabase Auth identities for invited members. New users get created, existing users get signed in. |
| **Invitation RLS Fix** | Added `email = auth.email()` RLS policy so invited users can update their own invitation status to "accepted" without needing admin role. | Invited users can self-accept invitations during the /reset-password flow. |
| **Profiles Table & Name Resolution** | Created `public.profiles` table synced from `auth.users` via database trigger. All pages (members, dashboard, reports, devices) now fetch real names from profiles instead of showing `User (xxxxx)` placeholders. | Every team member's real name and email render correctly everywhere. Accepted invites no longer look like pending invites. |
| **Role-Based Dashboard Scoping** | Members now see only their own telemetry, device count, and reports. Owners/admins continue to see org-wide data. | Role-based data isolation — members see only what pertains to them. |
| **Role-Based Sidebar** | Sidebar nav in `Shell.tsx` conditionally renders Members and Policies tabs only for admin/owner roles. Members see Overview, Devices, Reports, and Settings. | Clean role-appropriate navigation — no dead-end links for members. |
| **Settings Tab Restrictions** | workspace, compliance, and danger zone settings tabs hidden for members. URL-based tab targeting redirects members from restricted tabs to account tab. | Members can only edit their own profile, not company or compliance settings. |
| **Members Page Route Guard** | Members page checks role on load and redirects to dashboard if role is "member". | Prevents direct URL access to admin-only pages. |
| **Idempotent Membership Insert** | Added pre-flight `maybeSingle` membership check in both accept-invite paths (`reset-password/page.tsx` and `onboarding/create-org/page.tsx`) before inserting. | Prevents unique constraint violations if the membership was already created by the other path. |
| **Invite Redirect Fix** | Uncommented the dashboard redirect in `reset-password/page.tsx` after invite-based account setup. | Invited users now navigate to `/dashboard` automatically instead of being stuck on the reset-password page. |
| **Accept-Invite Admin API** | Created `/api/accept-invite` using service-role admin client to bypass RLS. The `.update({ status: "accepted" })` call from anon-key client was silently blocked by the "Admins can manage invitations" RLS policy. Both `reset-password/page.tsx` and `create-org/page.tsx` now call this endpoint. | Accepted invitations actually flip to "accepted" — members no longer appear as stale "pending" invites on the Members page. |

---

## Session 6 — Major Accomplishments (2026-07-14)

| Area | Change / Feature | Impact |
|---|---|---|
| **Theme-Adaptive Calm Notes** | Redesigned calm note badges in `calm-note.js` using CSS variables to adapt to light and dark theme modes. | Displays emerald green text (`#10b981`) on white backgrounds, and mint green text (`#34d399`) on dark backgrounds (ChatGPT/Claude dark themes) with high readability. |
| **Custom Rules Engine** | Implemented `runCustomRules` in `pipeline.js` compiling word-boundary matches and case-insensitive regex rules. | Custom organization-defined rules now redact matching text with a forced `1.0` confidence bypass score. |
| **Immediate Database Auto-Save** | Updated `CustomRulesSection` in `page.tsx` to save rule additions and deletions immediately to the database with toast notifications. | Eliminates the need to click "Save changes" manually for custom rule edits. |
| **Instant Sync Loop** | Implemented real-time postMessage and runtime message relays in `sync-bridge.js` and `service-worker.js`. | Database policy changes are pushed to all active ChatGPT, Claude, and Gemini tabs instantly on save. |
| **Calm Note Deduplication** | Integrated a finality check and a `Set` tracker in `unmasker.js` to verify previously resolved tokens on message containers. | Resolves the calm note double-counting bug across single page re-renders. |
| **Dashboard Activity Filters** | Integrated dynamic Supabase timeframe filtering (`Today`, `7d`, `30d`) for stats and activities. | Overview numbers, voice share columns, and logs update reactively to represent actual database data. |
| **Voice Share Palette** | Replaced mock blue vertical charts with custom green brand voice charts (ChatGPT: forest green, Claude: sage green, Gemini: mint green). | Renders a unified color language aligned with the workspace branding. |
| **Direct Audit Redirects** | Added view-icon links to each activity log row directing users straight to the reports section. | Fast navigation from the dashboard overview to detailed audit rows. |
| **Resend Branded Emails** | Implemented custom branded HTML email templates for signup, forgot password, and team invitations via Resend. | Bypasses generic Supabase email templates, delivering premium styled correspondence directly to users. |
| **Login/Signup Eye Toggles** | Added interactive password visibility eye toggles to `/login` and `/register` pages. | Enhances input security and credential verification before form submission. |
| **Invitation Auto-Accept** | Programmed `create-org/page.tsx` onboarding to detect and accept pending workspace invitations. | Invitee registration automatically binds members to their respective workspace and routes them to `/dashboard`. |

---

## What ARKN Does

A privacy-first Chrome extension (Manifest V3) that sits transparently between regulated professionals and AI platforms (**ChatGPT ✅, Claude ✅, Google Gemini ✅**).

Before any message leaves the browser, ARKN redacts sensitive PII (email, phone, postcode, NI number, names, organisations, bank details, driving licenses, NHS numbers, and claim numbers) by replacing them with transparent tokens like `{EMAIL_1}` or `{NAME_1}`. The AI never sees raw data. When the AI responds, ARKN restores original values locally before the user reads them.

**Core guarantee:** No raw PII ever touches any external server.

---

## Project Structure

```
ARKN/
├── manifest.json                        ← MV3 v0.2.0 — ChatGPT + Claude + Gemini + Supabase host permissions
├── src/
│   ├── engines/                         ← Modular Candidate Pipeline (Session 4)
│   │   ├── candidate.js                 ← Candidate factory + shared namespace (__ARKN_PIPELINE__)
│   │   ├── detectors/                   ← One file per PII type
│   │   │   ├── email.js                 ← EMAIL (confidence: 1.0)
│   │   │   ├── phone.js                 ← PHONE (confidence: 1.0)
│   │   │   ├── postcode.js              ← POSTCODE (confidence: 1.0)
│   │   │   ├── nino.js                  ← NINO (confidence: 1.0)
│   │   │   ├── drivelic.js              ← DRIVELIC (confidence: 1.0)
│   │   │   ├── nhs.js                   ← NHS + checksum validation (confidence: 1.0)
│   │   │   ├── bank.js                  ← BANK (confidence: 1.0)
│   │   │   ├── claim.js                 ← CLAIM (confidence: 1.0)
│   │   │   ├── name.js                  ← NAME: 7 detection passes, 300+ dictionary (0.78–0.95)
│   │   │   └── org.js                   ← ORG: legal suffix patterns + verb stripping (0.90)
│   │   ├── merger.js                    ← Dedup overlapping candidates (longer span wins)
│   │   ├── scorer.js                    ← Contextual confidence boosting
│   │   ├── policy.js                    ← Threshold filtering (default: 0.7)
│   │   ├── tokenizer.js                ← Right-to-left {TYPE_N} replacement + restore
│   │   ├── pipeline.js                 ← Orchestrator + name propagation, exposes __ARKN_REGEX__
│   ├── platforms/                       ← Modular multi-platform adapter architecture
│   │   ├── platform-registry.js         ← Routes request URLs to matching platform adapter
│   │   ├── chatgpt/
│   │   │   ├── config.js                ← Intercepts /backend-api/conversation
│   │   │   └── adapter.js               ← Format A (parts array) + Format B (legacy string)
│   │   ├── claude/
│   │   │   ├── config.js                ← Intercepts /chat_conversations
│   │   │   └── adapter.js               ← Format C (direct prompt) + Formats A/B fallback
│   │   └── gemini/
│   │       ├── config.js                ← Intercepts StreamGenerate, batchexecute, BardChatUi
│   │       └── adapter.js               ← Custom URL-form decoder, nested array JSON extractor
│   ├── injected/
│   │   └── interceptor.js               ← MAIN world, patches fetch + XHR, handles SPA navigation
│   ├── content/
│   │   ├── content.js                   ← Isolated world, event bridge, token persistence, context guards
│   │   └── sync-bridge.js               ← Isolated world SSO credential forwarder to Service Worker
│   │   └── sync-page.js                 ← Dashboard SSO observer and token forwarder
│   ├── ui/
│   │   ├── unmasker.js                  ← 3-strategy unmasker: text node, element-level, catch-all scan
│   │   └── calm-note.js                 ← 🛡️ badge injector — persistent multi-turn DOM observer
│   ├── background/
│   │   └── service-worker.js            ← Zero-PII audit log, background heartbeats, popup stats, migration hooks
│   ├── popup/
│   │   ├── popup.html / popup.js / popup.css ← Stats dashboard, toggle, backup export/import
│   └── audit/
│       ├── audit.html / audit.js / audit.css ← Compliance dashboard with platform-aware badges
└── apps/dashboard/                      ← Next.js 16 App Router Dashboard & Landing Page
```

---

## Test Suite Status

All **112 unit tests across 6 test suites** pass cleanly with zero dependencies:

```bash
node tests/regex-engine.test.js      # 57 tests (PII, names, orgs, propagation, round-trips)
node tests/pipeline.test.js          # 19 tests (merger, scorer, policy, tokenizer)
node tests/token-manager.test.js     # 11 tests (Session isolation & token resolution)
node tests/platform-adapter.test.js  # 10 tests (ChatGPT adapter formats)
node tests/claude-adapter.test.js    # 15 tests (Claude adapter formats)
node tests/gemini-adapter.test.js    # 1 suite (Gemini RPC form parsing & extraction)
# Total: 112 tests, 0 failures ✅
```
