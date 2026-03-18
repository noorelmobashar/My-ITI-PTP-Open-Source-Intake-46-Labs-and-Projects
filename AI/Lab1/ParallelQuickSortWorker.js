const { parentPort, workerData } = require('node:worker_threads');

const parallelQuickSort = require('./ParallelQuickSort');

parallelQuickSort(workerData.arr, workerData.options)
  .then((sorted) => {
    parentPort.postMessage({ sorted });
  })
  .catch((error) => {
    parentPort.postMessage({
      error: {
        message: error.message,
        name: error.name,
      },
    });
  });
