import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'zentry',
    title: 'Zentry — Task Manager',
    tagline: 'Real-time task management with Firebase persistence',
    problem:
      'Task tracking scattered across notes apps leads to missed priorities and no cross-device sync. Users need a structured, always-in-sync workspace.',
    solution:
      'Built a React SPA with Firebase Firestore as the real-time database. Used onSnapshot listeners so UI updates instantly without polling. Designed the Firestore schema to support per-user task collections with status and priority fields.',
    contributions:
      'Architected the entire frontend component tree. Implemented Firebase Auth for user sessions, designed the Firestore data model, and built the real-time sync pipeline using onSnapshot. Styled with Tailwind CSS for a responsive layout.',
    tech: ['React', 'TypeScript', 'Firebase Firestore', 'Firebase Auth', 'Tailwind CSS', 'Vite'],
    links: {
      github: 'https://github.com/ADjayantan',
    },
    accent: '#22d3ee',
  },
  {
    id: 'ai-builder',
    title: 'AI Web App Builder',
    tagline: 'Prompt-to-prototype using Google Gemini',
    problem:
      'Translating a product idea into a working web prototype requires hours of setup. Non-developers and rapid prototypers need a faster path from concept to code.',
    solution:
      'Integrated Google AI Studio\'s Gemini API with a carefully engineered prompt layer. The system interprets natural-language descriptions and outputs structured component code. Built a live preview pipeline so users see results immediately.',
    contributions:
      'Designed the prompt engineering system that bridges user intent to Gemini\'s output format. Built the UI rendering pipeline for generated app previews. Handled iterative refinement flow where follow-up prompts patch specific components.',
    tech: ['Google AI Studio', 'Gemini API', 'JavaScript', 'Prompt Engineering'],
    links: {
      github: 'https://github.com/ADjayantan',
      demo: 'https://aistudio.google.com/apps/drive/1BJsHgyfNAczkOZ-VI26-euaxdqrlr2dj?showPreview=true&showAssistant=true',
    },
    accent: '#a78bfa',
  },
  {
    id: 'ai-voice',
    title: 'AI Voice Assistant',
    tagline: 'TypeScript-based voice interaction system',
    problem:
      'Most voice assistants are black-box integrations with no customization. Developers need a transparent, extensible foundation for voice-driven UIs.',
    solution:
      'Built a TypeScript-first voice assistant using the Web Speech API for recognition and synthesis. Designed a modular command handler that maps recognized intent to structured actions, making it easy to extend without touching core logic.',
    contributions:
      'Implemented the full speech recognition pipeline, intent parsing module, and response synthesis layer. Structured the codebase in TypeScript with strict types so the command registry is fully type-safe.',
    tech: ['TypeScript', 'Web Speech API', 'JavaScript', 'DOM APIs'],
    links: {
      github: 'https://github.com/ADjayantan/Jayantan-',
    },
    accent: '#4ade80',
  },
  {
    id: 'signbridge',
    title: 'SignBridge',
    tagline: 'Sign language translation interface',
    problem:
      'Communication barriers for hearing-impaired individuals in digital interfaces are rarely addressed at the UI level. Most apps lack any sign language support.',
    solution:
      'Designed a web interface that bridges sign language gestures to text output, focusing on an accessible and intuitive UI that doesn\'t require specialized hardware beyond a standard webcam.',
    contributions:
      'Built the frontend interface and gesture capture pipeline. Focused on UI accessibility — high-contrast design, clear visual feedback, and keyboard-navigable controls throughout.',
    tech: ['JavaScript', 'Canvas API', 'CSS', 'Accessibility APIs'],
    links: {
      github: 'https://github.com/ADjayantan/signbridge-',
    },
    accent: '#f59e0b',
  },
];
