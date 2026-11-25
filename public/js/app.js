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

generateButton.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    message.textContent = 'Please enter a description first.';
    promptInput.focus();
    return;
  }

  loadingOverlay.classList.add('active');
  generateButton.disabled = true;
  message.textContent = 'Sending prompt to PolyGen backend...';

  try {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Generation request failed.');
    }

    updatePreview(prompt);

    const specification = data.report.specification;
    const jobId = data.report.jobId;

    modelName.textContent = `Job: ${specification.asset.object}`;

    modelDescription.textContent =
      `Color: ${specification.asset.appearance.color} | ` +
      `Material: ${specification.asset.appearance.material} | ` +
      `Size: ${specification.asset.size}`;

    message.textContent =
      `Backend accepted request · Mock mode · Job ID: ${jobId}`;

  } catch (error) {
    console.error('Generation error:', error);
    message.textContent = `Error: ${error.message}`;
  } finally {
    loadingOverlay.classList.remove('active');
    generateButton.disabled = false;
  }
});

document.getElementById('reset-view').addEventListener('click', resetView);
document.getElementById('wireframe').addEventListener('click', toggleWireframe);
