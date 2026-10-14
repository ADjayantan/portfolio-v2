"""Build public/Jayantan_AD_Resume.pdf (one page, A4).

    pip install reportlab
    python3 scripts/build_resume.py

LeetCode numbers are read from src/data/stats.ts, so re-run this after the
daily stats job to keep the resume in sync with the site. Everything else is
plain data below — edit it, re-run, commit the PDF.

Fonts are the built-in Helvetica family (ATS-friendly). They only cover
WinAnsi glyphs, so stick to · — – ± × in text: no arrows or emoji.
"""
import json
import re
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'Jayantan_AD_Resume.pdf'
STATS = (ROOT / 'src' / 'data' / 'stats.ts').read_text(encoding='utf-8')
lc = json.loads(re.search(r'export const leetcodeStats: \w+ = (\{[\s\S]*?\n\})', STATS).group(1))

def badge_text(names):
    m = [re.fullmatch(r'(\d+) Days Badge (\d{4})', n) for n in names]
    if names and all(m) and len({x.group(2) for x in m}) == 1:
        days = sorted(int(x.group(1)) for x in m)
        return ' & '.join(map(str, days)) + f' Days Badge{"s" if len(days) > 1 else ""} {m[0].group(2)}'
    return ', '.join(names)


INK, MUTED, RULE, LINK = HexColor('#111111'), HexColor('#555555'), HexColor('#9a9a9a'), HexColor('#1d4ed8')


def esc(s: str) -> str:
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def link(url: str, label: str | None = None) -> str:
    return f'<a href="{url}"><font color="#1d4ed8">{esc(label or url.split("//", 1)[-1])}</font></a>'


# ── styles ────────────────────────────────────────────────────────────────────
name_st = ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=21, leading=24, textColor=INK)
sub_st = ParagraphStyle('sub', fontName='Helvetica', fontSize=9.4, leading=12, textColor=MUTED)
contact_st = ParagraphStyle('contact', fontName='Helvetica', fontSize=8.3, leading=11, textColor=MUTED)
head_st = ParagraphStyle('head', fontName='Helvetica-Bold', fontSize=9.6, leading=11, textColor=INK, spaceBefore=5)
body_st = ParagraphStyle('body', fontName='Helvetica', fontSize=8.6, leading=10.8, textColor=INK)
title_st = ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=INK)
right_st = ParagraphStyle('right', fontName='Helvetica-Oblique', fontSize=8, leading=11, textColor=MUTED, alignment=TA_RIGHT)
meta_st = ParagraphStyle('meta', fontName='Helvetica', fontSize=8, leading=10, textColor=MUTED)
bullet_st = ParagraphStyle('bullet', parent=body_st, leftIndent=11, bulletIndent=2, spaceBefore=0.8)

W = A4[0] - 2 * 38 - 12  # frame inner width (SimpleDocTemplate frames pad 6pt per side)


def section(title: str):
    return [
        Paragraph(title.upper(), head_st),
        HRFlowable(width='100%', thickness=0.6, color=RULE, spaceBefore=1.5, spaceAfter=2.5),
    ]


def row(left: str, right: str = ''):
    t = Table([[Paragraph(left, title_st), Paragraph(right, right_st)]], colWidths=[W * 0.6, W * 0.4])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    return t


def bullets(items):
    return [Paragraph(esc(b), bullet_st, bulletText='•') for b in items]


def entry(title, right, meta=None, points=(), gap=4):
    out = [row(title, right)]
    if meta:
        out.append(Paragraph(meta, meta_st))
    out += bullets(points)
    out.append(Spacer(1, gap))
    return out


# ── content ───────────────────────────────────────────────────────────────────
story = [
    Paragraph('JAYANTAN AD', name_st),
    Spacer(1, 2),
    Paragraph(esc('ML & Backend Developer  ·  Python · Java · Node.js · FastAPI  ·  Software Engineer Intern @ Havonz Technologies'), sub_st),
    Spacer(1, 2),
    Paragraph('  |  '.join([
        link('mailto:adjayantan2007@gmail.com', 'adjayantan2007@gmail.com'),
        'Coimbatore, India',
        link('https://github.com/ADjayantan'),
        link('https://www.linkedin.com/in/ad-jayantan-766886320/', 'linkedin.com/in/ad-jayantan-766886320'),
        link('https://leetcode.com/u/jayantan/', 'leetcode.com/u/jayantan'),
        link('https://huggingface.co/jayantan', 'huggingface.co/jayantan'),
        link('https://adjayantan.github.io/portfolio-v2/', 'adjayantan.github.io/portfolio-v2'),
    ]), contact_st),
]

story += section('Summary')
story.append(Paragraph(esc(
    'Third-year B.E. CSE student at VSB College of Engineering and Technical Campus and Software Engineer Intern at '
    'Havonz Technologies. Builds ML pipelines in Python (scikit-learn, PyTorch) and backend services in Node.js, '
    f'Express and FastAPI; practises DSA daily in Java ({lc["total"]} LeetCode problems). Seeking ML, backend and SDE internships.'),
    body_st))

story += section('Education')
story += entry('B.E. Computer Science and Engineering', 'Sep 2024 – May 2028',
               esc('VSB College of Engineering and Technical Campus, Coimbatore  ·  Currently in 3rd year'), gap=1)

story += section('Experience')
story += entry('Software Engineer Intern — Havonz Technologies', 'Mar 2026 – Present', 'Remote  ·  Coimbatore')
story += entry('Machine Learning Intern (Virtual) — CodSoft', 'Sep 2026', None, [
    'SMS spam detection: TF-IDF unigrams + bigrams with placeholder tokens; compared Naive Bayes, Logistic Regression '
    'and Linear SVC on 5-fold cross-validated F1 — Linear SVC reached 98.3% accuracy and 93.0% F1. Streamlit app with '
    'bulk CSV scanning and an adjustable threshold; 61 pytest tests.',
    'Credit-card fraud detection on highly imbalanced data: SMOTE oversampling on the training split only; Random Forest '
    'beat Logistic Regression on precision, recall and F1; real-time Streamlit scoring dashboard.',
], gap=1)

story += section('Projects')
projects = [
    ('EpiADR-Net — organ-specific adverse drug reaction prediction', 'PyTorch · RDKit · FastAPI · Streamlit · Gradio',
     [('https://github.com/ADjayantan/EpiADR-Net', None), ('https://huggingface.co/spaces/jayantan/EpiADR-Net', 'live demo on Hugging Face')],
     ['Conditions a 12-layer Graph Transformer over molecular graphs on 1024-dim GTEx organ transcriptomic profiles; '
      'Macro AUROC 0.742 ± 0.031 on a 5-fold Bemis–Murcko scaffold split with zero structural leakage.',
      'Monte Carlo dropout uncertainty and GAT attention explanations; served through FastAPI, a Streamlit dashboard and a '
      'Gradio app on Hugging Face Spaces, backed by a pytest suite.']),
    ('SignBridge — AI assistant for Deaf and blind users', 'React 19 · MediaPipe · k-NN · Gemini API · PWA',
     [('https://github.com/ADjayantan/signbridge-', None)],
     ['On-device hand tracking (21 landmarks per hand) turned into rotation- and distance-invariant features; k-NN for '
      'user-taught signs with per-sign rejection thresholds — 95% on taught signs, 91% on built-in gestures for unseen people (HaGRID).',
      'Streaming voice mode with sentence-level speech, server-side Gemini proxy, six languages, installable PWA; '
      '52 unit tests and 0 axe-core accessibility violations.']),
    ('Genezenz Pharmacy v2 — SEO-first pharmacy platform', 'Next.js 15 · TypeScript · Prisma · PostgreSQL',
     [('https://github.com/ADjayantan/Genezene-pharmacy', None)],
     ['Server-rendered store with JSON-LD, a database-generated sitemap and local landing pages; Meta lead-ads webhook with '
      'HMAC-SHA256 verification and dedupe feeding one admin lead inbox.',
      'TF-IDF cosine-similarity + co-purchase recommendations under prescription-safety rules; server-side pricing, '
      'transactional stock updates, magic-byte upload validation and rate limiting.']),
    ('LeetFlow — desktop app for a daily DSA routine', 'Electron · React 19 · TypeScript · Vitest',
     [('https://github.com/ADjayantan/leetflow', None)],
     ['Windows tray app that opens LeetCode on a schedule with catch-up after sleep or shutdown, syncs submissions through '
      "LeetCode's GraphQL API to auto-tick tasks and runs a 3/7/21-day revision queue; 89 unit tests, NSIS installer."]),
    ('DevTrack v3 — MERN learning tracker', 'React · Node.js · Express · MongoDB · JWT',
     [('https://github.com/ADjayantan/devtrack-v3', None)],
     ['REST API with JWT + bcrypt auth, protected routes, express-validator input checks and centralised error handling; '
      'API on Render, client on Vercel.']),
]
for title, tech, links, points in projects:
    story += entry(esc(title), esc(tech), '  ·  '.join(link(u, l) for u, l in links), points, gap=3)

story += section('Technical Skills')
for label, items in [
    ('Languages', 'Java · Python · TypeScript / JavaScript · SQL'),
    ('ML & Data', 'scikit-learn · PyTorch · Pandas · NumPy · imbalanced-learn · Streamlit · Gradio · MediaPipe'),
    ('Backend & DB', 'Node.js · Express · FastAPI · REST APIs · JWT auth · Prisma · MongoDB · PostgreSQL / Supabase · MySQL'),
    ('Frontend & Tools', 'React · Next.js · Tailwind CSS · Electron · Git · GitHub Actions · pytest · Vitest · Vercel · Render'),
    ('CS Fundamentals', 'Data Structures & Algorithms · OOP · DBMS · Operating Systems'),
]:
    story.append(Paragraph(f'<b>{esc(label)}:</b> {esc(items)}', body_st))

story += section('Achievements & Certifications')
story += bullets([
    f'LeetCode: {lc["total"]} solved ({lc["easy"]} Easy · {lc["medium"]} Medium · {lc["hard"]} Hard), {lc["javaSolved"]} in Java · '
    f'contest rating {lc["contestRating"]} (top {lc["topPercentage"]}%) · {lc["maxStreak"]}-day max streak · {badge_text(lc["badgeNames"])}.',
    'Hackathons: Smart India Hackathon 2026 — Team PRAGYAN_7 nominated with ARIA, an AI classroom companion · Global Innovation '
    'Hackathon 2026 (Bharat Academix × Unstop) · JCT SDG Hackathon 2026 — GigGuard · Hack Devenger 2.0.',
    'Certifications: HackerRank — Software Engineer Intern, SQL, Java (Basic) · Infosys Springboard — Java Developer · '
    'Deloitte × Forage — Cyber Job Simulation.',
])

doc = SimpleDocTemplate(
    str(OUT), pagesize=A4, leftMargin=38, rightMargin=38, topMargin=30, bottomMargin=26,
    title='Jayantan AD — Resume', author='Jayantan AD',
    subject='ML & Backend Developer — B.E. CSE, VSB College of Engineering and Technical Campus',
)
doc.build(story)
print(f'wrote {OUT.relative_to(ROOT)}')
