import type { LeetCodeStats, GitHubStats } from '../types'

// Automated daily update from LeetCode GraphQL API
export const leetcodeStats: LeetCodeStats = {
  "total": 258,
  "easy": 170,
  "medium": 70,
  "hard": 18,
  "contestRating": 1458,
  "globalRanking": 525302,
  "contestsAttended": 5,
  "topPercentage": 59.4,
  "activeDays": 203,
  "maxStreak": 106,
  "badges": 2,
  "badgeNames": [
    "100 Days Badge 2026",
    "50 Days Badge 2026"
  ],
  "javaSolved": 245,
  "topTopics": [
    {
      "tag": "Array",
      "solved": 113
    },
    {
      "tag": "String",
      "solved": 110
    },
    {
      "tag": "Math",
      "solved": 61
    },
    {
      "tag": "Hash Table",
      "solved": 46
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
      "solved": 26
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
