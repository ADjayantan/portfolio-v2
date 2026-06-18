export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  college: string;
  degree: string;
  company: string;
  links: {
    github: string;
    linkedin: string;
    leetcode: string;
    resume: string;
  };
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  contributions: string;
  tech: string[];
  links: {
    github: string;
    demo?: string;
  };
  accent: string;
}

export interface SkillCategory {
  label: string;
  items: Skill[];
}

export interface Skill {
  name: string;
  level: 'core' | 'proficient' | 'familiar';
  tag?: string;
}

export interface LeetCodeStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  contestRating: number;
  globalRanking: string | number;
  activeDays: number;
  maxStreak: number;
  badges: number;
}

export interface GitHubStats {
  repos: number;
  followers: number;
  stars: number;
  forks: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
}

export interface TerminalLine {
  type: 'command' | 'output' | 'comment';
  text: string;
}
