const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { runPipeline } = require("../src/run-pipeline");

test("Runs the complete PolyGen pipeline", async () => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "polygen-")
  );

  try {
    const result = await runPipeline(
      "A red wooden chair",
      directory
    );

    assert.equal(result.report.pipelineStatus, "COMPLETED");
    assert.equal(
      result.report.specification.asset.object,
      "chair"
    );
    assert.equal(
      result.report.generationResult.status,
      "QUEUED"
    );
    assert.equal(fs.existsSync(result.reportPath), true);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("Saves the generation report as JSON", async () => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "polygen-")
  );

  try {
    const result = await runPipeline(
      "A blue metal robot",
      directory
    );

    const savedReport = JSON.parse(
      fs.readFileSync(result.reportPath, "utf8")
    );

    assert.equal(savedReport.project, "PolyGen");
    assert.equal(savedReport.specification.asset.object, "robot");
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("Rejects an empty prompt", async () => {
  await assert.rejects(
    () => runPipeline("")
  );
});

test("Rejects a prompt exceeding the allowed length", async () => {
  await assert.rejects(
    () => runPipeline("a".repeat(1025))
  );
});
