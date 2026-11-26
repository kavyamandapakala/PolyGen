# PolyGen – Generative Text-to-3D Asset Pipeline

**Internship Project | Infotact Solutions | Generative AI Domain**

## 1. Project Overview

PolyGen is a Generative AI application designed to convert natural-language descriptions into structured 3D asset specifications and support the visualization of generated 3D models.

The project combines prompt engineering, backend API development, generation-provider architecture, job management, external AI-generated 3D assets, and interactive 3D visualization.

## 2. Project Objective

To develop a text-to-3D asset generation pipeline that accepts user prompts, processes asset requirements, communicates with an AI generation service, manages generation tasks, and displays 3D models through an interactive viewer.

## 3. Implemented Features

### Prompt Processing and Backend

- Natural-language prompt input.
- Prompt parsing into structured 3D asset specifications.
- Extraction of object, colour, material, geometry, style, and size.
- Generation-provider interface with a mock implementation.
- Backend REST API using the Node.js HTTP module.
- POST `/api/generate` endpoint for generation requests.
- GET `/api/jobs` endpoint for retrieving job history.
- JSON generation reports and persistent job history.
- Job search and status filtering.
- Command-line job history viewer.

### 3D Model Generation and Visualization

- Generated a 3D robot using an external AI 3D generation tool.
- Imported the generated GLB model into the PolyGen project.
- Added `public/models/textured.glb` as the sample 3D asset.
- Integrated Three.js GLTFLoader to load GLB models.
- Implemented automatic model scaling and centering.
- Added lighting, grid, and floor elements to the 3D scene.
- Interactive 3D preview with mouse rotation and zoom.
- Reset-view and wireframe controls.
- Updated the frontend model information display.

### Testing

- Automated tests using the Node.js built-in test runner.
- Prompt validation and generation pipeline tests.
- Job history and status management tests.

## 4. Current Architecture

```text
                 User Text Prompt
                        |
                        v
                 PolyGen Frontend
                 (HTML, CSS, JS)
                        |
                        v
                 Backend REST API
                  (Node.js Server)
                        |
                        v
                 Prompt-to-Spec
                      Parser
                        |
                        v
               Structured 3D Specification
                        |
                        v
                Generation Provider
                   (Mock Mode)
                        |
                        v
                 Pipeline Execution
                        |
                        v
               JSON Report and Job
                     History

External AI 3D Generation Tool
             |
             v
       Generated GLB Asset
             |
             v
       public/models/
        textured.glb
             |
             v
       Three.js GLTFLoader
             |
             v
       Interactive 3D Viewer
```

**Note:** The external AI-generated GLB asset is currently imported into the project separately. Automatic communication between the backend and a real text-to-3D AI generation API is still under development.

## 5. Technology Stack

- JavaScript
- Node.js
- HTML5 and CSS3
- Three.js
- GLTFLoader
- REST API
- JSON
- Node.js built-in HTTP module
- Node.js built-in test runner
- Git and GitHub
- GLB (GL Transmission Format Binary)

## 6. Running the Application

### Start the backend

Open Git Bash in the project directory:

```bash
cd ~/PolyGen
node src/server.js
```

Backend address:

http://localhost:3000

### Start the frontend

Open another Git Bash window:

```bash
cd ~/PolyGen
python -m http.server 8000
```

Open the application in a browser:

http://localhost:8000/public/

Both servers must remain running while using the application.

## 7. API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/generate | Submit a text prompt |
| GET | /api/jobs | Retrieve saved generation jobs |

Example request:

```json
{
  "prompt": "Create a small blue wooden robot"
}
```

## 8. 3D Model Asset

The project currently includes an externally AI-generated robot model.

**Asset location:**

```text
public/
  models/
    textured.glb
```

The GLB model is loaded using Three.js GLTFLoader.

The viewer supports:

- Loading the 3D model.
- Automatic scaling and centering.
- Interactive rotation.
- Zooming.
- Resetting the camera view.
- Wireframe visualization.

## 9. Running Automated Tests

Run all project tests:

```bash
node --test
```

Latest recorded test result (November 26, 2026):

- Total tests: 34
- Passed: 34
- Failed: 0

## 10. Current Development Status

The current working prototype includes:

- Natural-language prompt processing.
- Structured 3D asset specifications.
- Backend REST API.
- Mock generation-provider integration.
- JSON generation reports.
- Persistent job history.
- Interactive Three.js frontend.
- External AI-generated GLB model import.
- GLTFLoader-based 3D model visualization.
- Model scaling and centering.
- Interactive viewer controls.
- 34 passing automated tests.

**Current limitation:** The backend generation provider still operates in Mock mode. The 3D robot was generated using an external AI tool and imported into PolyGen separately. Automatic text-to-3D API integration, automated model retrieval, and downloadable generation results are still pending.

## 11. Planned Development

- Investigate and integrate a genuine text-to-3D AI API with a free-access option.
- Implement asynchronous generation task tracking.
- Retrieve generated GLB models automatically.
- Implement model download functionality.
- Improve generation history and model management.
- Implement robust error handling and validation.
- Evaluate generated 3D assets.
- Expand automated testing.
- Complete technical documentation and final demonstration.

## 12. Internship Deliverables

- Source code.
- Technical documentation.
- Project report.
- Presentation.
- Model evaluation results, if applicable.
- Final project demonstration.