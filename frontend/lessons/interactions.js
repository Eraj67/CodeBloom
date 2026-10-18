// interactions.js — small reusable behaviors for CodeBloom lessons
// Handles: "Spot the bug" reveal buttons, confidence-check buttons
// (Quiz answer-checking logic lives separately in quiz.js)

document.addEventListener('DOMContentLoaded', () => {
  setupBugReveals();
  setupConfidenceChecks();
});

// Spot the bug: click reveals the hidden explanation
function setupBugReveals() {
  document.querySelectorAll('.bug-reveal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;

      const isHidden = target.hasAttribute('hidden');
      if (isHidden) {
        target.removeAttribute('hidden');
        btn.textContent = 'Hide answer';
      } else {
        target.setAttribute('hidden', '');
        btn.textContent = "Reveal what's wrong";
      }
    });
  });
}

//Confidence check: pick one, no grading, no correct answer
function setupConfidenceChecks() {
  document.querySelectorAll('.confidence-group').forEach((group) => {
    const buttons = group.querySelectorAll('.confidence-btn');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}