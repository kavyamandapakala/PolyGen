# PolyGen – Architecture and Development Status

## 1. Introduction

PolyGen is a Generative AI project focused on developing a text-to-3D asset generation pipeline. The project explores how a text description can be processed into a structured specification and passed through a generation workflow.

## 2. Current Architecture

The current prototype is organized into the following stages:

1. **Prompt Input:** Accepts a textual description of the desired 3D object.
2. **Prompt Processing:** Converts the text into a structured specification.
3. **Generation Provider:** Accepts the structured specification and submits a generation request.
4. **Pipeline Execution:** Coordinates the processing stages and creates a JSON report.
5. **Job Management:** Stores generation job information and provides history, search, and filtering capabilities.

## 3. Implemented Modules

### 3.1 Prompt-to-Spec Parser

File: `src/prompt-to-spec.js`

The parser extracts information from a text prompt and creates a structured specification. The current implementation identifies attributes such as:

- Object
- Colour
- Material
- Shape or geometry
- Style
- Size

It also includes specification validation.

### 3.2 Generation Provider

File: `src/generation-provider.js`

The generation-provider module defines the request structure and provides a mock generation implementation.

The mock provider simulates accepting a generation request and returns information such as a task ID, provider name, status, and output format.

**Current limitation:** This implementation does not generate an actual 3D model. It is used to develop and test the pipeline before integrating a real generation service.

### 3.3 Pipeline Execution

File: `src/run-pipeline.js`

The pipeline coordinates prompt parsing, generation-request submission, report creation, and job-history storage.

The current implementation uses the mock generation provider.

### 3.4 Job History Management

File: `src/job-history.js`

This module manages the storage and retrieval of generation job records.

### 3.5 Job History Viewer

File: `src/job-history-viewer.js`

This module provides a command-line way to view previously recorded generation jobs.

### 3.6 Job Search and Filtering

File: `src/job-search.js`

This module supports searching job records using keywords and filtering them by status.

## 4. Testing

The project uses the Node.js built-in test runner.

The test files cover:

- Prompt parsing and specification validation.
- Generation-provider request handling.
- Pipeline execution and report creation.
- Job-history management.
- Job-history viewing.
- Job search and status filtering.

The latest recorded test run before this documentation update passed 34 tests with zero failures.

Tests should be run again after the documentation update to confirm the current repository state.

## 5. Current Development Status

| Area | Status |
|---|---|
| Project understanding and planning | Completed |
| Prompt-to-spec parser | Implemented |
| Mock generation provider | Implemented |
| Pipeline execution | Implemented |
| JSON report creation | Implemented |
| Job history management | Implemented |
| Command-line history viewer | Implemented |
| Job search and status filtering | Implemented |
| Real AI text-to-3D integration | Pending |
| Actual 3D asset retrieval and storage | Pending |
| 3D asset preview | Pending |
| Generated asset evaluation | Pending |
| Final application and demonstration | Pending |

## 6. Current Limitations

The current prototype validates the initial workflow but does not yet produce actual 3D assets.

The generation provider is a mock implementation. The next development phase must integrate a suitable text-to-3D generation service and handle its actual generation results.

## 7. Planned Development

The next development activities are:

1. Research suitable hosted text-to-3D generation services.
2. Select an integration approach based on availability, access, and project requirements.
3. Implement a real generation-provider integration.
4. Submit text-to-3D requests and handle the returned task information.
5. Retrieve and save generated 3D asset files.
6. Test the generated outputs.
7. Add an asset preview and document evaluation results.
8. Prepare the final project demonstration and report.

## 8. Conclusion

The current PolyGen prototype establishes the initial software workflow for a text-to-3D asset pipeline. Prompt processing, provider request handling, pipeline execution, reporting, and job management have been implemented. Actual AI-powered 3D generation is the major remaining development milestone.
