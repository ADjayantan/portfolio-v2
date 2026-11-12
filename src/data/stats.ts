import type { LeetCodeStats, GitHubStats } from '../types'

// Automated daily update from LeetCode GraphQL API
export const leetcodeStats: LeetCodeStats = {
  "total": 264,
  "easy": 171,
  "medium": 74,
  "hard": 19,
  "contestRating": 1458,
  "globalRanking": 525760,
  "contestsAttended": 5,
  "topPercentage": 59.4,
  "activeDays": 208,
  "maxStreak": 106,
  "badges": 3,
  "badgeNames": [
    "200 Days Badge 2026",
    "100 Days Badge 2026",
    "50 Days Badge 2026"
  ],
  "javaSolved": 251,
  "topTopics": [
    {
      "tag": "Array",
      "solved": 118
    },
    {
      "tag": "String",
      "solved": 110
    },
    {
      "tag": "Math",
      "solved": 62
    },
    {
      "tag": "Hash Table",
      "solved": 47
    },
    {
      "tag": "Sorting",
      "solved": 35
    },
    {
      "tag": "Two Pointers",
      "solved": 30
    },
    {
      "tag": "Dynamic Programming",
      "solved": 27
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
  "followers": 4,
  "stars": 1,
  "forks": 0
}
