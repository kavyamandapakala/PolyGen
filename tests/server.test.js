
const test = require("node:test");
const assert = require("node:assert/strict");
const { createServer } = require("../src/server");

async function startTestServer(options) {
  const server = createServer(options);

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  return { server, baseUrl };
}

test("GET /api/jobs should return all saved jobs", async () => {
  const sampleJobs = [
    { jobId: "job-1", status: "QUEUED" },
    { jobId: "job-2", status: "COMPLETED" }
  ];

  const { server, baseUrl } = await startTestServer({
    getAllJobsFn: () => sampleJobs
  });

  try {
    const response = await fetch(`${baseUrl}/api/jobs`);
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(data.jobs, sampleJobs);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("GET /api/jobs/:id should return an existing job", async () => {
  const sampleJob = {
    jobId: "job-123",
    status: "QUEUED"
  };

  const { server, baseUrl } = await startTestServer({
    getJobByIdFn: (id) =>
      id === "job-123" ? sampleJob : null
  });

  try {
    const response = await fetch(`${baseUrl}/api/jobs/job-123`);
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(data.job, sampleJob);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("GET /api/jobs/:id should return 404 for an unknown job", async () => {
  const { server, baseUrl } = await startTestServer({
    getJobByIdFn: () => null
  });

  try {
    const response = await fetch(`${baseUrl}/api/jobs/unknown-job`);
    const data = await response.json();

    assert.equal(response.status, 404);
    assert.equal(data.error, "Job not found.");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
