const { validateSpec } = require("./prompt-to-spec");

function buildGenerationRequest(spec) {
  const validation = validateSpec(spec);

  if (!validation.valid) {
    throw new Error(
      `Invalid specification: ${validation.errors.join(", ")}`
    );
  }

  return {
    prompt: spec.sourcePrompt,
    outputFormat: spec.outputFormat,
    assetDetails: {
      object: spec.asset.object,
      geometry: spec.asset.geometry,
      color: spec.asset.appearance.color,
      material: spec.asset.appearance.material,
      style: spec.asset.appearance.style,
      size: spec.asset.size
    }
  };
}

class MockGenerationProvider {
  async submit(request) {
    if (!request || !request.prompt) {
      throw new Error("A valid generation request is required.");
    }

    return {
      provider: "mock",
      taskId: "POLYGEN-DEMO-001",
      status: "QUEUED",
      message: "Mock generation request accepted.",
      outputFormat: request.outputFormat
    };
  }
}

async function generateAsset(spec, provider) {
  if (!provider || typeof provider.submit !== "function") {
    throw new Error("A valid generation provider is required.");
  }

  const request = buildGenerationRequest(spec);

  return await provider.submit(request);
}

module.exports = {
  buildGenerationRequest,
  MockGenerationProvider,
  generateAsset
};
