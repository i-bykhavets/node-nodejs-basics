import { spawn } from 'node:child_process';

const spawnChildProcess = async (...args) => {
  const childProcess = spawn('node', ['src/cp/files/script.js', ...args], {
    stdio: ['pipe', 'pipe', 'inherit']
  })

  process.stdin.pipe(childProcess.stdin);
  childProcess.stdout.on('data', (data) => {
    process.stdout.write(`Received from child process: ${data}`);
  });

  childProcess.on('exit', (code, signal) => {
    console.log(`Child process exited with code ${code}`);
  });
};

spawnChildProcess('test argument 1', 'test argument 1', 123, 516);
