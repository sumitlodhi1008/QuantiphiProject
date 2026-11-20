const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Quantiphi AI Chat Assistant (Full-Stack Dev Mode)...');

// Helper to run npm script in subfolder
function runService(name, cwd, colorPrefix) {
  const isWindows = process.platform === 'win32';
  const npmCmd = isWindows ? 'npm.cmd' : 'npm';

  const child = spawn(npmCmd, ['run', 'dev'], {
    cwd: path.resolve(__dirname, cwd),
    stdio: 'pipe',
    shell: true,
  });

  child.stdout.on('data', (data) => {
    process.stdout.write(`${colorPrefix} ${data}`);
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(`${colorPrefix} ${data}`);
  });

  child.on('close', (code) => {
    console.log(`${colorPrefix} Exited with code ${code}`);
  });

  return child;
}

const serverProcess = runService('[SERVER]', 'server', '\x1b[36m[SERVER]\x1b[0m');
const clientProcess = runService('[CLIENT]', 'client', '\x1b[32m[CLIENT]\x1b[0m');

// Handle termination signals
function shutdown() {
  console.log('\n🛑 Shutting down services...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
