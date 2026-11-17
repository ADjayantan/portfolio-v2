import type { LeetCodeStats, GitHubStats } from '../types'

// Automated daily update from LeetCode GraphQL API
export const leetcodeStats: LeetCodeStats = {
  "total": 270,
  "easy": 173,
  "medium": 76,
  "hard": 21,
  "contestRating": 1458,
  "globalRanking": 526333,
  "contestsAttended": 5,
  "topPercentage": 59.4,
  "activeDays": 212,
  "maxStreak": 106,
  "badges": 3,
  "badgeNames": [
    "200 Days Badge 2026",
    "100 Days Badge 2026",
    "50 Days Badge 2026"
  ],
  "javaSolved": 257,
  "topTopics": [
    {
      "tag": "Array",
      "solved": 121
    },
    {
      "tag": "String",
      "solved": 113
    },
    {
      "tag": "Math",
      "solved": 63
    },
    {
      "tag": "Hash Table",
      "solved": 48
    },
    {
      "tag": "Sorting",
      "solved": 35
    },
    {
      "tag": "Two Pointers",
      "solved": 31
    },
    {
      "tag": "Dynamic Programming",
      "solved": 29
    },
    {
      "tag": "Bit Manipulation",
      "solved": 21
    }
  ]
}

// Automated daily update from GitHub REST API
export const githubStats: GitHubStats = {
  "repos": 30,
  "followers": 3,
  "stars": 1,
  "forks": 0
}
