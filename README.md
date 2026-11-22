# PolyGen – Generative Text-to-3D Asset Pipeline

**Internship Project | Infotact Solutions | Generative AI Domain**

## Project Overview

PolyGen is a Generative AI project that aims to convert text descriptions into 3D assets. The project explores prompt processing, generation-provider integration, pipeline execution, and output management.

## Project Objective

The objective is to develop a practical text-to-3D asset generation workflow by studying Generative AI technologies, prompt engineering, AI service integration, and 3D asset generation.

## Current Features

- Text prompt parsing into a structured 3D asset specification.
- Extraction of object, colour, material, shape, style, and size information.
- Generation-provider interface with a mock implementation.
- Pipeline execution and JSON report generation.
- Persistent generation job history.
- Command-line job history viewer.
- Job search and status filtering.
- Automated tests for implemented modules.

## Project Architecture

The current prototype follows this workflow:

```text
Text Prompt
    |
    v
Prompt-to-Spec Parser
    |
    v
Structured 3D Specification
    |
    v
Generation Provider
    |
    v
Pipeline Execution
    |
    v
JSON Report and Job History
```

The current generation provider is a mock implementation used to test the pipeline. Actual AI-powered 3D asset generation and downloadable 3D output are planned for the next development phase.

## Technology

- JavaScript
- Node.js
- JSON
- Node.js built-in test runner
- Git and GitHub

## Running the Tests

```bash
node --test
```

## Project Structure

```text
PolyGen/
├── docs/
│   ├── project-understanding.md
│   └── architecture-and-development-status.md
├── src/
│   ├── prompt-to-spec.js
│   ├── generation-provider.js
│   ├── run-pipeline.js
│   ├── job-history.js
│   ├── job-history-viewer.js
│   └── job-search.js
└── tests/
    ├── prompt-to-spec.test.js
    ├── generation-provider.test.js
    ├── run-pipeline.test.js
    ├── job-history.test.js
    ├── job-history-viewer.test.js
    └── job-search.test.js
```

## Development Status

The initial prototype includes prompt parsing, mock provider integration, pipeline execution, reporting, and job management.

The next phase will focus on integrating an actual text-to-3D generation service, retrieving generated assets, and evaluating the resulting 3D outputs.

## Internship Deliverables

- Source code
- Technical documentation
- Project report
- Presentation
- Model evaluation results, if applicable
- Final project demonstration, if applicable
