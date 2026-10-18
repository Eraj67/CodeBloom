// sandbox.js  live code sandbox for CodeBloom lessons
//
// Currently supports: data-mode="html"
// To add later on the upcoming courses: data-mode="css", data-mode="js"

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.sandbox').forEach(initSandbox);
});

// One runner function per mode. Each takes the raw code string
// and the target iframe, and is responsible for showing the result.
const modes = {
  html: (code, iframe) => {
    // Render the learner's HTML directly inside the iframe.
    iframe.srcdoc = code;
  },

};

function initSandbox(sandboxEl) {
  const mode = sandboxEl.dataset.mode;
  const id = sandboxEl.dataset.sandboxId;

  const textarea = document.getElementById(`${id}-code`);
  const iframe = document.getElementById(`${id}-output`);
  const runBtn = sandboxEl.querySelector('.sandbox-run-btn');

  if (!textarea || !iframe || !runBtn) {
    console.warn(`Sandbox "${id}" is missing a required element.`);
    return;
  }

  const runner = modes[mode];
  if (!runner) {
    console.warn(`Sandbox "${id}" has unsupported mode "${mode}".`);
    return;
  }

  function run() {
    runner(textarea.value, iframe);
  }

  runBtn.addEventListener('click', run);

  // Show a preview immediately on page load, not just after the

  run();
}