import type { Profile } from '../types';

export const profile: Profile = {
  name: 'AD Jayantan',
  title: 'Frontend Developer | Problem Solver',
  tagline: 'I design structured frontend systems and improve problem-solving through consistent DSA practice.',
  bio: 'B.E. Computer Science student at VSB College of Engineering and Technical Campus, Coimbatore. Building real-world web systems with React and TypeScript while consistently practicing data structures and algorithms.',
  location: 'Coimbatore, Tamil Nadu, India',
  college: 'VSB College of Engineering and Technical Campus',
  degree: 'B.E. Computer Science and Engineering',
  company: 'Havonz Technologies',
  links: {
    github: 'https://github.com/ADjayantan',
    linkedin: 'https://www.linkedin.com/in/ad-jayantan-766886320/',
    leetcode: 'https://leetcode.com/u/jayantan/',
    // Uses Vite's BASE_URL so this works regardless of the base path in vite.config.ts
    resume: `${import.meta.env.BASE_URL}Jayantan_AD_Resume.pdf`,
  },
};
