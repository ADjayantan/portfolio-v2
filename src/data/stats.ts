import type { LeetCodeStats, GitHubStats } from '../types'

// Automated daily update from LeetCode GraphQL API
export const leetcodeStats: LeetCodeStats = {
  "total": 274,
  "easy": 173,
  "medium": 79,
  "hard": 22,
  "contestRating": 1458,
  "globalRanking": 526693,
  "contestsAttended": 5,
  "topPercentage": 59.4,
  "activeDays": 216,
  "maxStreak": 106,
  "badges": 3,
  "badgeNames": [
    "200 Days Badge 2026",
    "100 Days Badge 2026",
    "50 Days Badge 2026"
  ],
  "javaSolved": 261,
  "topTopics": [
    {
      "tag": "Array",
      "solved": 124
    },
    {
      "tag": "String",
      "solved": 115
    },
    {
      "tag": "Math",
      "solved": 63
    },
    {
      "tag": "Hash Table",
      "solved": 49
    },
    {
      "tag": "Sorting",
      "solved": 37
    },
    {
      "tag": "Two Pointers",
      "solved": 31
    },
    {
      "tag": "Dynamic Programming",
      "solved": 30
    },
    {
      "tag": "Bit Manipulation",
      "solved": 21
    }
  ]
}

// Automated daily update from GitHub REST API
export const githubStats: GitHubStats = {
  "repos": 31,
  "followers": 3,
  "stars": 1,
  "forks": 0
}
