const {
  getAllJobs,
  getJobById
} = require("./job-history");

function listJobs(historyDirectory = "outputs/history") {
  const jobs = getAllJobs(historyDirectory);

  if (jobs.length === 0) {
    return "No generation jobs found.";
  }

  return jobs.map((job, index) => {
    const prompt =
      job.specification?.sourcePrompt ||
      job.prompt ||
      "Not available";

    const status =
      job.status ||
      job.generationResult?.status ||
      "Not available";

    return [
      `${index + 1}. Job ID: ${job.jobId}`,
      `   Prompt: ${prompt}`,
      `   Status: ${status}`,
      `   Created: ${job.createdAt || "Not available"}`
    ].join("\n");
  }).join("\n\n");
}

function showJob(jobId, historyDirectory = "outputs/history") {
  const job = getJobById(jobId, historyDirectory);

  if (!job) {
    return `Job not found: ${jobId}`;
  }

  return JSON.stringify(job, null, 2);
}

if (require.main === module) {
  const [command, jobId] = process.argv.slice(2);

  if (command === "list") {
    console.log(listJobs());
  } else if (command === "show" && jobId) {
    console.log(showJob(jobId));
  } else {
    console.log("PolyGen Job History Viewer");
    console.log("");
    console.log("Usage:");
    console.log("  node src/job-history-viewer.js list");
    console.log("  node src/job-history-viewer.js show <jobId>");
  }
}

module.exports = {
  listJobs,
  showJob
};
