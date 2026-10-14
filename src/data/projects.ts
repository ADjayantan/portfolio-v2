import type { Project } from '../types';

// Every description below is sourced from the project's own README (Oct 2026).
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
    tech: ['PyTorch', 'RDKit', 'FastAPI', 'Streamlit', 'Gradio', 'pytest'],
    links: {
      github: 'https://github.com/ADjayantan/EpiADR-Net',
      demo: 'https://huggingface.co/spaces/jayantan/EpiADR-Net',
    },
    accent: '#a78bfa',
  },
  {
    id: 'signbridge',
    title: 'SignBridge',
    tagline: 'AI assistant that Deaf and blind users can sign or speak to',
    problem:
      'Most assistants assume users can type, hear and see. Deaf users need to sign to them; blind users need hands-free speech in and out, in their own language.',
    solution:
      'Sign mode tracks 21 landmarks per hand on-device with MediaPipe (WebAssembly), turns them into rotation- and distance-invariant features, and recognises built-in gestures plus user-taught signs with a k-NN classifier (per-sign rejection thresholds, 0.7 s smoothing) before Gemini turns the words into a sentence and a reply. Voice mode streams answers into speech sentence by sentence. Measured on HaGRID photos of unseen people: 91% on built-in gestures and 95% on taught signs. Installable PWA in six languages including Tamil, with 52 unit tests and zero axe-core accessibility violations.',
    contributions:
      'Landmark feature extraction, k-NN classifier and smoother, the streaming voice loop, and a server-side Gemini proxy that keeps the API key off the client.',
    tech: ['React 19', 'MediaPipe', 'k-NN', 'Gemini API', 'Web Speech API', 'PWA'],
    links: {
      github: 'https://github.com/ADjayantan/signbridge-',
    },
    accent: '#f59e0b',
  },
  {
    id: 'genezenz',
    title: 'Genezenz Pharmacy',
    tagline: 'SEO-first pharmacy platform with a unified lead inbox and smart recommendations',
    problem:
      'The original vanilla-JS store rendered products client-side, so Google saw an empty shell, and leads from the website, WhatsApp, Facebook and Instagram landed in four different apps.',
    solution:
      'A server-rendered rebuild of a real pharmacy store: catalogue, cart, checkout, prescription upload, accounts and an admin panel, with per-page metadata, JSON-LD, a database-generated sitemap and local-area landing pages. A Meta lead-ads webhook (HMAC-SHA256 signature check, async processing, dedupe) feeds one admin inbox alongside website and WhatsApp leads. Recommendations blend TF-IDF cosine similarity with co-purchase signals under pharmacy safety rules that keep prescription drugs out of cross-sells. Prices come from the database, stock updates are transactional, and uploads are validated by magic bytes.',
    contributions:
      'v2 rebuild end to end — Prisma schema, API routes and server actions, the webhook, the recommendation engine and security hardening — after earlier Node/Express/MongoDB and PHP/MySQL versions.',
    tech: ['Next.js 15', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
    links: {
      github: 'https://github.com/ADjayantan/Genezene-pharmacy',
    },
    accent: '#0d9488',
  },
  {
    id: 'spam-sms',
    title: 'SMS Spam Detection',
    tagline: 'NLP classifier · 98.3% accuracy · CodSoft ML internship',
    problem:
      'A spam filter has to catch scams without burying real messages — and those two mistakes do not cost the same.',
    solution:
      'TF-IDF over unigrams and bigrams, with URLs, emails, phone numbers and amounts replaced by placeholder tokens instead of deleted, and stopwords deliberately kept because words like "free", "call" and "now" carry the spam signal. Multinomial Naive Bayes, Logistic Regression and Linear SVC were compared on 5-fold cross-validated F1; Linear SVC won with 98.3% accuracy, 94.5% precision and 91.6% recall. Shipped as a Streamlit app with bulk CSV scanning and an adjustable decision threshold, covered by 61 pytest tests.',
    contributions:
      'Task 4 of the CodSoft Machine Learning internship: preprocessing, model selection, the Streamlit app and the test suite.',
    tech: ['Python', 'scikit-learn', 'TF-IDF', 'Streamlit', 'pytest'],
    links: {
      github: 'https://github.com/ADjayantan/codsoft_tasks',
    },
    accent: '#4ade80',
  },
  {
    id: 'leetflow',
    title: 'LeetFlow',
    tagline: 'Windows desktop app that runs the daily DSA routine',
    problem:
      'A daily DSA habit breaks the moment one session is missed, and plain to-do apps cannot tell whether a problem was actually solved.',
    solution:
      'A tray app that opens LeetCode at scheduled times and catches up on missed slots after the PC was off or asleep, without ever opening the same slot twice. It syncs accepted submissions over LeetCode\'s public GraphQL API to tick tasks automatically, and adds a streak heatmap, a 3/7/21-day revision queue, contest reminders and roadmap trees from offline templates or any LLM provider, with API keys encrypted through Windows DPAPI. Seven pinnable desktop widgets, 89 unit tests and an NSIS installer.',
    contributions:
      'Scheduler and catch-up logic, LeetCode sync with auto-tick, and the pinnable widget window system.',
    tech: ['Electron', 'React 19', 'TypeScript', 'Tailwind CSS', 'Vitest'],
    links: {
      github: 'https://github.com/ADjayantan/leetflow',
    },
    accent: '#facc15',
  },
  {
    id: 'fraud-detection',
    title: 'Credit Card Fraud Detection',
    tagline: 'Imbalanced-data classification with SMOTE · CodSoft ML internship',
    problem:
      'Fraud is a tiny fraction of card transactions, so a model can score high accuracy by calling everything genuine and still miss every fraud.',
    solution:
      'SMOTE oversamples the minority class during training only, and Logistic Regression and Random Forest are compared on precision, recall and F1 rather than accuracy — Random Forest won. The best model is serialised with a confusion-matrix report, and a Streamlit dashboard scores transactions in real time with confidence values.',
    contributions:
      'Task 5 of the CodSoft Machine Learning internship: preprocessing, resampling, model comparison and the dashboard.',
    tech: ['Python', 'scikit-learn', 'imbalanced-learn', 'Pandas', 'Streamlit'],
    links: {
      github: 'https://github.com/ADjayantan/CODESOFT_TASK5',
    },
    accent: '#f472b6',
  },
  {
    id: 'smart-asset',
    title: 'Smart Asset Monitor',
    tagline: 'QR-linked monitoring for an organisation\'s 1,500 systems',
    problem:
      'An organisation head has no single view of the condition of 1,500 systems, and people who spot a fault have no quick way to report it against the right machine.',
    solution:
      'An executive overview with condition totals, critical systems, department health and a 421-task maintenance queue, plus a searchable inventory with CSV export. Every system gets a real QR code: visitors scan it to report an issue without logging in, while staff land on the full admin record. The React frontend and Express API share TypeScript models in a monorepo, with a service worker and cached records for low-connectivity use.',
    contributions:
      'Dashboard, inventory, QR tag manager and public scan flow, plus the Express API contract for the database phase.',
    tech: ['React', 'TypeScript', 'Express', 'QR Codes', 'Service Worker'],
    links: {
      github: 'https://github.com/ADjayantan/Smart-asset',
      demo: 'https://adjayantan.github.io/Smart-asset/',
    },
    accent: '#22d3ee',
  },
  {
    id: 'devtrack',
    title: 'DevTrack v3',
    tagline: 'MERN learning tracker with JWT authentication',
    problem:
      'Learning logs scattered across notes make it hard to see streaks, weekly effort and progress against a roadmap.',
    solution:
      'A full-stack dashboard for daily learning logs, streaks and roadmap milestones. Express REST API with Mongoose models, JWT and bcrypt authentication, protected routes, express-validator input checks and centralised error handling; React + Vite client with a custom SVG weekly-activity chart. API on Render, client on Vercel.',
    contributions:
      'REST API and data models, the auth flow, streak calculation and the two-tier deployment.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    links: {
      github: 'https://github.com/ADjayantan/devtrack-v3',
      demo: 'https://devtrack-v3.vercel.app/dashboard',
    },
    accent: '#0284c7',
  },
  {
    id: 'vaithiyam',
    title: 'Iyarkai Nala Maruthuvamanai',
    tagline: 'Tamil-first Siddha & Ayurveda store with an AI assistant (formerly Vaithiyam)',
    problem:
      'Traditional-medicine stores rarely work in Tamil, and selling remedies online needs guardrails — prescription checks and no diagnosis or dosage advice.',
    solution:
      'Bilingual Tamil and English e-commerce for Siddha, Ayurveda and natural medicine: catalogue, cart, prescription-aware checkout (Rx-gated items need an upload first), barcode scanner, order history and a full admin panel. A Supabase repository layer falls back to an in-memory store for local development, auth uses jose JWTs in HTTP-only cookies, Razorpay is scaffolded, and "Agasthiyan", a Groq-powered assistant, runs server-side with rate limiting.',
    contributions:
      'Storefront, admin panel, Supabase data layer and the server-side AI assistant.',
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Supabase', 'Zustand'],
    links: {
      github: 'https://github.com/ADjayantan/vaithiyam-web',
      demo: 'https://vaithiyam-web.vercel.app/',
    },
    accent: '#d97706',
  },
];
