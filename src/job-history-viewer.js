const {
  getAllJobs,
  getJobById
} = require("./job-history");

const { findJobs } = require("./job-search");

function formatJobs(jobs) {
  if (jobs.length === 0) {
    return "No matching generation jobs found.";
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

function listJobs(historyDirectory = "outputs/history") {
  const jobs = getAllJobs(historyDirectory);

  if (jobs.length === 0) {
    return "No generation jobs found.";
  }

  return formatJobs(jobs);
}

function searchJobs(
  keyword,
  status = "",
  historyDirectory = "outputs/history"
) {
  return formatJobs(
    findJobs({ keyword, status }, historyDirectory)
  );
}

function filterJobs(
  status,
  historyDirectory = "outputs/history"
) {
  return formatJobs(
    findJobs({ status }, historyDirectory)
  );
}

function showJob(jobId, historyDirectory = "outputs/history") {
  const job = getJobById(jobId, historyDirectory);

  if (!job) {
    return `Job not found: ${jobId}`;
  }

  return JSON.stringify(job, null, 2);
}

if (require.main === module) {
  const [command, firstArgument, secondArgument] =
    process.argv.slice(2);

  if (command === "list") {
    console.log(listJobs());
  } else if (command === "show" && firstArgument) {
    console.log(showJob(firstArgument));
  } else if (command === "search" && firstArgument) {
    console.log(searchJobs(firstArgument, secondArgument || ""));
  } else if (command === "filter" && firstArgument) {
    console.log(filterJobs(firstArgument));
  } else {
    console.log("PolyGen Job History Viewer");
    console.log("");
    console.log("Usage:");
    console.log("  node src/job-history-viewer.js list");
    console.log("  node src/job-history-viewer.js show <jobId>");
    console.log("  node src/job-history-viewer.js search <keyword> [status]");
    console.log("  node src/job-history-viewer.js filter <status>");
  }
}

module.exports = {
  listJobs,
  searchJobs,
  filterJobs,
  showJob
};
