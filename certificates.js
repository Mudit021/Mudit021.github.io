// Replace this URL with the one you got from Google Apps Script deployment
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxHApVR9j_4f2elKCdLX-SmjoiVoB_IcWbGEFSoJa7UI1j-De9TTtCHLNFBlg3eh-_M3Q/exec';

async function fetchCertificates() {
  const container = document.getElementById('certs-container');
  const loading = document.getElementById('certs-loading');
  const errorDiv = document.getElementById('certs-error');

  // Check if URL is configured
  if (GOOGLE_SCRIPT_URL.includes('PASTE_YOUR_WEB_APP_URL')) {
    loading.innerHTML = '<p style="color:orange">Setup required: Please add your Google Apps Script URL in certificates.js</p>';
    return;
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    const data = await response.json();

    // Hide loading
    loading.style.display = 'none';

    if (!data || data.length === 0 || data.error) {
      container.innerHTML = '<p>No certificates found.</p>';
      if(data.error) console.error("Script Error:", data.error);
      return;
    }

    // Render certificates
    container.innerHTML = data.map(cert => `
      <div class="cert-card">
        <div class="cert-img-wrapper">
          <img src="${cert.image}" alt="${cert.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=Certificate'">
        </div>
        <div class="cert-info">
          <h3>${cert.name.replace(/\.[^/.]+$/, "")}</h3> <!-- Remove file extension -->
          <a href="${cert.url}" target="_blank" class="repo-link">View Certificate →</a>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error fetching certificates:', error);
    loading.style.display = 'none';
    errorDiv.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', fetchCertificates);