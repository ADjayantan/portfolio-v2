const fs = require('fs')
const path = require('path')

// Usernames
const LEETCODE_USER = 'jayantan'
const GITHUB_USER = 'ADjayantan'

// GitHub headers (uses GITHUB_TOKEN if available to avoid rate limits)
const githubHeaders = {
  'User-Agent': 'Portfolio-Updater-Action',
}
if (process.env.GITHUB_TOKEN) {
  githubHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
}

async function fetchLeetCodeStats() {
  console.log(`Fetching LeetCode stats for: ${LEETCODE_USER}...`)
  const query = `
    query userProblemsSolved($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
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
          name
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
        badge {
          name
        }
      }
    }
  `

  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0',
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
  const totalSolved = solved.find(s => s.difficulty === 'All')?.count || 0
  const easySolved = solved.find(s => s.difficulty === 'Easy')?.count || 0
  const mediumSolved = solved.find(s => s.difficulty === 'Medium')?.count || 0
  const hardSolved = solved.find(s => s.difficulty === 'Hard')?.count || 0

  const calendar = data.matchedUser.userCalendar || { streak: 0, totalActiveDays: 0 }
  const contest = data.userContestRanking || { rating: 0, globalRanking: '0/0' }

  return {
    total: totalSolved,
    easy: easySolved,
    medium: mediumSolved,
    hard: hardSolved,
    contestRating: Math.round(contest.rating),
    globalRanking: contest.globalRanking,
    activeDays: calendar.totalActiveDays,
    maxStreak: calendar.streak,
    badges: data.matchedUser.badges?.length || 0,
  }
}

async function fetchGitHubStats() {
  console.log(`Fetching GitHub stats for: ${GITHUB_USER}...`)

  // 1. Fetch profile details
  const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
    headers: githubHeaders,
  })

  if (!profileRes.ok) {
    throw new Error(`GitHub user API failed with status ${profileRes.status}`)
  }

  const profile = await profileRes.json()

  // 2. Fetch all repositories to calculate total stars and forks
  const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`, {
    headers: githubHeaders,
  })

  if (!reposRes.ok) {
    throw new Error(`GitHub repos API failed with status ${reposRes.status}`)
  }

  const repos = await reposRes.json()

  let totalStars = 0
  let totalForks = 0
  repos.forEach(repo => {
    if (!repo.fork) {
      totalStars += repo.stargazers_count || 0
      totalForks += repo.forks_count || 0
    }
  })

  return {
    profileStats: {
      repos: profile.public_repos || 0,
      followers: profile.followers || 0,
      stars: totalStars,
      forks: totalForks,
    },
    featuredReposList: repos.slice(0, 8).map(repo => repo.name), // fallback list
  }
}

async function fetchRepoDetails(owner, repo) {
  console.log(`Fetching details for repo: ${owner}/${repo}...`)
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: githubHeaders,
  })

  if (!res.ok) {
    console.warn(`Could not fetch details for ${owner}/${repo}, skipping.`)
    return { stars: 0, forks: 0 }
  }

  const data = await res.json()
  return {
    stars: data.stargazers_count || 0,
    forks: data.forks_count || 0,
  }
}

async function main() {
  try {
    // 1. Fetch LeetCode and GitHub Stats
    const leetcode = await fetchLeetCodeStats()
    const github = await fetchGitHubStats()

    console.log('Fetched LeetCode Stats:', leetcode)
    console.log('Fetched GitHub Stats:', github.profileStats)

    // 2. Parse projects.ts to find repo mappings
    const projectsFilePath = path.join(__dirname, '..', 'src', 'data', 'projects.ts')
    const projectsContent = fs.readFileSync(projectsFilePath, 'utf8')

    // Regex match project ids and github links
    const matches = [...projectsContent.matchAll(/id:\s*['"]([^'"]+)['"][\s\S]*?github:\s*['"]([^'"]+)['"]/g)]
    const repoStats = {}

    for (const match of matches) {
      const id = match[1]
      const url = match[2]
      const urlParts = url.split('github.com/')

      if (urlParts.length > 1) {
        const repoPath = urlParts[1].replace(/\/$/, '')
        const pathParts = repoPath.split('/')
        if (pathParts.length > 1) {
          const owner = pathParts[0]
          const repoName = pathParts[1]
          const details = await fetchRepoDetails(owner, repoName)
          repoStats[id] = details
        } else {
          repoStats[id] = { stars: 0, forks: 0 }
        }
      } else {
        repoStats[id] = { stars: 0, forks: 0 }
      }
    }

    console.log('Fetched individual project repository stats:', repoStats)

    // 3. Write stats.ts
    const statsFilePath = path.join(__dirname, '..', 'src', 'data', 'stats.ts')
    const statsContent = `import type { LeetCodeStats, GitHubStats } from '../types'

// Automated daily update from LeetCode GraphQL API
export const leetcodeStats: LeetCodeStats = ${JSON.stringify(leetcode, null, 2)}

// Automated daily update from GitHub REST API
export const githubStats: GitHubStats = ${JSON.stringify(github.profileStats, null, 2)}

// Repos to feature
export const featuredRepos = [
  'AD-Jayantan-',
  'Jayantan-',
  'My-portflio',
  'signbridge-',
  'studio',
]
`
    fs.writeFileSync(statsFilePath, statsContent, 'utf8')
    console.log('Successfully wrote src/data/stats.ts')

    // 4. Write repoStats.ts
    const repoStatsFilePath = path.join(__dirname, '..', 'src', 'data', 'repoStats.ts')
    const repoStatsContent = `export const repoStats: Record<string, { stars: number; forks: number }> = ${JSON.stringify(repoStats, null, 2)}
`
    fs.writeFileSync(repoStatsFilePath, repoStatsContent, 'utf8')
    console.log('Successfully wrote src/data/repoStats.ts')

  } catch (error) {
    console.error('Error in main execution:', error)
    process.exit(1)
  }
}

main()
