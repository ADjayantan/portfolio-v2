const fs = require('fs')
const path = require('path')

// Usernames
const LEETCODE_USER = 'jayantan'
const GITHUB_USER = 'ADjayantan'

const STATS_FILE = path.join(__dirname, '..', 'src', 'data', 'stats.ts')
const REPO_STATS_FILE = path.join(__dirname, '..', 'src', 'data', 'repoStats.ts')
const PROJECTS_FILE = path.join(__dirname, '..', 'src', 'data', 'projects.ts')

// GitHub headers (uses GITHUB_TOKEN if available to avoid rate limits)
const githubHeaders = {
  'User-Agent': 'Portfolio-Updater-Action',
}
if (process.env.GITHUB_TOKEN) {
  githubHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
}

// Read a JSON object literal back out of the current stats.ts so a failing API
// keeps the last known values instead of wiping them.
function readPrevious(exportName) {
  try {
    const src = fs.readFileSync(STATS_FILE, 'utf8')
    const m = src.match(new RegExp(`export const ${exportName}: \\w+ = (\\{[\\s\\S]*?\\n\\})`))
    return m ? JSON.parse(m[1]) : null
  } catch {
    return null
  }
}

async function fetchLeetCodeStats() {
  console.log(`Fetching LeetCode stats for: ${LEETCODE_USER}...`)
  const query = `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        userCalendar {
          streak
          totalActiveDays
        }
        badges {
          displayName
        }
        languageProblemCount {
          languageName
          problemsSolved
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
        attendedContestsCount
        topPercentage
      }
    }
  `

  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0',
      Referer: `https://leetcode.com/u/${LEETCODE_USER}/`,
    },
    body: JSON.stringify({
      query,
      variables: { username: LEETCODE_USER },
    }),
  })

  if (!res.ok) {
    throw new Error(`LeetCode GraphQL failed with status ${res.status}`)
  }

  const json = await res.json()
  const data = json.data

  if (!data || !data.matchedUser) {
    throw new Error('Could not find LeetCode matchedUser profile.')
  }

  const solved = data.matchedUser.submitStats.acSubmissionNum
  const count = (d) => solved.find((s) => s.difficulty === d)?.count || 0

  // userCalendar without a year = the past 12 months: `streak` is the longest
  // streak in that window, `totalActiveDays` the days with a submission.
  const calendar = data.matchedUser.userCalendar || { streak: 0, totalActiveDays: 0 }
  const contest = data.userContestRanking || { rating: 0, globalRanking: 0, attendedContestsCount: 0, topPercentage: 0 }
  const badges = data.matchedUser.badges || []
  const java = (data.matchedUser.languageProblemCount || []).find((l) => l.languageName === 'Java')

  return {
    total: count('All'),
    easy: count('Easy'),
    medium: count('Medium'),
    hard: count('Hard'),
    contestRating: Math.round(contest.rating || 0),
    globalRanking: contest.globalRanking || 0,
    contestsAttended: contest.attendedContestsCount || 0,
    topPercentage: Math.round((contest.topPercentage || 0) * 10) / 10,
    activeDays: calendar.totalActiveDays,
    maxStreak: calendar.streak,
    badges: badges.length,
    badgeNames: badges.map((b) => b.displayName),
    javaSolved: java ? java.problemsSolved : 0,
  }
}

async function fetchGitHubStats() {
  console.log(`Fetching GitHub stats for: ${GITHUB_USER}...`)

  const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
    headers: githubHeaders,
  })
  if (!profileRes.ok) {
    throw new Error(`GitHub user API failed with status ${profileRes.status}`)
  }
  const profile = await profileRes.json()

  const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`, {
    headers: githubHeaders,
  })
  if (!reposRes.ok) {
    throw new Error(`GitHub repos API failed with status ${reposRes.status}`)
  }
  const repos = await reposRes.json()

  let totalStars = 0
  let totalForks = 0
  repos.forEach((repo) => {
    if (!repo.fork) {
      totalStars += repo.stargazers_count || 0
      totalForks += repo.forks_count || 0
    }
  })

  return {
    repos: profile.public_repos || 0,
    followers: profile.followers || 0,
    stars: totalStars,
    forks: totalForks,
  }
}

async function fetchRepoDetails(owner, repo) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: githubHeaders,
  })
  if (!res.ok) {
    console.warn(`Could not fetch details for ${owner}/${repo} (${res.status}), using 0.`)
    return { stars: 0, forks: 0 }
  }
  const data = await res.json()
  return {
    stars: data.stargazers_count || 0,
    forks: data.forks_count || 0,
  }
}

async function main() {
  let failures = 0

  let leetcode
  try {
    leetcode = await fetchLeetCodeStats()
    console.log('Fetched LeetCode Stats:', leetcode)
  } catch (error) {
    failures++
    console.warn('LeetCode stats unavailable, keeping previous values:', error.message)
    leetcode = readPrevious('leetcodeStats')
  }

  let github
  try {
    github = await fetchGitHubStats()
    console.log('Fetched GitHub Stats:', github)
  } catch (error) {
    failures++
    console.warn('GitHub stats unavailable, keeping previous values:', error.message)
    github = readPrevious('githubStats')
  }

  if (failures === 2 || !leetcode || !github) {
    console.error('No fresh data and no previous values to keep — aborting without writing.')
    process.exit(1)
  }

  // Per-project repo stats, keyed by project id (id must precede links.github in projects.ts)
  const projectsContent = fs.readFileSync(PROJECTS_FILE, 'utf8')
  const matches = [...projectsContent.matchAll(/id:\s*['"]([^'"]+)['"][\s\S]*?github:\s*['"]([^'"]+)['"]/g)]
  const repoStats = {}
  for (const [, id, url] of matches) {
    const parts = (url.split('github.com/')[1] || '').replace(/\/$/, '').split('/')
    repoStats[id] = parts.length > 1 ? await fetchRepoDetails(parts[0], parts[1]) : { stars: 0, forks: 0 }
  }
  console.log('Fetched individual project repository stats:', repoStats)

  const statsContent = `import type { LeetCodeStats, GitHubStats } from '../types'

// Automated daily update from LeetCode GraphQL API
export const leetcodeStats: LeetCodeStats = ${JSON.stringify(leetcode, null, 2)}

// Automated daily update from GitHub REST API
export const githubStats: GitHubStats = ${JSON.stringify(github, null, 2)}
`
  fs.writeFileSync(STATS_FILE, statsContent, 'utf8')
  console.log('Successfully wrote src/data/stats.ts')

  fs.writeFileSync(
    REPO_STATS_FILE,
    `export const repoStats: Record<string, { stars: number; forks: number }> = ${JSON.stringify(repoStats, null, 2)}\n`,
    'utf8',
  )
  console.log('Successfully wrote src/data/repoStats.ts')
}

main()
