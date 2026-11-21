const { getAllJobs } = require("./job-history");

function findJobs(
  { keyword = "", status = "" } = {},
  historyDirectory = "outputs/history"
) {
  const jobs = getAllJobs(historyDirectory);

  const normalizedKeyword = keyword.trim().toLowerCase();
  const normalizedStatus = status.trim().toUpperCase();

  return jobs.filter(job => {
    const prompt =
      job.specification?.sourcePrompt ||
      job.prompt ||
      "";

    const jobStatus =
      job.status ||
      job.generationResult?.status ||
      "";

    const matchesKeyword =
      !normalizedKeyword ||
      prompt.toLowerCase().includes(normalizedKeyword);

    const matchesStatus =
      !normalizedStatus ||
      jobStatus.toUpperCase() === normalizedStatus;

    return matchesKeyword && matchesStatus;
  });
}

module.exports = { findJobs };
