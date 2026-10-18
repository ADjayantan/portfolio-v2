import type { LeetCodeStats, GitHubStats } from '../types'

// Automated daily update from LeetCode GraphQL API
export const leetcodeStats: LeetCodeStats = {
  "total": 244,
  "easy": 167,
  "medium": 62,
  "hard": 15,
  "contestRating": 1458,
  "globalRanking": 524099,
  "contestsAttended": 5,
  "topPercentage": 59.4,
  "activeDays": 188,
  "maxStreak": 106,
  "badges": 2,
  "badgeNames": [
    "100 Days Badge 2026",
    "50 Days Badge 2026"
  ],
  "javaSolved": 231,
  "topTopics": [
    {
      "tag": "String",
      "solved": 108
    },
    {
      "tag": "Array",
      "solved": 102
    },
    {
      "tag": "Math",
      "solved": 55
    },
    {
      "tag": "Hash Table",
      "solved": 45
    },
    {
      "tag": "Sorting",
      "solved": 31
    },
    {
      "tag": "Two Pointers",
      "solved": 30
    },
    {
      "tag": "Dynamic Programming",
      "solved": 22
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
