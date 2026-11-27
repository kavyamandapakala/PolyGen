
import {
  updatePreview,
  resetView,
  toggleWireframe
} from './viewer.js';

const API_URL = 'http://localhost:3000/api';

const promptInput = document.getElementById('prompt');
const charCount = document.getElementById('char-count');
const generateButton = document.getElementById('generate-btn');
const message = document.getElementById('generation-message');

const modelName = document.getElementById('model-name');
const modelDescription = document.getElementById('model-description');
const loadingOverlay = document.getElementById('loading-overlay');

// Job lookup elements
const jobLookupForm = document.getElementById('job-lookup-form');
const jobIdInput = document.getElementById('job-id-input');
const lookupButton = document.getElementById('lookup-job-btn');
const jobMessage = document.getElementById('job-lookup-message');
const jobDetails = document.getElementById('job-details');

// Update prompt character count
promptInput.addEventListener('input', () => {
  charCount.textContent = `${promptInput.value.length} / 1024`;
});

// Example prompt buttons
document.querySelectorAll('.example-chip').forEach((button) => {
  button.addEventListener('click', () => {
    promptInput.value = button.dataset.prompt;
    promptInput.dispatchEvent(new Event('input'));
  });
});

// Generate a new job
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
    const response = await fetch(`${API_URL}/generate`, {
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

    modelName.textContent =
      `AI-Generated ${specification.asset.object}`;

    modelDescription.textContent =
      `Color: ${specification.asset.appearance.color} | ` +
      `Material: ${specification.asset.appearance.material} | ` +
      `Size: ${specification.asset.size}`;

    message.textContent =
      `Backend accepted request · Mock mode · Job ID: ${jobId}`;

    // Make the new job ID available for lookup
    jobIdInput.value = jobId;

  } catch (error) {
    console.error('Generation error:', error);
    message.textContent = `Error: ${error.message}`;
  } finally {
    loadingOverlay.classList.remove('active');
    generateButton.disabled = false;
  }
});

// Retrieve an existing job using its ID
jobLookupForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const jobId = jobIdInput.value.trim();

  if (!jobId) {
    jobMessage.textContent = 'Please enter a Job ID.';
    jobDetails.hidden = true;
    return;
  }

  lookupButton.disabled = true;
  lookupButton.textContent = 'Searching...';
  jobMessage.textContent = 'Retrieving job details...';
  jobDetails.hidden = true;

  try {
    const response = await fetch(
      `${API_URL}/jobs/${encodeURIComponent(jobId)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to retrieve job.');
    }

    const job = data.job;
    const specification = job.specification;
    const asset = specification.asset;
    const appearance = asset.appearance;

    document.getElementById('detail-job-id').textContent = job.jobId;
    document.getElementById('detail-prompt').textContent =
      specification.sourcePrompt || 'Not available';

    document.getElementById('detail-object').textContent =
      asset.object || 'Not available';

    document.getElementById('detail-color').textContent =
      appearance.color || 'Not available';

    document.getElementById('detail-material').textContent =
      appearance.material || 'Not available';

    document.getElementById('detail-size').textContent =
      asset.size || 'Not available';

    document.getElementById('detail-pipeline-status').textContent =
      job.pipelineStatus || 'Not available';

    const createdAt = job.createdAt
      ? new Date(job.createdAt).toLocaleString()
      : 'Not available';

    document.getElementById('detail-created-at').textContent =
      createdAt;

    const status = document.getElementById('job-status');
    status.textContent = job.status || 'UNKNOWN';

    jobDetails.hidden = false;
    jobMessage.textContent = 'Job retrieved successfully.';

  } catch (error) {
    console.error('Job lookup error:', error);
    jobMessage.textContent = error.message;
    jobDetails.hidden = true;
  } finally {
    lookupButton.disabled = false;
    lookupButton.textContent = 'Find Job';
  }
});

// 3D viewer controls
document.getElementById('reset-view').addEventListener('click', resetView);
document.getElementById('wireframe').addEventListener('click', toggleWireframe);
