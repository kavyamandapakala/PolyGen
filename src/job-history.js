const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

function saveJob(job, historyDirectory = "outputs/history") {
  if (!job || typeof job !== "object") {
    throw new Error("A valid job object is required.");
  }

  const jobRecord = {
    ...job,
    jobId: job.jobId || randomUUID(),
    createdAt: job.createdAt || new Date().toISOString()
  };

  fs.mkdirSync(historyDirectory, { recursive: true });

  const filePath = path.join(
    historyDirectory,
    `${jobRecord.jobId}.json`
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(jobRecord, null, 2)
  );

  return jobRecord;
}

function getAllJobs(historyDirectory = "outputs/history") {
  if (!fs.existsSync(historyDirectory)) {
    return [];
  }

  const files = fs.readdirSync(historyDirectory)
    .filter(file => file.endsWith(".json"));

  const jobs = files.map(file => {
    const filePath = path.join(historyDirectory, file);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  });

  return jobs.sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
}

function getJobById(jobId, historyDirectory = "outputs/history") {
  if (!jobId || path.basename(jobId) !== jobId) {
    throw new Error("A valid job ID is required.");
  }

  const filePath = path.join(historyDirectory, `${jobId}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function updateJobStatus(
  jobId,
  status,
  updates = {},
  historyDirectory = "outputs/history"
) {
  if (!status || typeof status !== "string") {
    throw new Error("A valid job status is required.");
  }

  const existingJob = getJobById(jobId, historyDirectory);

  if (!existingJob) {
    throw new Error(`Job not found: ${jobId}`);
  }

  const updatedJob = {
    ...existingJob,
    ...updates,
    jobId: existingJob.jobId,
    status,
    updatedAt: new Date().toISOString()
  };

  const filePath = path.join(historyDirectory, `${jobId}.json`);

  fs.writeFileSync(
    filePath,
    JSON.stringify(updatedJob, null, 2)
  );

  return updatedJob;
}

module.exports = {
  saveJob,
  getAllJobs,
  getJobById,
  updateJobStatus
};
