const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
}

const repoList = document.getElementById("repo-list");
if (repoList) {
  fetch("https://api.github.com/users/andrejonatan/repos")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((repo) => {
        const div = document.createElement("div");
        div.className = "repo-card p-5 rounded-xl border border-orange bg-navy/70 flex flex-col gap-3";
        div.innerHTML = `
          <h3 class="text-lg font-semibold text-orange">${repo.name}</h3>
          <p class="text-sm text-white/70">${repo.description || "No description provided."}</p>
          <div class="flex gap-3 mt-4 justify-center">
            <a href="${repo.html_url}" target="_blank" class="repo-btn">View Source</a>
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="repo-btn">Live Demo</a>` : ""}
          </div>
        `;
        repoList.appendChild(div);
      });
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    });
}

const aboutSection = document.getElementById("about");
const navInner = document.getElementById("navInner");

if (aboutSection && navInner) {
  window.addEventListener("scroll", () => {
    const top = aboutSection.offsetTop - 120;
    const bottom = top + aboutSection.offsetHeight;
    if (window.scrollY >= top && window.scrollY <= bottom) {
      navInner.classList.add("bg-transparent");
      navInner.classList.remove("bg-navy/70");
    } else {
      navInner.classList.add("bg-navy/70");
      navInner.classList.remove("bg-transparent");
    }
  });
}

const socialButtons = document.querySelectorAll(".social-btn");
socialButtons.forEach((btn) => {
  const addActive = () => btn.classList.add("is-active");
  const removeActive = () => btn.classList.remove("is-active");

  btn.addEventListener("touchstart", addActive, { passive: true });
  btn.addEventListener("touchend", removeActive);
  btn.addEventListener("touchcancel", removeActive);
  btn.addEventListener("touchmove", removeActive);
  btn.addEventListener("mousedown", addActive);
  btn.addEventListener("mouseup", removeActive);
  btn.addEventListener("mouseleave", removeActive);
});

if (typeof lucide !== "undefined") {
  lucide.createIcons();
}
