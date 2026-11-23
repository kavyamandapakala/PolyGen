import { updatePreview, resetView, toggleWireframe } from './viewer.js';

const promptInput = document.getElementById('prompt');
const charCount = document.getElementById('char-count');
const generateButton = document.getElementById('generate-btn');
const message = document.getElementById('generation-message');
const modelName = document.getElementById('model-name');
const modelDescription = document.getElementById('model-description');
const loadingOverlay = document.getElementById('loading-overlay');

promptInput.addEventListener('input', () => {
  charCount.textContent = `${promptInput.value.length} / 1024`;
});

document.querySelectorAll('.example-chip').forEach((button) => {
  button.addEventListener('click', () => {
    promptInput.value = button.dataset.prompt;
    promptInput.dispatchEvent(new Event('input'));
  });
});

generateButton.addEventListener('click', () => {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    message.textContent = 'Please enter a description first.';
    promptInput.focus();
    return;
  }

  loadingOverlay.classList.add('active');
  generateButton.disabled = true;
  message.textContent = 'Updating sample preview...';

  // This is a local geometry preview, not AI generation.
  setTimeout(() => {
    try {
      updatePreview(prompt);

      const shortName = prompt.length > 35
        ? prompt.slice(0, 35) + '...'
        : prompt;

      modelName.textContent = 'Preview: ' + shortName;
      modelDescription.textContent =
        'Sample geometry selected from your prompt. No AI model was generated.';

      message.textContent = 'Sample preview updated · Demo mode';
    } catch (error) {
      console.error('Preview error:', error);
      message.textContent = 'Could not update the preview.';
    } finally {
      loadingOverlay.classList.remove('active');
      generateButton.disabled = false;
    }
  }, 500);
});

document.getElementById('reset-view').addEventListener('click', resetView);
document.getElementById('wireframe').addEventListener('click', toggleWireframe);
