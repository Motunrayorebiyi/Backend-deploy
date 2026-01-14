import http from "http";
import { getSystemInfo } from "./system-utils.js";

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const url = req.url;

  if (url === "/api/system") {
    const data = await getSystemInfo();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data, null, 2));
    return;
  }

  if (url === "/api/time") {
    const now = new Date();
    const data = {
      iso: now.toISOString(),
      unix: Math.floor(now.getTime() / 1000)
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data, null, 2));
    return;
  }

  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html>
        <head>
          <title>System Info API</title>
        </head>
        <body>
          <h1> System Info API</h1>
          <ul>
            <li><a href="/api/system">/api/system</a></li>
            <li><a href="/api/time">/api/time</a></li>
          </ul>
        </body>
      </html>
    `);
    return;
  }


});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
