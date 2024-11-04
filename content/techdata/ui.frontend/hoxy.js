const hoxy = require('hoxy');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { PassThrough } = require('stream'); // To create a fake socket

// Load configuration from config.json
const config = JSON.parse(fs.readFileSync('./hoxy.config.json', 'utf8'));

// Load blocked domains from the configuration file
const blockedDomains = config.blockedDomains || [];

// Custom agent to control requests
class BlockedDomainAgent extends https.Agent {
  createConnection(options, callback) {
    const hostname = options.host || options.hostname;

    if (blockedDomains.includes(hostname)) {
      console.warn(`REQUEST BLOCKED: Attempt to connect to blocked domain "${hostname}"`);

      // Create a fake socket using a PassThrough stream
      const fakeSocket = new PassThrough();

      // Simulate an immediate callback with a fake socket
      process.nextTick(() => {
        callback(null, fakeSocket);
      });

      // Write a basic HTTP response to simulate the connection being accepted and immediately closed
      fakeSocket.push('HTTP/1.1 403 Forbidden\r\n');
      fakeSocket.push('Content-Type: text/plain\r\n');
      fakeSocket.push('Content-Length: 19\r\n');
      fakeSocket.push('\r\n');
      fakeSocket.push('Blocked by proxy.\r\n');
      fakeSocket.push(null); // Signals the end of the stream

      return fakeSocket;
    } else {
      // If not blocked, proceed with the original connection creation
      return super.createConnection(options, callback);
    }
  }
}

// Create proxy server with HTTPS support
const proxy = new hoxy.Proxy({
  certAuthority: {
    key: fs.readFileSync('.env/key.pem'),
    cert: fs.readFileSync('.env/cert.pem'),
  },
}).listen(8889); // Listen on port 8889

// Set the custom agent for all HTTPS requests
https.globalAgent = new BlockedDomainAgent();

// Intercept requests to manage blocking and custom behavior
proxy.intercept({ phase: 'request', as: 'string' }, (req, res) => {
  const hostname = req.hostname;

  // Check if the request is for a blocked domain
  if (blockedDomains.includes(hostname)) {
    console.warn(`BLOCKED: Request to blocked domain "${hostname}"`);
    // Respond immediately with a 204 No Content status to indicate that the request is complete but there's no content
    res.writeHead(204, { 'Content-Type': 'text/plain' });
    res.end();
    req.cancel();
    return;
  }

  req.setTimeout(5000); // Set timeout to 5 seconds if needed
});

// Intercept responses and serve local files if applicable
proxy.intercept({ phase: 'response' }, (req, res) => {
  const url = req.fullUrl();
  const hostname = req.hostname;

  if (blockedDomains.includes(hostname)) {
    console.warn(`BLOCKED: Response handling for blocked domain "${hostname}"`);
    res.statusCode = 204; // 204 No Content for blocked domains, to end response cleanly
    res.string = '';
    return;
  }

  // Use `find` to get the matching resource configuration
  const resource = config.resources.find((resource) => new RegExp(resource.pattern).test(url));

  if (resource) {
    const directory = path.resolve(__dirname, resource.directory);
    const localFilePath = path.join(directory, resource.filename);

    // Serve the file and log the proxy action
    serveLocalFile(res, localFilePath, url);
  }
});

// Helper function to serve the local file with logging
const serveLocalFile = (res, localFilePath, url) => {
  if (fs.existsSync(localFilePath)) {
    const fileContent = fs.readFileSync(localFilePath, 'utf8');
    res.string = fileContent;

    // Log successful proxy action
    console.log(`PROXIED: ${url} → ${localFilePath}`);
  } else {
    console.error(`MISSING FILE: ${localFilePath}`);
    res.statusCode = 404;
    res.string = '404 Not Found';
  }
};

console.log('Hoxy proxy is running on http://localhost:8889');
