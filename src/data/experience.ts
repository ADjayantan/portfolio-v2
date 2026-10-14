import type { ExperienceItem, Recognition } from '../types';

// Source: LinkedIn experience + posts (Oct 2026). Newest first.
export const experience: ExperienceItem[] = [
  {
    role: 'Software Engineer Intern',
    org: 'Havonz Technologies',
    period: 'Mar 2026 — Present',
    place: 'Coimbatore · Remote',
    current: true,
  },
  {
    role: 'Machine Learning Intern (Virtual)',
    org: 'CodSoft',
    period: 'Sep 2026',
    place: 'Remote · 1 month',
    points: [
      'SMS spam classifier — Linear SVC chosen on cross-validated F1: 98.3% accuracy, 93.0% F1, 61 pytest tests, Streamlit app.',
      'Credit-card fraud detection — SMOTE for severe class imbalance, Random Forest vs Logistic Regression, real-time Streamlit dashboard.',
    ],
  },
];

export const hackathons: Recognition[] = [
  {
    title: 'Smart India Hackathon 2026',
    detail: 'Team PRAGYAN_7 — nominated as a participating team after presenting ARIA, an AI classroom companion, at VSB',
    date: 'Sep 2026',
  },
  {
    title: 'Global Innovation Hackathon 2026',
    detail: 'Build for a Better Future · Bharat Academix × Unstop — submitted ARIA with Team Brute Force',
    date: 'Sep 2026',
  },
  {
    title: 'JCT SDG Hackathon 2026',
    detail: 'GigGuard — verifies gig-worker payouts and route integrity with route-compression detection and Double Machine Learning',
    date: '2026',
  },
  {
    title: 'Hack Devenger 2.0',
    detail: '6-hour build hackathon',
    date: 'Sep 2026',
  },
];

export const certifications: Recognition[] = [
  { title: 'Software Engineer Intern', detail: 'HackerRank', date: 'Oct 2026' },
  { title: 'SQL', detail: 'HackerRank', date: 'Oct 2026' },
  { title: 'Java (Basic)', detail: 'HackerRank', date: 'Oct 2026' },
  { title: 'Java Developer', detail: 'Infosys Springboard', date: 'Aug 2026' },
  { title: 'Cyber Job Simulation', detail: 'Deloitte × Forage', date: 'Aug 2026' },
];
