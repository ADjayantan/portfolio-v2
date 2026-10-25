import type { LeetCodeStats, GitHubStats } from '../types'

// Automated daily update from LeetCode GraphQL API
export const leetcodeStats: LeetCodeStats = {
  "total": 250,
  "easy": 169,
  "medium": 64,
  "hard": 17,
  "contestRating": 1458,
  "globalRanking": 524443,
  "contestsAttended": 5,
  "topPercentage": 59.4,
  "activeDays": 194,
  "maxStreak": 106,
  "badges": 2,
  "badgeNames": [
    "100 Days Badge 2026",
    "50 Days Badge 2026"
  ],
  "javaSolved": 237,
  "topTopics": [
    {
      "tag": "String",
      "solved": 110
    },
    {
      "tag": "Array",
      "solved": 106
    },
    {
      "tag": "Math",
      "solved": 58
    },
    {
      "tag": "Hash Table",
      "solved": 45
    },
    {
      "tag": "Sorting",
      "solved": 33
    },
    {
      "tag": "Two Pointers",
      "solved": 30
    },
    {
      "tag": "Dynamic Programming",
      "solved": 23
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
