// quiz.js : multiplechoice quiz behavior for CodeBloom lessons
// Pattern: learner picks an option, then clicks Reveal to see the
// correct answer and the explanation. Nothing is graded/submitted
// anywhere  this is just for the learner's own feedback

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.quiz-question').forEach(initQuizQuestion);
});

function initQuizQuestion(questionEl) {
  const correctValue = questionEl.dataset.answer;
  const optionButtons = questionEl.querySelectorAll('.quiz-option');
  const revealBtn = questionEl.querySelector('.quiz-reveal-btn');
  const explanation = questionEl.querySelector('.quiz-explanation');

  let selectedValue = null;

  // Picking an option just marks it selected no feedback yet.
  optionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      optionButtons.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedValue = btn.dataset.value;
    });
  });

  // Reveal shows the explanation and highlights correct/incorrect.
  if (revealBtn) {
    revealBtn.addEventListener('click', () => {
      if (explanation) {
        explanation.removeAttribute('hidden');
      }

      optionButtons.forEach((btn) => {
        const isCorrect = btn.dataset.value === correctValue;
        const isSelected = btn.dataset.value === selectedValue;

        if (isCorrect) {
          btn.classList.add('correct');
        } else if (isSelected) {
          btn.classList.add('incorrect');
        }

        btn.disabled = true;
      });

      revealBtn.disabled = true;
    });
  }
}