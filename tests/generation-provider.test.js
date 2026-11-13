const test = require("node:test");
const assert = require("node:assert/strict");

const { parsePrompt } = require("../src/prompt-to-spec");

const {
  buildGenerationRequest,
  MockGenerationProvider,
  generateAsset
} = require("../src/generation-provider");

test("Converts specification into generation request", () => {
  const spec = parsePrompt("A red wooden chair");
  const request = buildGenerationRequest(spec);

  assert.equal(request.prompt, "A red wooden chair");
  assert.equal(request.assetDetails.object, "chair");
  assert.equal(request.assetDetails.color, "red");
  assert.equal(request.outputFormat, "glb");
});

test("Rejects invalid specifications", () => {
  assert.throws(() => buildGenerationRequest({}));
});

test("Mock provider accepts valid generation requests", async () => {
  const provider = new MockGenerationProvider();

  const result = await provider.submit({
    prompt: "A blue robot",
    outputFormat: "glb"
  });

  assert.equal(result.provider, "mock");
  assert.equal(result.status, "QUEUED");
  assert.equal(result.taskId, "POLYGEN-DEMO-001");
});

test("Complete pipeline submits a prompt to mock provider", async () => {
  const spec = parsePrompt("A green plastic toy car");
  const provider = new MockGenerationProvider();

  const result = await generateAsset(spec, provider);

  assert.equal(result.status, "QUEUED");
  assert.equal(result.outputFormat, "glb");
});

test("Rejects missing generation provider", async () => {
  const spec = parsePrompt("A red wooden chair");

  await assert.rejects(
    () => generateAsset(spec, null),
    /valid generation provider/
  );
});

test("Rejects provider without submit method", async () => {
  const spec = parsePrompt("A red wooden chair");

  await assert.rejects(
    () => generateAsset(spec, {}),
    /valid generation provider/
  );
});
