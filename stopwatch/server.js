const http = require("http");
const fs = require("fs");

const host = "127.0.0.1";
const port = 3000;
const mimetype = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
};

const server = http.createServer((req, res) => {
  fs.readFile("./public/" + req.url, (err, data) => {
    if (err) {
      if (!!req.url) {
        res.writeHead(302, {
          Location: "/index.html",
        });
        res.end();
      } else {
        console.log("File not found: " + req.url);
        res.writeHead(404, "Not Found");
        res.end();
      }
    } else {
      console.log(`Request file ${req.url}`);
      let extension = req.url.substr(req.url.lastIndexOf("."));
      res.setHeader("Content-Type", mimetype[extension]);
      res.end(data);
    }
  });
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
