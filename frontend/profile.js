const API_BASE = "http://localhost:4000/api";

document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = await auth.init();
  if (!isLoggedIn) {
    window.location.href = "auth/auth.html";
    return;
  }

  await loadProfile();
  await loadStats();
  setupEventListeners();
});

async function loadProfile() {
  try {
    const response = await fetch(`${API_BASE}/profile/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to load profile");
    }

    const data = await response.json();
    const profile = data.profile;

    document.getElementById("profile-name").textContent =
      profile.displayName || auth.user.email.split("@")[0];
    document.getElementById("profile-email").textContent = auth.user.email;

    if (profile.bio) {
      document.getElementById("profile-bio").textContent = profile.bio;
    }

    if (profile.avatarUrl) {
      document.getElementById("avatar-preview").src = profile.avatarUrl;
      document.getElementById("avatar-preview").style.display = "block";
      document.getElementById("avatar-placeholder").style.display = "none";
    } else {
      document.getElementById("avatar-preview").style.display = "none";
      document.getElementById("avatar-placeholder").style.display = "flex";
    }

    document.getElementById("edit-name").value = profile.displayName || "";
    document.getElementById("edit-bio").value = profile.bio || "";
  } catch (error) {
    console.error("Error loading profile:", error);
    alert("Failed to load profile");
  }
}

async function loadStats() {
  try {
    const response = await fetch(`${API_BASE}/profile/stats`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to load stats");
    }

    const data = await response.json();
    const stats = data.stats;

    document.getElementById("stat-lessons").textContent = stats.totalCompletedLessons;
    document.getElementById("stat-challenges").textContent = stats.totalCompletedChallenges;

    const joinDate = new Date(stats.memberSince);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    document.getElementById("stat-joined").textContent =
      `${monthNames[joinDate.getMonth()]} ${joinDate.getFullYear()}`;

    document.getElementById("profile-member-since").textContent =
      `Member since ${monthNames[joinDate.getMonth()]} ${joinDate.getFullYear()}`;
  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

function setupEventListeners() {
  const btnToggleEdit = document.getElementById("btn-toggle-edit");
  const editForm = document.getElementById("edit-form");
  const btnCancelEdit = document.getElementById("btn-cancel-edit");
  const profileForm = document.getElementById("profile-form");

  btnToggleEdit.addEventListener("click", () => {
    editForm.style.display = editForm.style.display === "none" ? "block" : "none";
    btnToggleEdit.style.display = "none";
  });

  btnCancelEdit.addEventListener("click", () => {
    editForm.style.display = "none";
    btnToggleEdit.style.display = "block";
  });

  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await updateProfile();
  });

  const avatarInput = document.getElementById("edit-avatar");
  avatarInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById("avatar-preview").src = event.target.result;
        document.getElementById("avatar-preview").style.display = "block";
        document.getElementById("avatar-placeholder").style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  const btnTogglePassword = document.getElementById("btn-toggle-password");
  const passwordForm = document.getElementById("password-form");
  const btnCancelPassword = document.getElementById("btn-cancel-password");
  const changePasswordForm = document.getElementById("change-password-form");

  btnTogglePassword.addEventListener("click", () => {
    passwordForm.style.display = passwordForm.style.display === "none" ? "block" : "none";
  });

  btnCancelPassword.addEventListener("click", () => {
    passwordForm.style.display = "none";
    changePasswordForm.reset();
  });

  changePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await changePassword();
  });
}

async function updateProfile() {
  const displayName = document.getElementById("edit-name").value.trim();
  const bio = document.getElementById("edit-bio").value.trim();
  const avatarFile = document.getElementById("edit-avatar").files[0];

  try {
    if (displayName || bio) {
      const response = await fetch(`${API_BASE}/profile/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: displayName || null,
          bio: bio || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
    }

    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await fetch(`${API_BASE}/profile/avatar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload avatar");
      }
    }

    alert("Profile updated successfully!");
    document.getElementById("edit-form").style.display = "none";
    document.getElementById("btn-toggle-edit").style.display = "block";
    await loadProfile();
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile");
  }
}

async function changePassword() {
  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/password`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to change password");
    }

    alert("Password changed successfully!");
    document.getElementById("password-form").style.display = "none";
    document.getElementById("change-password-form").reset();
  } catch (error) {
    console.error("Error changing password:", error);
    alert(error.message || "Failed to change password");
  }
}
