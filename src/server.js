
const http = require("node:http");

const { runPipeline } = require("./run-pipeline");
const { getAllJobs, getJobById } = require("./job-history");

const PORT = 3000;

// Create the server.
// Dependencies can be replaced with test functions during automated testing.
function createServer({
  runPipelineFn = runPipeline,
  getAllJobsFn = getAllJobs,
  getJobByIdFn = getJobById
} = {}) {

  return http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    const requestUrl = new URL(req.url, "http://localhost");

    // POST /api/generate
    if (req.method === "POST" && requestUrl.pathname === "/api/generate") {
      try {
        let body = "";

        for await (const chunk of req) {
          body += chunk;

          if (body.length > 10000) {
            res.writeHead(413, {
              "Content-Type": "application/json"
            });
            return res.end(JSON.stringify({
              error: "Request is too large."
            }));
          }
        }

        const data = JSON.parse(body);
        const prompt = data.prompt;

        if (typeof prompt !== "string" || !prompt.trim()) {
          res.writeHead(400, {
            "Content-Type": "application/json"
          });
          return res.end(JSON.stringify({
            error: "Please provide a valid prompt."
          }));
        }

        const result = await runPipelineFn(prompt);

        res.writeHead(200, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          message: "Generation request processed successfully.",
          ...result
        }));

      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          error: error.message
        }));
      }

      return;
    }

    // GET /api/jobs
    if (req.method === "GET" && requestUrl.pathname === "/api/jobs") {
      try {
        const jobs = getAllJobsFn();

        res.writeHead(200, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({ jobs }));

      } catch (error) {
        res.writeHead(500, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          error: error.message
        }));
      }

      return;
    }

    // GET /api/jobs/:id
    if (
      req.method === "GET" &&
      requestUrl.pathname.startsWith("/api/jobs/")
    ) {
      try {
        const jobId = decodeURIComponent(
          requestUrl.pathname.slice("/api/jobs/".length)
        );

        const job = getJobByIdFn(jobId);

        if (!job) {
          res.writeHead(404, {
            "Content-Type": "application/json"
          });

          return res.end(JSON.stringify({
            error: "Job not found."
          }));
        }

        res.writeHead(200, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({ job }));

      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          error: error.message
        }));
      }

      return;
    }

    // Unknown endpoint
    res.writeHead(404, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
      error: "API endpoint not found."
    }));
  });
}

// Start the real server only when this file is run directly.
// Importing it in tests will not automatically start port 3000.
if (require.main === module) {
  const server = createServer();

  server.listen(PORT, () => {
    console.log(`PolyGen API server running at http://localhost:${PORT}`);
    console.log("Available endpoints:");
    console.log("POST /api/generate");
    console.log("GET  /api/jobs");
    console.log("GET  /api/jobs/:id");
  });
}

module.exports = { createServer };
