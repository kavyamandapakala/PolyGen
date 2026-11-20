const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { saveJob } = require("../src/job-history");

const {
  listJobs,
  showJob
} = require("../src/job-history-viewer");

function createTempDirectory() {
  return fs.mkdtempSync(
    path.join(os.tmpdir(), "polygen-viewer-")
  );
}

test("listJobs should show a message when history is empty", () => {
  const directory = createTempDirectory();

  try {
    assert.equal(
      listJobs(directory),
      "No generation jobs found."
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("listJobs should display saved job information", () => {
  const directory = createTempDirectory();

  try {
    saveJob({
      specification: {
        sourcePrompt: "Create a red sports car"
      },
      status: "QUEUED"
    }, directory);

    const result = listJobs(directory);

    assert.match(result, /Create a red sports car/);
    assert.match(result, /QUEUED/);
    assert.match(result, /Job ID:/);
    assert.match(result, /Created:/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("showJob should display complete job details", () => {
  const directory = createTempDirectory();

  try {
    const savedJob = saveJob({
      prompt: "Create a blue cube",
      status: "COMPLETED"
    }, directory);

    const result = showJob(savedJob.jobId, directory);

    assert.match(result, /Create a blue cube/);
    assert.match(result, /COMPLETED/);
    assert.match(result, new RegExp(savedJob.jobId));
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("showJob should report when a job does not exist", () => {
  const directory = createTempDirectory();

  try {
    assert.equal(
      showJob("unknown-job", directory),
      "Job not found: unknown-job"
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("listJobs should display multiple saved jobs", () => {
  const directory = createTempDirectory();

  try {
    saveJob({
      prompt: "Create a cube",
      status: "QUEUED"
    }, directory);

    saveJob({
      prompt: "Create a sphere",
      status: "COMPLETED"
    }, directory);

    const result = listJobs(directory);

    assert.match(result, /Create a cube/);
    assert.match(result, /Create a sphere/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
