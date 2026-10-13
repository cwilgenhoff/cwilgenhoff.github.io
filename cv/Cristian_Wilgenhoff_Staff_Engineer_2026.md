# CRISTIAN WILGENHOFF
* **Remote (Spain) | UK LTD · cpwilgenhoff@gmail.com · (+44) 07493 074226 ·**
* **[github.com/cwilgenhoff](https://github.com/cwilgenhoff) · [cwilgenhoff.github.io](https://cwilgenhoff.github.io)**

---

Staff/Principal Engineer with 15 years of experience across TypeScript, Node.js and React, building full-stack products at scale. I focus on building resilient backend systems and distributed workflows, and I orchestrate AI coding tools for correctness and maintainability. I spent 6 years across Yum! Brands and Pizza Hut Digital Ventures, working on global payment integrations and menu architecture for the platforms behind KFC, Pizza Hut, Taco Bell and Habit Burger. I am a hands-on technical leader who focuses on long-term engineering strategy and mentoring rather than administrative management.

---

## CORE COMPETENCIES
* **Backend & Platform:** Temporal, Node.js, TypeScript, Nest.js, Express, GraphQL
* **Architecture:** DDD, Hexagonal/Clean Architecture, System Audits, Roadmapping
* **Frontend**: React, TypeScript, Redux
* **Data & Infrastructure:** PostgreSQL, Redis, Docker, Terraform, AWS (application level)
* **Leadership:** Engineering Standards, Incident Management, Team Mentorship
* **AI-Assisted Development:** Orchestrate AI coding agents for correctness and maintainability: clear specs, technical ADRs, specialist reviewer agents, and critical human ownership of the result.

---

## EXPERIENCE

### SweatPals — Staff Engineer (Contract) | Jul 2025 – Nov 2025
First Staff Engineer at an a16z-backed Series A fitness platform, brought in to stabilize the platform and set technical direction.

* **Platform & Architecture**: Defined the new Platform team's remit and a roadmap to simplify the architecture toward a modular monolith, reducing cognitive load for product engineers.
* **Incident & Security**: Technical lead during major security incidents (including a PII exposure issue); designed the company's first production incident-response process.
* **Engineering Standards:**  Introduced blameless post-mortems and "5 Whys" reviews to shift the team toward root-cause analysis.

**Stack:** Node.js, TypeScript, Nest.js, BullMQ, AWS

---

### Yum! Brands — Principal Software Engineer (Contract) | Jul 2022 – May 2025
Joined to consolidate PHDV's commerce work into Yum Connect, the platform behind KFC, Pizza Hut, Taco Bell and Habit Burger. Started by extending the US-first platform for international markets with GIS-based delivery zones, then moved to the global payments team.

* **Payment Provider Integration:** Led discovery and design of the CyberSource and Adyen 3DS authorization flows, including undocumented provider behaviour, and implemented them across the GraphQL service and the published browser SDK.
* **Distributed State Management:** Built the Temporal workflows resolving pending authorizations and charges, keeping payments consistent across distributed services during provider outages and delayed 3DS callbacks.
* **Platform Enablement:** Maintained the team's forked CyberSource Node client and built the mock provider service, letting the payments team run integrations locally and in CI without processor credentials.
* **Cross-Market Support:** Worked with regional engineering teams to integrate market-specific requirements and payment configuration across 16 brand organizations.

**Stack:** Node.js, TypeScript, GraphQL (Apollo Federation), Temporal, PostgreSQL, Redis, AWS

---

### Pizza Hut Digital Ventures — Principal Software Engineer (Contract) | Jun 2019 – Jul 2022
*Progression: Senior Software Engineer → Technical Lead → Principal Software Engineer*

* **Principal Engineer:** Led architecture discovery for the Menu domain of a platform intended to consolidate PHDV's two legacy estates, Reactor (UK, Canada, India, France) and GMS (Asia and LATAM), modelling catalog, pricing, availability and stock on a shared rule engine flexible
enough to serve both. Drove the architecture documentation presented to Yum leadership that informed the decision to consolidate onto Yum Connect, then built the first lambdas migrating menu data across.
* **Technical Lead:** Lead developer for the UK market platform. Balanced the delivery of new customer features with the continuous cleanup of technical debt to keep the codebase maintainable.
* **Senior Software Engineer:** Expanded the event-driven order platform with partner integrations, permission models and public-key authentication for third-party channels. Selected for on-site activation in India to handle the technical integration and regional requirements for a successful market launch.

**Stack**: Node.js, TypeScript, React, Nest.js, GraphQL, PostgreSQL, AWS

---

### ENGINE Transformation — Senior Engineer (Contract) | Feb 2019 – Jun 2019
Senior engineer on a UK government marine project, modernizing legacy Node.js services into a cloud-native architecture for improved reliability and deployment speed.

### Red Badger — Senior Software Engineer | Jun 2017 – Feb 2019
Consulted for Tier-1 UK banks (HSBC and Santander), building secure, high-performance applications in regulated financial environments.

* **Open Banking APIs**: Implemented Open Banking API specifications for Santander UK using Java / Spring Boot, building secure, compliant financial APIs to the UK's mandated regulatory standard.
* **Enterprise Integration:** Built microservices that connected modern front-end applications with legacy banking systems, including DB2 databases and LDAP security protocols.
* **Platform Mentorship:** Set up CI/CD pipelines and mentored the client’s internal engineering teams to ensure they could maintain and scale the platform after our engagement ended.

### Early Engineering Foundation | 2010 – 2017
Focused on systems engineering, relational database design, and full-stack development across various industries at **Globant**, **Southworks**, **Making Sense**, **Contentment**, and **FarmDrop**.

---

## SELECTED PROJECTS

### [Foco](https://focofeed.com) — Personal Project | Apr 2026 – Present
Offline-first wedding-photo PWA for 80 guests at a venue with no Wi-Fi, built with an AI-agent workflow I designed.

* **Governed AI Development:** Defined the architecture rulebook, modular standards and an ADR-gated feature lifecycle; agents implement against committed ADRs and I review every diff, tightening the ADR when output deviates rather than patching around it. CI gates every change: typecheck → lint → Vitest → Playwright E2E.
* **Architecture Decisions:** Migrated binary storage from Supabase to Cloudflare R2 after exceeding the free-tier cached-egress quota, with presigned uploads, idempotent retries and edge-cached feeds; profiled page-load (LCP) and upload-flow timings on slow 4G and set performance budgets from the measured baselines.

**Stack:** React, TypeScript, Vercel Functions, Supabase, Cloudflare R2, Dexie (IndexedDB)

---

## EDUCATION & TECHNICAL KNOWLEDGE
* **Systems Engineering** — National University of Central Buenos Aires (UNICEN), Argentina
* **Additional Tech:** React, Redux, CI/CD (GitHub Actions), Monitoring (Datadog), Testing (Jest, Cypress)