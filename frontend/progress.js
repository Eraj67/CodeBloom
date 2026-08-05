// ===========================================
// Progress Ring
// TODO:
// Replace the static progress value with data
// from the backend progress API once available.
//
// This file is intended to be reusable for
// Lessons, Projects, and Challenges.
// Only the API endpoint/data source should
// change based on the page type; the progress
// ring animation logic remain shared.
// ===========================================

const progress = 65;
const circle = document.querySelector(".progress");
const radius = 70;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference - (progress / 100) * circumference;
document.querySelector(".progress-text h3").textContent = `${progress}%`;