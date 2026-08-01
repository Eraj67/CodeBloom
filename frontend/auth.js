const API_BASE = "http://localhost:4000/api";

const auth = {
  user: null,
  isLoggedIn: false,

  async init() {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        this.user = data.user;
        this.isLoggedIn = true;
      } else {
        this.user = null;
        this.isLoggedIn = false;
      }
    } catch (error) {
      console.log("Auth check failed:", error);
      this.user = null;
      this.isLoggedIn = false;
    }

    this.updateUI();
    return this.isLoggedIn;
  },

  updateUI() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    const loginLinks = navbar.querySelectorAll('a[href="auth/auth.html"]');
    loginLinks.forEach((link) => {
      if (this.isLoggedIn) {
        link.style.display = "none";
      } else {
        link.style.display = "";
      }
    });

    const existingUserMenu = document.getElementById("user-menu");
    if (existingUserMenu) {
      existingUserMenu.remove();
    }

    if (this.isLoggedIn) {
      const userMenu = document.createElement("div");
      userMenu.id = "user-menu";
      userMenu.className = "user-menu";
      userMenu.innerHTML = `
        <div class="user-menu-trigger">
          <div class="user-avatar-small">
            ${this.user.profile?.avatarUrl
              ? `<img src="${this.user.profile.avatarUrl}" alt="Avatar">`
              : `<i class="ti ti-user"></i>`
            }
          </div>
          <span class="user-name">${this.user.profile?.displayName || this.user.email.split("@")[0]}</span>
          <i class="ti ti-chevron-down"></i>
        </div>
        <div class="user-dropdown">
          <a href="profile.html" class="dropdown-item">
            <i class="ti ti-user"></i> My Profile
          </a>
          <a href="dashboard.html" class="dropdown-item">
            <i class="ti ti-dashboard"></i> Dashboard
          </a>
          <hr class="dropdown-divider">
          <button class="dropdown-item logout-btn" id="logout-btn">
            <i class="ti ti-logout"></i> Logout
          </button>
        </div>
      `;
      navbar.appendChild(userMenu);

      document.getElementById("logout-btn").addEventListener("click", () => this.logout());

      const trigger = userMenu.querySelector(".user-menu-trigger");
      const dropdown = userMenu.querySelector(".user-dropdown");
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
      });

      document.addEventListener("click", () => {
        dropdown.classList.remove("show");
      });
    }
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.log("Logout error:", error);
    }

    this.user = null;
    this.isLoggedIn = false;
    window.location.href = "index.html";
  },

  requireAuth(redirectUrl = "auth/auth.html") {
    if (!this.isLoggedIn) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },
};

document.addEventListener("DOMContentLoaded", () => {
  auth.init();
});
