import type { SkillCategory } from '../types';

export const skills: SkillCategory[] = [
  {
    label: 'Core Stack',
    items: [
      { name: 'JavaScript (ES2022+)', level: 'core' },
      { name: 'TypeScript', level: 'core' },
      { name: 'React', level: 'core' },
      { name: 'Data Structures & Algorithms', level: 'core' },
      { name: 'Java', level: 'core' },
    ],
  },
  {
    label: 'Frontend',
    items: [
      { name: 'Tailwind CSS', level: 'proficient' },
      { name: 'Framer Motion', level: 'proficient' },
      { name: 'HTML5 / CSS3', level: 'proficient' },
      { name: 'Vite', level: 'proficient' },
      { name: 'Responsive Design', level: 'proficient' },
    ],
  },
  {
    label: 'Backend & Data',
    items: [
      { name: 'Firebase (Firestore, Auth)', level: 'proficient' },
      { name: 'REST APIs', level: 'proficient' },
      { name: 'Node.js (basics)', level: 'familiar' },
      { name: 'Python', level: 'familiar' },
    ],
  },
  {
    label: 'Tooling & Workflow',
    items: [
      { name: 'Git & GitHub', level: 'proficient' },
      { name: 'VS Code', level: 'proficient' },
      { name: 'Google AI Studio', level: 'familiar' },
      { name: 'Prompt Engineering', level: 'familiar' },
    ],
  },
];

export const levelColors: Record<string, string> = {
  core: '#22d3ee',
  proficient: '#a78bfa',
  familiar: '#6b7280',
};
