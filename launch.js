const { spawn } = require("child_process");
const os = require("os");
const open = require("open");

// Function to get the local IP address
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
  return "127.0.0.1"; // Fallback to localhost
}

// Get project directory
const projectDir = __dirname;

// Start Next.js in development mode
console.log("Starting Next.js development server...");
const devProcess = spawn("cmd.exe", ["/c", "npm", "run", "dev"], {
  cwd: projectDir,
  stdio: "inherit",
});

// Wait a few seconds before opening the browser
setTimeout(() => {
  const ip = getLocalIp();
  const port = 3000; // Adjust if needed
  const url = `http://${ip}:${port}/pasaydan/com`;

  console.log(`\nServer should be ready! Opening: ${url}`);
  open(url);
}, 10000); // Wait 10 seconds before opening
