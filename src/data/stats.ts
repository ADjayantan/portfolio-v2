import type { LeetCodeStats, GitHubStats } from '../types'

// Automated daily update from LeetCode GraphQL API
export const leetcodeStats: LeetCodeStats = {
  "total": 278,
  "easy": 175,
  "medium": 80,
  "hard": 23,
  "contestRating": 1458,
  "globalRanking": 526693,
  "contestsAttended": 5,
  "topPercentage": 59.4,
  "activeDays": 220,
  "maxStreak": 106,
  "badges": 3,
  "badgeNames": [
    "200 Days Badge 2026",
    "100 Days Badge 2026",
    "50 Days Badge 2026"
  ],
  "javaSolved": 265,
  "topTopics": [
    {
      "tag": "Array",
      "solved": 127
    },
    {
      "tag": "String",
      "solved": 116
    },
    {
      "tag": "Math",
      "solved": 65
    },
    {
      "tag": "Hash Table",
      "solved": 50
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
  "repos": 32,
  "followers": 3,
  "stars": 1,
  "forks": 0
}
