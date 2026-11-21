const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { saveJob } = require("../src/job-history");
const { findJobs } = require("../src/job-search");

function createTempDirectory() {
  return fs.mkdtempSync(
    path.join(os.tmpdir(), "polygen-search-")
  );
}

function addSampleJobs(directory) {
  saveJob({
    specification: {
      sourcePrompt: "Create a red sports car"
    },
    status: "QUEUED"
  }, directory);

  saveJob({
    specification: {
      sourcePrompt: "Create a blue cube"
    },
    status: "COMPLETED"
  }, directory);

  saveJob({
    specification: {
      sourcePrompt: "Create a red wooden chair"
    },
    status: "COMPLETED"
  }, directory);
}

test("findJobs should search prompts by keyword", () => {
  const directory = createTempDirectory();

  try {
    addSampleJobs(directory);

    const results = findJobs(
      { keyword: "sports car" },
      directory
    );

    assert.equal(results.length, 1);
    assert.match(
      results[0].specification.sourcePrompt,
      /sports car/
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("findJobs should search without case sensitivity", () => {
  const directory = createTempDirectory();

  try {
    addSampleJobs(directory);

    const results = findJobs(
      { keyword: "RED" },
      directory
    );

    assert.equal(results.length, 2);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("findJobs should filter jobs by status", () => {
  const directory = createTempDirectory();

  try {
    addSampleJobs(directory);

    const results = findJobs(
      { status: "COMPLETED" },
      directory
    );

    assert.equal(results.length, 2);
    assert.ok(results.every(job => job.status === "COMPLETED"));
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("findJobs should combine keyword and status filters", () => {
  const directory = createTempDirectory();

  try {
    addSampleJobs(directory);

    const results = findJobs(
      { keyword: "red", status: "COMPLETED" },
      directory
    );

    assert.equal(results.length, 1);
    assert.match(
      results[0].specification.sourcePrompt,
      /red wooden chair/
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("findJobs should return an empty array when no jobs match", () => {
  const directory = createTempDirectory();

  try {
    addSampleJobs(directory);

    const results = findJobs(
      { keyword: "airplane" },
      directory
    );

    assert.deepEqual(results, []);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("findJobs should return all jobs when no filters are supplied", () => {
  const directory = createTempDirectory();

  try {
    addSampleJobs(directory);

    const results = findJobs({}, directory);

    assert.equal(results.length, 3);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("findJobs should handle an empty history directory", () => {
  const directory = createTempDirectory();

  try {
    const results = findJobs(
      { keyword: "car" },
      directory
    );

    assert.deepEqual(results, []);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
