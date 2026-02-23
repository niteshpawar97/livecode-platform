import { parentPort, workerData } from 'worker_threads';
import { VM } from 'vm2';

const { code, timeout, maxOutputLines } = workerData;

let outputCount = 0;

function pushLine(line) {
  if (outputCount < maxOutputLines) {
    outputCount++;
    parentPort.postMessage({ type: 'output', line });
  }
}

function formatArgs(args) {
  return args.map(a => {
    if (a === undefined) return 'undefined';
    if (a === null) return 'null';
    if (typeof a === 'object') {
      try { return JSON.stringify(a); } catch { return String(a); }
    }
    return String(a);
  }).join(' ');
}

// Timer/immediate queues for event loop simulation
const timerQueue = [];
const immediateQueue = [];
let nextId = 1;

const vm = new VM({
  timeout,
  sandbox: {
    console: {
      log: (...args) => pushLine(formatArgs(args)),
      error: (...args) => pushLine('[ERROR] ' + formatArgs(args)),
      warn: (...args) => pushLine('[WARN] ' + formatArgs(args)),
      info: (...args) => pushLine('[INFO] ' + formatArgs(args)),
    },
    setTimeout: (fn, delay = 0, ...args) => {
      if (typeof fn !== 'function') return;
      const id = nextId++;
      timerQueue.push({ id, fn, delay: Math.max(0, Number(delay) || 0), args, cancelled: false });
      return id;
    },
    clearTimeout: (id) => {
      const t = timerQueue.find(t => t.id === id);
      if (t) t.cancelled = true;
    },
    setInterval: (fn, delay = 0, ...args) => {
      if (typeof fn !== 'function') return;
      const id = nextId++;
      // Single execution for sandbox safety (no infinite repeats)
      timerQueue.push({ id, fn, delay: Math.max(0, Number(delay) || 0), args, cancelled: false });
      return id;
    },
    clearInterval: (id) => {
      const t = timerQueue.find(t => t.id === id);
      if (t) t.cancelled = true;
    },
    setImmediate: (fn, ...args) => {
      if (typeof fn !== 'function') return;
      const id = nextId++;
      immediateQueue.push({ id, fn, args, cancelled: false });
      return id;
    },
    queueMicrotask: (fn) => {
      if (typeof fn !== 'function') throw new TypeError('Argument must be a function');
      Promise.resolve().then(fn);
    },
  },
  eval: false,
  wasm: false,
});

async function run() {
  // Phase 1: Execute synchronous code
  try {
    vm.run(code);
  } catch (err) {
    parentPort.postMessage({ type: 'done', error: err.message });
    return;
  }

  // Phase 2: Flush microtasks (Promise .then callbacks)
  await new Promise(r => setTimeout(r, 0));

  // Phase 3: Simulate event loop — process immediates & timers
  // Order: immediates (check phase) -> timers (sorted by delay, then FIFO)
  // After each callback, flush microtasks again
  const deadline = Date.now() + timeout;
  let rounds = 0;

  while (rounds++ < 500 && Date.now() < deadline) {
    let didWork = false;

    // Process all pending immediates (setImmediate callbacks)
    const currentImmediates = immediateQueue.splice(0);
    for (const imm of currentImmediates) {
      if (!imm.cancelled && Date.now() < deadline) {
        try {
          imm.fn(...imm.args);
        } catch (e) {
          pushLine('[ERROR] ' + e.message);
        }
        didWork = true;
        await new Promise(r => setTimeout(r, 0)); // flush microtasks
      }
    }

    // Process next timer (setTimeout/setInterval callbacks)
    // Sorted by delay first, then insertion order (FIFO)
    const pendingTimers = timerQueue.filter(t => !t.cancelled);
    if (pendingTimers.length > 0) {
      pendingTimers.sort((a, b) => a.delay - b.delay || a.id - b.id);
      const timer = pendingTimers[0];
      timerQueue.splice(timerQueue.indexOf(timer), 1);
      try {
        timer.fn(...timer.args);
      } catch (e) {
        pushLine('[ERROR] ' + e.message);
      }
      didWork = true;
      await new Promise(r => setTimeout(r, 0)); // flush microtasks
    }

    if (!didWork) break;
  }

  parentPort.postMessage({ type: 'done', error: null });
}

run();
