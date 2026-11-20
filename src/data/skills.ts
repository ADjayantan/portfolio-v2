import type { SkillCategory } from '../types';

export const skills: SkillCategory[] = [
  {
    label: 'Languages',
    items: [
      { name: 'Java', level: 'core' },
      { name: 'Python', level: 'core' },
      { name: 'TypeScript / JavaScript', level: 'core' },
      { name: 'SQL', level: 'proficient' },
    ],
  },
  {
    label: 'Machine Learning',
    items: [
      { name: 'scikit-learn', level: 'proficient' },
      { name: 'PyTorch · Graph Neural Networks', level: 'proficient' },
      { name: 'Pandas · NumPy', level: 'proficient' },
      { name: 'Streamlit · Gradio', level: 'proficient' },
      { name: 'MediaPipe · Gemini API', level: 'proficient' },
    ],
  },
  {
    label: 'Backend & APIs',
    items: [
      { name: 'Node.js · Express', level: 'proficient' },
      { name: 'FastAPI', level: 'proficient' },
      { name: 'REST API Design', level: 'proficient' },
      { name: 'JWT · bcrypt Auth', level: 'proficient' },
      { name: 'Prisma ORM', level: 'proficient' },
    ],
  },
  {
    label: 'Databases',
    items: [
      { name: 'PostgreSQL · Supabase', level: 'proficient' },
      { name: 'MongoDB · Mongoose', level: 'proficient' },
      { name: 'MySQL', level: 'familiar' },
    ],
  },
  {
    label: 'Frontend & Desktop',
    items: [
      { name: 'React', level: 'core' },
      { name: 'Next.js', level: 'proficient' },
      { name: 'Tailwind CSS', level: 'proficient' },
      { name: 'Framer Motion', level: 'proficient' },
      { name: 'Electron', level: 'proficient' },
    ],
  },
  {
    label: 'Tooling & CS Core',
    items: [
      { name: 'Data Structures & Algorithms', level: 'core' },
      { name: 'Git · GitHub Actions', level: 'proficient' },
      { name: 'pytest · Vitest', level: 'proficient' },
      { name: 'Vercel · Render · HF Spaces', level: 'proficient' },
      { name: 'OOP · DBMS · OS', level: 'proficient' },
    ],
  },
];
