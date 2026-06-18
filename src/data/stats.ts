import type { LeetCodeStats, GitHubStats } from '../types'

// Automated daily update from LeetCode GraphQL API
export const leetcodeStats: LeetCodeStats = {
  "total": 166,
  "easy": 140,
  "medium": 25,
  "hard": 1,
  "contestRating": 1458,
  "globalRanking": 514899,
  "activeDays": 127,
  "maxStreak": 106,
  "badges": 2
}

// Automated daily update from GitHub REST API
export const githubStats: GitHubStats = {
  "repos": 19,
  "followers": 2,
  "stars": 1,
  "forks": 0
}

// Repos to feature
export const featuredRepos = [
  'AD-Jayantan-',
  'Jayantan-',
  'My-portflio',
  'signbridge-',
  'studio',
]
