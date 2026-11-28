import type { LeetCodeStats, GitHubStats } from '../types'

// Automated daily update from LeetCode GraphQL API
export const leetcodeStats: LeetCodeStats = {
  "total": 281,
  "easy": 176,
  "medium": 82,
  "hard": 23,
  "contestRating": 1458,
  "globalRanking": 527211,
  "contestsAttended": 5,
  "topPercentage": 59.4,
  "activeDays": 223,
  "maxStreak": 106,
  "badges": 3,
  "badgeNames": [
    "200 Days Badge 2026",
    "100 Days Badge 2026",
    "50 Days Badge 2026"
  ],
  "javaSolved": 268,
  "topTopics": [
    {
      "tag": "Array",
      "solved": 129
    },
    {
      "tag": "String",
      "solved": 116
    },
    {
      "tag": "Math",
      "solved": 66
    },
    {
      "tag": "Hash Table",
      "solved": 50
    },
    {
      "tag": "Sorting",
      "solved": 38
    },
    {
      "tag": "Dynamic Programming",
      "solved": 31
    },
    {
      "tag": "Two Pointers",
      "solved": 31
    },
    {
      "tag": "Bit Manipulation",
      "solved": 21
    }
  ]
}

// Automated daily update from GitHub REST API
export const githubStats: GitHubStats = {
  "repos": 32,
  "followers": 3,
  "stars": 1,
  "forks": 0
}
