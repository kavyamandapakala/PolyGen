# PolyGen – Generative Text-to-3D Asset Pipeline

**Internship Project | Infotact Solutions | Generative AI Domain**

## 1. Project Overview

PolyGen is a Generative AI application designed to convert natural-language descriptions into structured 3D asset specifications and generate 3D models.

The project combines prompt engineering, backend API development, generation-provider integration, job management, and interactive 3D visualization.

## 2. Project Objective

To develop a complete text-to-3D asset generation pipeline that accepts user prompts, processes asset requirements, communicates with an AI generation service, retrieves generated 3D models, and displays them through an interactive 3D viewer.

## 3. Implemented Features

- Natural-language prompt input.
- Prompt parsing into structured 3D asset specifications.
- Extraction of object, colour, material, geometry, style, and size.
- Generation-provider interface with a mock implementation.
- Backend REST API using Node.js HTTP module.
- POST `/api/generate` endpoint for generation requests.
- GET `/api/jobs` endpoint for retrieving job history.
- JSON generation reports and persistent job history.
- Interactive Three.js frontend.
- 3D sample geometry preview with rotation and zoom controls.
- Frontend-to-backend API communication.
- Job search and status filtering.
- Command-line job history viewer.
- Automated tests using the Node.js test runner.

## 4. Current Architecture

```text
User Text Prompt
       |
       v
PolyGen Frontend
(HTML, CSS, JavaScript)
       |
       v
Backend REST API
(Node.js HTTP Server)
       |
       v
Prompt-to-Spec Parser
       |
       v
Structured 3D Specification
       |
       v
Generation Provider
(Currently Mock)
       |
       v
Pipeline Execution
       |
       v
JSON Report and Job History
       |
       v
Frontend Response and Sample Preview
```

## 5. Technology Stack

- JavaScript
- Node.js
- HTML5 and CSS3
- Three.js
- REST API
- JSON
- Node.js built-in HTTP module
- Node.js built-in test runner
- Git and GitHub

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

## 8. Running Automated Tests

Run all project tests:

```bash
node --test
```

Latest recorded test result:

- Total tests: 34
- Passed: 34
- Failed: 0

## 9. Current Development Status

The current working prototype includes prompt processing, backend API integration, mock generation-provider integration, JSON reporting, job history, and an interactive Three.js sample viewer.

**Important limitation:** The current provider is a mock implementation. The displayed geometry is sample geometry selected using prompt keywords. Actual AI-generated 3D models and downloadable GLB assets have not yet been implemented.

## 10. Planned Development

- Integrate a real text-to-3D AI generation API.
- Implement asynchronous generation task tracking.
- Retrieve and download generated GLB models.
- Display actual generated models using Three.js and GLTFLoader.
- Improve generation history and model management.
- Implement error handling and validation.
- Evaluate generated 3D assets.
- Complete technical documentation and final demonstration.

## 11. Internship Deliverables

- Source code
- Technical documentation
- Project report
- Presentation
- Model evaluation results, if applicable
- Final project demonstration, if applicable
