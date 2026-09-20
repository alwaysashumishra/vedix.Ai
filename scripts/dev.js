import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

console.log("🚀 Starting Vedix.AI Full Stack (Backend + Frontend)...");

const backend = spawn("node", ["backend/server.js"], {
  cwd: rootDir,
  stdio: "inherit",
  shell: true,
});

const frontend = spawn("npx", ["vite"], {
  cwd: rootDir,
  stdio: "inherit",
  shell: true,
});

const cleanup = (code) => {
  backend.kill();
  frontend.kill();
  process.exit(code || 0);
};

process.on("SIGINT", () => cleanup(0));
process.on("SIGTERM", () => cleanup(0));
process.on("exit", () => cleanup(0));
