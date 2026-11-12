const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parsePrompt,
  validateSpec
} = require("../src/prompt-to-spec");

test("Extracts object, colour and material", () => {
  const result = parsePrompt("A red wooden chair");

  assert.equal(result.asset.object, "chair");
  assert.equal(result.asset.appearance.color, "red");
  assert.equal(result.asset.appearance.material, "wooden");
});

test("Extracts style and size", () => {
  const result = parsePrompt("A large low-poly blue robot");

  assert.equal(result.asset.size, "large");
  assert.equal(result.asset.appearance.style, "low-poly");
  assert.equal(result.asset.appearance.color, "blue");
});

test("Detects geometric shapes", () => {
  const result = parsePrompt("A metal robot shaped like a sphere");

  assert.equal(result.asset.geometry, "sphere");
});

test("Rejects empty prompts", () => {
  assert.throws(() => parsePrompt(""));
});

test("Rejects prompts over 1024 characters", () => {
  assert.throws(() => parsePrompt("a".repeat(1025)));
});

test("Validates a complete specification", () => {
  const result = parsePrompt("A green plastic toy car");
  const validation = validateSpec(result);

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.errors, []);
});
