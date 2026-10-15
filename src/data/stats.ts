import type { LeetCodeStats, GitHubStats } from '../types'

// Automated daily update from LeetCode GraphQL API
export const leetcodeStats: LeetCodeStats = {
  "total": 240,
  "easy": 166,
  "medium": 61,
  "hard": 13,
  "contestRating": 1458,
  "globalRanking": 523240,
  "contestsAttended": 5,
  "topPercentage": 59.4,
  "activeDays": 185,
  "maxStreak": 106,
  "badges": 2,
  "badgeNames": [
    "100 Days Badge 2026",
    "50 Days Badge 2026"
  ],
  "javaSolved": 227,
  "topTopics": [
    {
      "tag": "String",
      "solved": 107
    },
    {
      "tag": "Array",
      "solved": 99
    },
    {
      "tag": "Math",
      "solved": 55
    },
    {
      "tag": "Hash Table",
      "solved": 42
    },
    {
      "tag": "Sorting",
      "solved": 30
    },
    {
      "tag": "Two Pointers",
      "solved": 30
    },
    {
      "tag": "Dynamic Programming",
      "solved": 21
    },
    {
      "tag": "Bit Manipulation",
      "solved": 20
    }
  ]
}

// Automated daily update from GitHub REST API
export const githubStats: GitHubStats = {
  "repos": 29,
  "followers": 3,
  "stars": 1,
  "forks": 0
}
