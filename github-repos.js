// GitHub username
const GITHUB_USERNAME = 'Mudit021';

// API endpoint
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

// Fetch repositories
async function fetchGitHubRepos() {
  const loading = document.getElementById('loading');
  const container = document.getElementById('repos-container');
  const errorDiv = document.getElementById('error');

  try {
    const response = await fetch(GITHUB_API + '?sort=updated&per_page=100');
    
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    const repos = await response.json();
    
    // Hide loading
    loading.style.display = 'none';

    // Filter out forks (optional) and sort by stars
    const filteredRepos = repos
      .filter(repo => !repo.fork) // Remove forked repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count);

    // Display repositories
    if (filteredRepos.length === 0) {
      container.innerHTML = '<p class="no-repos">No repositories found.</p>';
      return;
    }

    displayRepos(filteredRepos);

  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    loading.style.display = 'none';
    errorDiv.style.display = 'block';
  }
}

// Display repositories in the grid
function displayRepos(repos) {
  const container = document.getElementById('repos-container');
  
  container.innerHTML = repos.map(repo => `
    <div class="repo-card">
      <div class="repo-header">
        <h3>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            📁 ${repo.name}
          </a>
        </h3>
        ${repo.private ? '<span class="repo-badge private">Private</span>' : '<span class="repo-badge public">Public</span>'}
      </div>
      
      <p class="repo-description">
        ${repo.description || 'No description available'}
      </p>

      <div class="repo-stats">
        ${repo.language ? `<span class="repo-language"><span class="lang-dot" style="background-color: ${getLanguageColor(repo.language)}"></span>${repo.language}</span>` : ''}
        <span class="repo-stat">⭐ ${repo.stargazers_count}</span>
        <span class="repo-stat">🔱 ${repo.forks_count}</span>
      </div>

      <div class="repo-footer">
        <span class="repo-updated">Updated: ${formatDate(repo.updated_at)}</span>
        <a href="${repo.html_url}" target="_blank" class="repo-link">View Repo →</a>
      </div>
    </div>
  `).join('');
}

// Format date to readable format
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// Get language color (simplified version)
function getLanguageColor(language) {
  const colors = {
    'JavaScript': '#f1e05a',
    'Python': '#3572A5',
    'Java': '#b07219',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'TypeScript': '#2b7489',
    'C++': '#f34b7d',
    'C': '#555555',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Jupyter Notebook': '#DA5B0B',
    'R': '#198CE7',
    'Shell': '#89e051',
  };
  return colors[language] || '#8c8c8c';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', fetchGitHubRepos);