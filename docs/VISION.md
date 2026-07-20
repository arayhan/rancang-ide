# Vision — Rancang Ide

> Captured by the Product Planner skill. This file is the source of truth for
> generating product-vision.md, prd.md, and product-roadmap.md. Edit it directly
> and re-run the Product Planner to regenerate downstream documents.

**Created:** 2026-07-20
**Updated:** 2026-07-20 (founder details from CV)

## Founder

- **Name:** Ahmed Rayhan Primadedas (Rayhan)
- **Expertise:** Frontend Engineer, 7+ years, specializing in React & Next.js. Currently at Badr Interactive (Depok, since August 2022); previously led frontend at Anify LLC (US edtech startup, managing a team of 3 engineers across US–Indonesia timezones). Built national-scale systems (SMILE for Indonesia's Ministry of Health, UNDP, UNICEF/UNICC). Strong in Feature-Driven Development + Domain-Driven Design, design systems (Radix UI), CI/CD (cut hosting costs by 71%), and React Native. AI-augmented development experience: Claude Code, Codex, local model deployment (Ollama), LLM evaluation. Organizer of Google Developer Groups Depok (1,800+ member community) and a regular technical speaker (10+ talks on frontend & Firebase).
- **Background:** As a senior frontend engineer who routinely builds side projects with AI coding agents (Claude Code, Codex), Rayhan repeatedly hit the same pattern: ideas executed without product thinking, scope drifting, AI credits burned, projects dying halfway. Rancang Ide is built first and foremost as a personal tool to force himself (and similar builders) to validate + spec ideas before coding — with a freemium path to side income. The product architecture (layered + feature-driven + DDD) and stack (Next.js, React Native, Vercel, CI/CD) sit exactly in his zone of expertise, making iteration speed a real advantage.

## Purpose

- **Who you help:** Solo developers & indie hackers in Indonesia who already use AI coding agents (Claude Code, Cursor), have a backlog of side-project ideas, and have experienced a project dying from lack of direction.
- **Problem you solve:** Builders skip the ideation–validation–spec stage. They jump straight into coding or chat ad-hoc with ChatGPT/Claude — the output is scattered, unstructured, non-persistent, and never questions whether the idea is worth building. The result: scope creep, unneeded features, wasted time & money.
- **Desired transformation:** From "build now, think later, then drift" → to every idea passing through an honest validation gate, then emerging as a blueprint (PRD + tasks) an AI coding agent can execute directly.
- **Why you:** The founder is his own target user (zero guessing about the pain), his React/Next.js + DDD/feature-driven expertise is exactly the stack & architecture used, and — crucially — he has a real distribution channel via GDG Depok (1,800+ members) plus public-speaking & build-in-public experience. Iteration speed + community access are the unfair advantage. Worst case, the product fails as a business but still becomes a personal tool + portfolio that strengthens his personal brand.

## Product

- **Name:** Rancang Ide
- **One-liner:** Rancang Ide turns raw ideas into product blueprints that are validated first, then generated into a PRD and task breakdown ready to use for an AI coding agent.
- **How it works:** The user writes a 2–3 sentence idea. The AI runs a validation report (core assumption, fatal flaws, competition map, scorecard, verdict). If it's worth continuing, the AI generates an editable feature tree, then composes a PRD and a checkbox task breakdown that can be exported as markdown or copied as a prompt for Claude Code. Every project is saved and reopenable.
- **Key capabilities:**
  - Validation report generator (verdict strong/weak/pivot, fatal flaws, competition map)
  - Feature tree editor (collapsible, editable, tag phases MVP/v2/later)
  - PRD generator (markdown, per project)
  - Task breakdown generator (checkbox, ready for an AI coding agent)
  - Export markdown + "Copy prompt for Claude Code"; project history & persistence
- **Platform:** web
- **Market differentiation:** Validation-first, not generation-first. Competitors (ngodingpakeai, ChatPRD, Keeborg) focus on writing PRDs; Rancang Ide dares to say "the idea is weak, don't build it" before writing a single line of PRD. Plus per-project persistence and export optimized for AI coding agents, with local context & language (Indo/English).
- **Magic moment:** The user types a 2-sentence idea → within ±2 minutes gets an honest validation report (3 fatal flaws + verdict) and a draft feature tree that can be edited straight into a PRD.

## Audience

- **Primary user:** Solo dev / indie hacker in Indonesia, ~22–35, already uses Claude Code/Cursor, has several side-project ideas in their head, has built a project that stalled from lack of a spec. The founder himself is persona #1.
- **Secondary users:**
  - Pre-product technical founder who needs to validate + spec ideas quickly
  - Developer at an agency/software house who needs to draft a PRD/BRD quickly for internal use or clients
- **Current alternatives:** Coding straight without a spec (most common); ad-hoc chat with ChatGPT/Claude; ngodingpakeai; ChatPRD; Notion PRD templates.
- **Frustrations:** Open chat is scattered & non-persistent; other PRD generators write immediately without validating whether the idea is worth it; nothing is optimized for handoff to an AI coding agent with local context.

## Business

- **Revenue model:** freemium
- **90-day goal:** The founder uses it himself for 3 real ideas end-to-end without defecting to direct chat; 50 waitlist/early users from build-in-public; 10 external people run the pipeline to completion.
- **6-month vision:** A public product with active free + Pro tiers, a few first Pro customers as side income, recognized in the Indonesian dev/AI-coding community via build-in-public.
- **Constraints:** Built solo, part-time, alongside a full-time job. Small budget (prefer free tiers: Vercel, Supabase). Strong in frontend (React/Next.js), moderate backend — hence a managed backend (Supabase) & serverless. Founder has ADHD — needs small scope, one magic moment, avoid yak-shaving.
- **Go-to-market:** Build-in-public on X/Threads/LinkedIn (content = your own idea's validation report, including honest "weak" verdicts). Leverage the GDG Depok network (1,800+ members) & the founder's speaking platform for demos and early users. Share case studies in Indonesian dev/AI-coding communities. Dogfooding as social proof.

## Brand Voice

- **Personality:** An honest, realistic sparring partner — a dev friend who doesn't just agree, but dares to point out the gaps in your idea, with reasons. Not a cheerleader, not corporate. Casual bilingual Indo-English (gw-lu vibe in marketing, neutral in-product).
- **Tone of voice:** Clear, opinionated, without excessive jargon. Example verdict: "This idea is weak — 3 of 5 people would just use free ChatGPT. Here's why." Example success: "Blueprint ready. 8 modules, 24 tasks. Copy to Claude Code or edit first."

> Visual identity (mood, anti-patterns, design tokens) is deliberately not
> captured here — it lives in docs/design.md, generated by the Design System
> skill from image references.

## Tech Stack

- **App type:** web
- **Frontend:** Next.js (App Router) — the founder is an expert here, largest ecosystem, best AI coding tool support, deploys smoothly to Vercel.
- **Backend:** Next.js API routes / Route Handlers (serverless on Vercel) — one repo, no separate server, economical for a solo builder.
- **Database:** Supabase Postgres via Drizzle ORM — real Postgres, controlled migrations via Drizzle, adequate free tier.
- **Auth:** Supabase Auth — already bundled with the DB, supports email + Google OAuth, minimal setup.
- **Payments:** None (phase 1) — freemium with a paywall stub (3-project quota) first; a payment gateway (Lemon Squeezy/Polar for global, Midtrans/Xendit for local) enters phase 2 when monetization is activated.
- **Analytics:** PostHog — free tier covers early volume, funnel & event tracking to measure activation/retention.
- **Email:** Resend — transactional email (verification, notifications) that fits the Next.js stack cleanly.
- **Error tracking:** Sentry — catch production errors before users report them.
- **AI:** Vercel AI SDK (provider-agnostic) — default Google Gemini (Flash for cheap drafts) + Claude option for "deep" validation. Structured output via zod schema (streamObject), server-side only.

## Tooling

- **Coding agent:** Claude Code
