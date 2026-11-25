const http = require("node:http");
const { runPipeline } = require("./run-pipeline");
const { getAllJobs } = require("./job-history");

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "POST" && req.url === "/api/generate") {
    try {
      let body = "";

      for await (const chunk of req) {
        body += chunk;

        if (body.length > 10000) {
          res.writeHead(413, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({
            error: "Request is too large."
          }));
        }
      }

      const data = JSON.parse(body);
      const prompt = data.prompt;

      if (typeof prompt !== "string" || !prompt.trim()) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
          error: "Please provide a valid prompt."
        }));
      }

      const result = await runPipeline(prompt);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        message: "Generation request processed successfully.",
        ...result
      }));

    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        error: error.message
      }));
    }

    return;
  }

  if (req.method === "GET" && req.url === "/api/jobs") {
    try {
      const jobs = getAllJobs();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ jobs }));

    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }

    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "API endpoint not found." }));
});

server.listen(PORT, () => {
  console.log(`PolyGen API server running at http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("POST /api/generate");
  console.log("GET  /api/jobs");
});
