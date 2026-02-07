document.addEventListener("DOMContentLoaded", function() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  if (toggle) toggle.addEventListener("click", () => nav.classList.toggle("active"));

  // Admin login handler
  const loginForm = document.getElementById("adminLoginForm");
  const adminSection = document.getElementById("adminSection");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const user = document.getElementById("adminUser").value.trim();
      const pass = document.getElementById("adminPass").value.trim();
      if (user === "ADMIN" && pass === "SELVI@2025") {
        loginForm.style.display = "none";
        adminSection.style.display = "block";
      } else {
        alert("Invalid credentials. Please try again.");
      }
    });
  }
});

fetch("nav.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("nav-placeholder").innerHTML = data;
  });

function toggleMenu() {
  const nav = document.getElementById("mainNav");
  if (nav) {
    nav.classList.toggle("show");
  }
}

