import os from "os";

export async function getSystemInfo() {
  return {
    uptimeSeconds: `${os.uptime()} s`,
    totalMemoryMB: `${(os.totalmem() / (1024 * 1024)).toFixed(2)} MB`,
    platform: os.platform(),
    architecture: os.arch(),
    cpuCores: os.cpus().length,
    nodeVersion: process.version
  };
}
