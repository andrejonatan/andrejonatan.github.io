const GITHUB_USERNAME = "andrejonatan";
let allRepos = [];

// Language colors
const langColors = {
  HTML: "#e34c26",
  CSS: "#563d7c",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  SCSS: "#c6538c",
  TypeScript: "#2b7489",
  Java: "#b07219",
  PHP: "#4F5D95",
};

const navToggle = document.getElementById("nav-toggle");
const navMenu = document.querySelector(".nav-menu");

// Show section
function showSection(id) {
  document.querySelectorAll(".section").forEach((sec) => sec.classList.add("hidden"));
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"));

  document.getElementById(id).classList.remove("hidden");
  document.getElementById("btn-" + id).classList.add("active");

  if (id === "github" && allRepos.length === 0) {
    fetchGitHubRepos();
  }
  if (id === "projects" && allRepos.length === 0) {
    fetchGitHubRepos();
  }

  if (navMenu) {
    navMenu.classList.remove("open");
  }
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
  }
}

// Fetch GitHub profile (for header + about avatar)
async function fetchGitHubProfile() {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    const user = await response.json();

    const nameEl = document.getElementById("profile-name");
    if (nameEl) {
      nameEl.textContent = user.name || user.login || "Andre Jonatan";
    }

    const avatarEl = document.getElementById("avatar");
    if (avatarEl && user.avatar_url) {
      avatarEl.src = user.avatar_url;
    }

    const aboutAvatar = document.getElementById("about-avatar");
    if (aboutAvatar && user.avatar_url) {
      aboutAvatar.src = user.avatar_url;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
}

// Fetch GitHub repos
async function fetchGitHubRepos() {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid GitHub response");
    }
    allRepos = data;

    document.getElementById("total-repos").textContent = allRepos.length;
    document.getElementById("total-stars").textContent = allRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    document.getElementById("total-forks").textContent = allRepos.reduce((sum, repo) => sum + repo.forks_count, 0);

    const languages = [...new Set(allRepos.map((r) => r.language).filter(Boolean))];
    const filterLang = document.getElementById("filterLang");
    languages.forEach((lang) => {
      const opt = document.createElement("option");
      opt.value = lang;
      opt.textContent = lang;
      filterLang.appendChild(opt);
    });

    renderRepos(allRepos);
    renderProjects(allRepos.filter((r) => r.has_pages || r.homepage));
  } catch (error) {
    console.error("Error fetching repos:", error);
    const message = error.message.includes("403")
      ? "Gagal memuat repositories (rate limit GitHub). Coba lagi nanti."
      : "Gagal memuat repositories";
    document.getElementById("repos-list").innerHTML = `<p class="text-red-500">${message}</p>`;
  }
}

// Render repos
function renderRepos(repos) {
  const container = document.getElementById("repos-list");
  container.innerHTML = repos
    .map(
      (repo, index) => `
    <div class="card fade-in" style="animation-delay: ${index * 0.05}s">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-semibold text-lg flex items-center gap-2">
            <i class="fas fa-book text-gray-400"></i>
            <a href="${repo.html_url}" target="_blank" class="text-white hover:underline">${repo.name}</a>
            ${repo.fork ? '<span class="text-xs bg-cyan-500 text-white px-2 py-0.5 rounded">Fork</span>' : ""}
          </h3>
          <p class="text-sm text-gray-600 mt-1">${repo.description || "Tidak ada deskripsi"}</p>
        </div>
      </div>
      <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
        ${
          repo.language
            ? `
          <span class="flex items-center gap-1">
            <span class="lang-dot" style="background-color: ${langColors[repo.language] || "#ccc"}"></span>
            ${repo.language}
          </span>
        `
            : ""
        }
        <span class="flex items-center gap-1">
          <i class="fas fa-star"></i> ${repo.stargazers_count}
        </span>
        <span class="flex items-center gap-1">
          <i class="fas fa-code-branch"></i> ${repo.forks_count}
        </span>
        ${
          repo.has_pages
            ? `
          <a href="https://${GITHUB_USERNAME}.github.io/${repo.name}/" target="_blank"
            class="inline-flex items-center gap-1 bg-cyan-500 text-white px-3 py-1.5 rounded-md hover:bg-cyan-600">
            <i class="fas fa-external-link-alt"></i> Live Demo
          </a>
        `
            : ""
        }
      </div>
      <p class="text-xs text-gray-400 mt-2">
        Updated: ${new Date(repo.updated_at).toLocaleDateString("id-ID")}
      </p>
    </div>
  `,
    )
    .join("");
}

// Render projects (with GitHub Pages)
function renderProjects(projects) {
  const container = document.getElementById("projects-list");
  if (projects.length === 0) {
    container.innerHTML = '<p class="text-gray-500">Belum ada project dengan live demo</p>';
    return;
  }

  container.innerHTML = projects
    .map(
      (repo, index) => `
    <div class="card fade-in" style="animation-delay: ${index * 0.1}s">
      <div class="flex items-center gap-2 mb-2">
        <span class="lang-dot" style="background-color: ${langColors[repo.language] || "#ccc"}"></span>
        <span class="text-xs text-gray-500">${repo.language || "Unknown"}</span>
      </div>
      <h3 class="font-semibold text-lg">${repo.name}</h3>
      <p class="text-sm text-gray-600 mt-1">${repo.description || "Mini project"}</p>
      <div class="flex gap-3 mt-4">
        <a href="${repo.homepage || `https://${GITHUB_USERNAME}.github.io/${repo.name}/`}" target="_blank"
          class="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm">
          <i class="fas fa-external-link-alt mr-1"></i> Live Demo
        </a>
        <a href="${repo.html_url}" target="_blank"
          class="flex-1 text-center bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition text-sm">
          <i class="fab fa-github mr-1"></i> Source
        </a>
      </div>
    </div>
  `,
    )
    .join("");
}

// Search & Filter
const searchRepoInput = document.getElementById("searchRepo");
const filterLangSelect = document.getElementById("filterLang");
if (searchRepoInput && filterLangSelect) {
  searchRepoInput.addEventListener("input", filterRepos);
  filterLangSelect.addEventListener("change", filterRepos);
}

function filterRepos() {
  const search = document.getElementById("searchRepo").value.toLowerCase();
  const lang = document.getElementById("filterLang").value;

  let filtered = allRepos;
  if (search) {
    filtered = filtered.filter(
      (r) => r.name.toLowerCase().includes(search) || (r.description && r.description.toLowerCase().includes(search)),
    );
  }
  if (lang) {
    filtered = filtered.filter((r) => r.language === lang);
  }
  renderRepos(filtered);
}

// Contact form
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Terima kasih! Pesan Anda akan diproses.");
    this.reset();
  });
}

// Load on page load
fetchGitHubRepos();
fetchGitHubProfile();

// Mobile/tablet nav toggle
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}
