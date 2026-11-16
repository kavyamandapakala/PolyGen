const fs = require("node:fs");
const path = require("node:path");

const { parsePrompt } = require("./prompt-to-spec");

const {
  MockGenerationProvider,
  generateAsset
} = require("./generation-provider");

async function runPipeline(prompt, outputDirectory = "outputs") {
  const specification = parsePrompt(prompt);
  const provider = new MockGenerationProvider();

  const generationResult = await generateAsset(
    specification,
    provider
  );

  const report = {
    project: "PolyGen",
    createdAt: new Date().toISOString(),
    specification,
    generationResult,
    pipelineStatus: "COMPLETED"
  };

  fs.mkdirSync(outputDirectory, { recursive: true });

  const reportPath = path.join(
    outputDirectory,
    "latest-generation-job.json"
  );

  fs.writeFileSync(
    reportPath,
    JSON.stringify(report, null, 2)
  );

  return {
    report,
    reportPath
  };
}

if (require.main === module) {
  const prompt = process.argv.slice(2).join(" ");

  runPipeline(prompt)
    .then(({ report, reportPath }) => {
      console.log("PolyGen pipeline completed!");
      console.log(JSON.stringify(report, null, 2));
      console.log("Report saved:", reportPath);
    })
    .catch(error => {
      console.error("Pipeline failed:", error.message);
      process.exitCode = 1;
    });
}

module.exports = { runPipeline };
