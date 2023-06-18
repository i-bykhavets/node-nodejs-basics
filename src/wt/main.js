import { availableParallelism } from 'node:os';
import { Worker } from 'node:worker_threads';

const performCalculations = async () => {
  const results = [];
  const workers = [];

  const numberOfWorkers = availableParallelism();
  for (let i = 0; i < numberOfWorkers; i++) {
    const worker = new Worker(new URL('worker.js', import.meta.url));
    workers.push(worker);
  }

  const executeTaskInWorker = (worker, taskData) => {
    return new Promise((resolve, reject) => {
      worker.postMessage(taskData);

      worker.on('message', (result) => {
        resolve({
          status: 'resolved',
          data: result
        })
      })

      worker.on('error', (err) => {
        reject({
          status: 'error',
          data: null
        })
      })
    })
  }

  let fibonacciSerialNumber = 10;
  for (const worker of workers) {
    results.push(await executeTaskInWorker(worker, fibonacciSerialNumber++));
  }

  Promise.all(results).then((completedTasks) => {
    console.log(completedTasks);
  })
};

await performCalculations();
