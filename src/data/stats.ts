import type { LeetCodeStats, GitHubStats } from '../types'

// Automated daily update from LeetCode GraphQL API
export const leetcodeStats: LeetCodeStats = {
  "total": 257,
  "easy": 170,
  "medium": 70,
  "hard": 17,
  "contestRating": 1458,
  "globalRanking": 525302,
  "contestsAttended": 5,
  "topPercentage": 59.4,
  "activeDays": 201,
  "maxStreak": 106,
  "badges": 2,
  "badgeNames": [
    "100 Days Badge 2026",
    "50 Days Badge 2026"
  ],
  "javaSolved": 244,
  "topTopics": [
    {
      "tag": "Array",
      "solved": 112
    },
    {
      "tag": "String",
      "solved": 110
    },
    {
      "tag": "Math",
      "solved": 60
    },
    {
      "tag": "Hash Table",
      "solved": 45
    },
    {
      "tag": "Sorting",
      "solved": 34
    },
    {
      "tag": "Two Pointers",
      "solved": 30
    },
    {
      "tag": "Dynamic Programming",
      "solved": 25
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
