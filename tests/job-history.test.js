const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  saveJob,
  getAllJobs,
  getJobById,
  updateJobStatus
} = require("../src/job-history");

function createTempDirectory() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "polygen-history-"));
}

test("saveJob should save a job with a unique ID", () => {
  const directory = createTempDirectory();

  try {
    const savedJob = saveJob(
      { prompt: "Create a red cube", status: "QUEUED" },
      directory
    );

    assert.ok(savedJob.jobId);
    assert.ok(savedJob.createdAt);
    assert.equal(savedJob.prompt, "Create a red cube");
    assert.ok(fs.existsSync(path.join(directory, `${savedJob.jobId}.json`)));
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("getAllJobs should return all saved jobs", () => {
  const directory = createTempDirectory();

  try {
    saveJob({ prompt: "Create a cube" }, directory);
    saveJob({ prompt: "Create a sphere" }, directory);

    const jobs = getAllJobs(directory);

    assert.equal(jobs.length, 2);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("getJobById should find a saved job", () => {
  const directory = createTempDirectory();

  try {
    const savedJob = saveJob(
      { prompt: "Create a blue sphere" },
      directory
    );

    const foundJob = getJobById(savedJob.jobId, directory);

    assert.equal(foundJob.jobId, savedJob.jobId);
    assert.equal(foundJob.prompt, "Create a blue sphere");
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("getJobById should return null for an unknown job", () => {
  const directory = createTempDirectory();

  try {
    assert.equal(getJobById("unknown-job", directory), null);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("updateJobStatus should update an existing job", () => {
  const directory = createTempDirectory();

  try {
    const savedJob = saveJob(
      { prompt: "Create a green cylinder", status: "QUEUED" },
      directory
    );

    const updatedJob = updateJobStatus(
      savedJob.jobId,
      "COMPLETED",
      { message: "Generation finished" },
      directory
    );

    assert.equal(updatedJob.status, "COMPLETED");
    assert.equal(updatedJob.message, "Generation finished");
    assert.ok(updatedJob.updatedAt);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("saveJob should reject invalid job input", () => {
  const directory = createTempDirectory();

  try {
    assert.throws(
      () => saveJob(null, directory),
      /valid job object/
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
