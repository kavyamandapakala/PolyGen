const COLORS = [
  "red", "blue", "green", "yellow", "black",
  "white", "orange", "purple", "brown", "silver"
];

const MATERIALS = [
  "wooden", "metal", "plastic", "glass",
  "stone", "marble", "clay", "metallic"
];

const SHAPES = [
  "cube", "sphere", "cylinder", "cone", "torus"
];

const STYLES = [
  "low-poly", "realistic", "cartoon", "modern"
];

const SIZES = ["small", "medium", "large"];

function findKeyword(words, keywords) {
  return keywords.find(keyword =>
    words.includes(keyword)
  ) || "unspecified";
}

function parsePrompt(prompt) {
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("Please enter a valid text prompt.");
  }

  if (prompt.length > 1024) {
    throw new Error("Prompt must not exceed 1024 characters.");
  }

  const words = prompt.toLowerCase().match(/[a-z-]+/g) || [];

  const color = findKeyword(words, COLORS);
  const material = findKeyword(words, MATERIALS);
  const shape = findKeyword(words, SHAPES);
  const style = findKeyword(words, STYLES);
  const size = findKeyword(words, SIZES);

  const ignored = [
    "a", "an", "the", "of", "with", "made", "from",
    "in", "and", ...COLORS, ...MATERIALS,
    ...SHAPES, ...STYLES, ...SIZES
  ];

  const object = words
    .filter(word => !ignored.includes(word))
    .join(" ");

  if (!object) {
    throw new Error("Please describe the 3D object.");
  }

  return {
    project: "PolyGen",
    sourcePrompt: prompt.trim(),
    asset: {
      object,
      geometry: shape,
      appearance: {
        color,
        material,
        style
      },
      size
    },
    outputFormat: "glb",
    status: "SPECIFICATION_READY"
  };
}

function validateSpec(spec) {
  const errors = [];

  if (!spec.sourcePrompt) {
    errors.push("Missing source prompt");
  }

  if (!spec.asset || !spec.asset.object) {
    errors.push("Missing object description");
  }

  if (!spec.outputFormat) {
    errors.push("Missing output format");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

if (require.main === module) {
  try {
    const prompt = process.argv.slice(2).join(" ");
    const spec = parsePrompt(prompt);
    const validation = validateSpec(spec);

    if (!validation.valid) {
      throw new Error(validation.errors.join(", "));
    }

    console.log(JSON.stringify({
      specification: spec,
      validation
    }, null, 2));
  } catch (error) {
    console.error("ERROR:", error.message);
    process.exitCode = 1;
  }
}

module.exports = { parsePrompt, validateSpec };
