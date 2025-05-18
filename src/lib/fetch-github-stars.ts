/**
 * Fetches the number of GitHub stars for a specified repository.
 * Makes a request to the GitHub API to get stargazers data.
 * @returns {Promise<number>} The number of stars the repository has, or 0 if there was an error.
 */
export default async function fetchGitHubStars(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.github.com/repos/luccasfr/repo-save-editor/stargazers',
      { next: { revalidate: 0.5 * 60 * 60 } }
    )
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    return data.length
  } catch (error) {
    console.error('Error fetching GitHub stars:', error)
    return 0
  }
}
