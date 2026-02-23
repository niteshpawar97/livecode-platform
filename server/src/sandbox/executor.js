import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import path from 'path';
import { EXECUTION_TIMEOUT, MAX_CODE_LENGTH, MAX_OUTPUT_LINES } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKER_PATH = path.join(__dirname, 'worker.js');

export async function executeCode(code) {
  if (!code || code.trim().length === 0) {
    return { output: [], error: 'No code to execute' };
  }

  if (code.length > MAX_CODE_LENGTH) {
    return { output: [], error: `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters` };
  }

  return new Promise((resolve) => {
    let resolved = false;
    const collectedOutput = [];

    const worker = new Worker(WORKER_PATH, {
      workerData: {
        code,
        timeout: EXECUTION_TIMEOUT,
        maxOutputLines: MAX_OUTPUT_LINES
      }
    });

    // Hard kill if worker hangs (e.g. while(true) in a microtask/timer)
    const killTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        worker.terminate();
        resolve({
          output: collectedOutput,
          error: 'Execution timed out (possible infinite loop or blocking code)'
        });
      }
    }, EXECUTION_TIMEOUT * 3);

    worker.on('message', (msg) => {
      if (resolved) return;

      if (msg.type === 'output') {
        collectedOutput.push(msg.line);
      } else if (msg.type === 'done') {
        resolved = true;
        clearTimeout(killTimer);
        resolve({
          output: collectedOutput,
          error: msg.error
        });
      }
    });

    worker.on('error', (err) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(killTimer);
        resolve({
          output: collectedOutput,
          error: err.message
        });
      }
    });

    worker.on('exit', (exitCode) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(killTimer);
        resolve({
          output: collectedOutput,
          error: exitCode !== 0 ? 'Execution failed' : null
        });
      }
    });
  });
}
