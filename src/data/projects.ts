import type { Project } from '../types';

// Curated Top 5 Flagship Projects — every entry demonstrates real architecture,
// rigorous evaluation/testing, and production security/deployment.
// Keep `id` before `links.github` in each entry — scripts/update-stats.cjs pairs them by regex.
export const projects: Project[] = [
  {
    id: 'epiadr-net',
    title: 'EpiADR-Net',
    tagline: 'Organ-specific adverse drug reaction prediction with graph transformers',
    problem:
      'Drug side-effect models usually predict one global risk, but adverse reactions depend on the organ exposed — and random train/test splits leak near-identical molecules, inflating scores.',
    solution:
      'A research platform that conditions a 12-layer Graph Transformer over each molecular graph on 1024-dim GTEx organ transcriptomic profiles to predict organ-specific adverse drug reactions. Evaluated on a 5-fold Bemis–Murcko scaffold split with zero structural leakage (Macro AUROC 0.742 ± 0.031), with Monte Carlo dropout for uncertainty and GAT attention maps that highlight the substructures behind a prediction. Served as a FastAPI REST service, a Streamlit dashboard and a live Gradio app on Hugging Face Spaces, backed by a pytest suite.',
    contributions:
      'Tissue-conditioned model design, scaffold-split evaluation, FastAPI / Streamlit / Gradio interfaces and the Hugging Face deployment.',
    category: 'ml',
    highlights: ['AUROC 0.742', 'Scaffold split', 'Live on HF Spaces'],
    tech: ['PyTorch', 'RDKit', 'FastAPI', 'Streamlit', 'Gradio', 'pytest'],
    links: {
      github: 'https://github.com/ADjayantan/EpiADR-Net',
      demo: 'https://huggingface.co/spaces/jayantan/EpiADR-Net',
    },
    accent: '#38bdf8',
  },
  {
    id: 'signbridge',
    title: 'SignBridge',
    tagline: 'On-device sign & voice AI assistant for Deaf and blind users',
    problem:
      'Most assistants assume users can type, hear and see. Deaf users need to sign to them; blind users need hands-free speech in and out, in their own language.',
    solution:
      'Sign mode tracks 21 landmarks per hand on-device with MediaPipe (WebAssembly), turns them into rotation- and distance-invariant features, and recognises built-in gestures plus user-taught signs with a k-NN classifier (per-sign rejection thresholds, 0.7 s smoothing) before Gemini turns the words into a sentence and a reply. Voice mode streams answers into speech sentence by sentence. Measured on HaGRID photos of unseen people: 91% on built-in gestures and 95% on taught signs. Installable PWA in six languages including Tamil, with 52 unit tests and zero axe-core accessibility violations.',
    contributions:
      'Landmark feature extraction, k-NN classifier and smoother, the streaming voice loop, and a server-side Gemini proxy that keeps the API key off the client.',
    category: 'ml',
    highlights: ['95% on taught signs', '6 languages', '52 unit tests'],
    tech: ['React 19', 'MediaPipe', 'k-NN', 'Gemini API', 'Web Speech API', 'PWA'],
    links: {
      github: 'https://github.com/ADjayantan/signbridge-',
    },
    accent: '#a5d8ff',
  },
  {
    id: 'genezenz',
    title: 'Genezenz Pharmacy',
    tagline: 'Server-rendered pharmacy platform with HMAC webhooks and hybrid recommendations',
    problem:
      'The original vanilla-JS store rendered products client-side, so Google saw an empty shell, and leads from the website, WhatsApp, Facebook and Instagram landed in four different apps.',
    solution:
      'A server-rendered rebuild of a real pharmacy store: catalogue, cart, checkout, prescription upload, accounts and an admin panel, with per-page metadata, JSON-LD, a database-generated sitemap and local-area landing pages. A Meta lead-ads webhook (HMAC-SHA256 signature check, async processing, dedupe) feeds one admin inbox alongside website and WhatsApp leads. Recommendations blend TF-IDF cosine similarity with co-purchase signals under pharmacy safety rules that keep prescription drugs out of cross-sells. Prices come from the database, stock updates are transactional, and uploads are validated by magic bytes.',
    contributions:
      'v2 rebuild end to end — Prisma schema, API routes and server actions, the webhook, the recommendation engine and security hardening — after earlier Node/Express/MongoDB and PHP/MySQL versions.',
    category: 'backend',
    highlights: ['HMAC-SHA256 webhook', 'TF-IDF recommender', 'SSR + JSON-LD'],
    tech: ['Next.js 15', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
    links: {
      github: 'https://github.com/ADjayantan/Genezene-pharmacy',
    },
    accent: '#38bdf8',
  },
  {
    id: 'leetflow',
    title: 'LeetFlow',
    tagline: 'Windows desktop system tray app automating daily DSA practice & spaced repetition',
    problem:
      'A daily DSA habit breaks the moment one session is missed, and plain to-do apps cannot tell whether a problem was actually solved.',
    solution:
      'A tray app that opens LeetCode at scheduled times and catches up on missed slots after the PC was off or asleep, without ever opening the same slot twice. It syncs accepted submissions over LeetCode\'s public GraphQL API to tick tasks automatically, and adds a streak heatmap, a 3/7/21-day revision queue, contest reminders and roadmap trees from offline templates or any LLM provider, with API keys encrypted through Windows DPAPI. Seven pinnable desktop widgets, 89 unit tests and an NSIS installer.',
    contributions:
      'Scheduler and catch-up logic, LeetCode sync with auto-tick, and the pinnable widget window system.',
    category: 'backend',
    highlights: ['89 unit tests', 'DPAPI key encryption', 'NSIS installer'],
    tech: ['Electron', 'React 19', 'TypeScript', 'Tailwind CSS', 'Vitest'],
    links: {
      github: 'https://github.com/ADjayantan/leetflow',
    },
    accent: '#a5d8ff',
  },
  {
    id: 'vaithiyam',
    title: 'Iyarkai Nala Maruthuvamanai',
    tagline: 'Bilingual Tamil/English Siddha & Ayurveda platform with Rx-gated checkout and Groq AI',
    problem:
      'Traditional-medicine stores rarely work in Tamil, and selling remedies online needs guardrails — prescription checks and no diagnosis or dosage advice.',
    solution:
      'Bilingual Tamil and English e-commerce for Siddha, Ayurveda and natural medicine: catalogue, cart, prescription-aware checkout (Rx-gated items need an upload first), barcode scanner, order history and a full admin panel. A Supabase repository layer falls back to an in-memory store for local development, auth uses jose JWTs in HTTP-only cookies, Razorpay is scaffolded, and "Agasthiyan", a Groq-powered assistant, runs server-side with rate limiting.',
    contributions:
      'Storefront, admin panel, Supabase data layer and the server-side AI assistant.',
    category: 'backend',
    highlights: ['Rx-gated checkout', 'HTTP-only JWT auth', 'Live on Vercel'],
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Supabase', 'Zustand'],
    links: {
      github: 'https://github.com/ADjayantan/vaithiyam-web',
      demo: 'https://vaithiyam-web.vercel.app/',
    },
    accent: '#38bdf8',
  },
];
