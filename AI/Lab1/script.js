const sortingLibrary = window.SortingAlgorithms;

if (!sortingLibrary) {
  throw new Error('sortingAlgorithms.js must be loaded before script.js');
}

const {
  algorithmEntries,
  getAlgorithmById,
  quickSort,
} = sortingLibrary;

const PARALLEL_ALGORITHM = {
  id: 'parallel-quick-sort',
  label: 'Parallel Quick Sort',
  family: 'divide-and-conquer',
  mode: 'parallel-api',
};

const ALGORITHM_DETAILS = {
  'bubble-sort': {
    description: 'Bubble Sort repeatedly swaps neighboring values. It is simple to follow visually, but it slows down quickly as the list grows.',
    visualizationNote: 'The animation highlights adjacent comparisons and each swap upward through the array.',
  },
  'built-in-sort': {
    description: 'Built-in Sort uses the JavaScript runtime implementation. It is practical in production, but its internal steps are opaque.',
    visualizationNote: 'Because the engine handles the work internally, the canvas jumps from the input state to the final ordered array.',
  },
  'heap-sort': {
    description: 'Heap Sort builds a max heap, then repeatedly moves the largest value to the end of the array.',
    visualizationNote: 'The visualizer shows heapify swaps and the extraction phase that locks values into place from right to left.',
  },
  'insertion-sort': {
    description: 'Insertion Sort grows a sorted prefix one value at a time. It is a strong fit for nearly sorted data and very readable animations.',
    visualizationNote: 'Each frame shows values shifting to make room for the next insertion target.',
  },
  'merge-sort': {
    description: 'Merge Sort splits the array, sorts each half, then merges the pieces back together with predictable performance.',
    visualizationNote: 'Watch each merge pass write ordered values back into the array from left to right.',
  },
  'parallel-quick-sort': {
    description: 'Parallel Quick Sort sends the work to the REST API, where worker threads process partitions concurrently on the server.',
    visualizationNote: 'The canvas previews Quick Sort partitioning locally while the real result is computed in parallel by the API.',
  },
  'quick-sort': {
    description: 'Quick Sort partitions values around a pivot and recursively sorts the left and right partitions. It is usually fast in practice.',
    visualizationNote: 'Active bars show comparisons against the current pivot and the swaps that tighten each partition.',
  },
  'selection-sort': {
    description: 'Selection Sort repeatedly scans for the minimum remaining value and places it into the next sorted slot.',
    visualizationNote: 'The visualizer marks the current scan and the swap that promotes the smallest discovered value.',
  },
};

const MAX_RENDER_FRAMES = 220;

const arrayInput = document.getElementById('arrayInput');
const algorithmSelect = document.getElementById('algorithmSelect');
const algorithmHelper = document.getElementById('algorithmHelper');
const animationSpeedInput = document.getElementById('animationSpeedInput');
const animationSpeedValue = document.getElementById('animationSpeedValue');
const sortButton = document.getElementById('sortButton');
const fillSampleButton = document.getElementById('fillSampleButton');
const randomizeButton = document.getElementById('randomizeButton');
const result = document.getElementById('result');
const resultMode = document.getElementById('resultMode');
const benchmarkButton = document.getElementById('benchmarkButton');
const iterationsInput = document.getElementById('iterationsInput');
const benchmarkResult = document.getElementById('benchmarkResult');
const visualizerCanvas = document.getElementById('visualizerCanvas');
const visualizationCaption = document.getElementById('visualizationCaption');
const apiStatus = document.getElementById('apiStatus');
const algorithmCount = document.getElementById('algorithmCount');

const canvasContext = visualizerCanvas.getContext('2d');
const localAlgorithms = algorithmEntries.map((entry) => ({
  family: entry.family,
  id: entry.id,
  label: entry.label,
  mode: 'local',
  sort: entry.sort,
}));

const state = {
  algorithmOptions: [...localAlgorithms, PARALLEL_ALGORITHM],
  animationFrameHandle: 0,
  animationToken: 0,
  apiAvailable: false,
  lastFrame: null,
};

function setResultMode(label, tone = 'info') {
  resultMode.textContent = label;
  resultMode.className = 'pill ' + tone;
}

function displayResult(message, isError = false) {
  result.innerHTML = message;
  result.classList.toggle('error', isError);
}

function displayBenchmark(content, isError = false) {
  benchmarkResult.innerHTML = content;
  benchmarkResult.classList.toggle('error', isError);
}

function formatArray(values) {
  return '[' + values.join(', ') + ']';
}

function parseNumbers(input) {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '')
    .map((item) => {
      const value = Number(item);
      if (Number.isNaN(value)) {
        throw new Error('Invalid number: ' + item);
      }
      return value;
    });
}

function getAlgorithmMeta(id) {
  return state.algorithmOptions.find((algorithm) => algorithm.id === id) || null;
}

function updateSpeedLabel() {
  animationSpeedValue.textContent = animationSpeedInput.value + '%';
}

function updateAlgorithmHelper() {
  const algorithmId = algorithmSelect.value;
  const details = ALGORITHM_DETAILS[algorithmId];

  if (!details) {
    algorithmHelper.textContent = 'Select an algorithm to see how it behaves.';
    visualizationCaption.textContent = 'Load data to render the current array state.';
    return;
  }

  const apiHint = algorithmId === PARALLEL_ALGORITHM.id && !state.apiAvailable
    ? ' Start the project with npm start to enable the parallel API path.'
    : '';

  algorithmHelper.textContent = details.description + apiHint;
  visualizationCaption.textContent = details.visualizationNote;
}

function renderAlgorithmOptions() {
  const options = state.algorithmOptions.map((algorithm) => {
    const suffix = algorithm.id === PARALLEL_ALGORITHM.id ? ' (REST API)' : '';
    return '<option value="' + algorithm.id + '">' + algorithm.label + suffix + '</option>';
  }).join('');

  algorithmSelect.innerHTML = options;
  algorithmCount.textContent = state.algorithmOptions.length + ' modes';
}

function benchmarkSort(sortFn, sourceArray, iterations) {
  sortFn(sourceArray);

  const start = performance.now();

  for (let i = 0; i < iterations; i += 1) {
    sortFn(sourceArray);
  }

  const total = performance.now() - start;

  return {
    average: total / iterations,
    total,
  };
}

function createRandomArray(length = 18) {
  return Array.from({ length }, () => Math.floor(Math.random() * 95) + 1);
}

function loadSampleArray(values) {
  arrayInput.value = values.join(', ');
  previewCurrentArray();
  displayResult('Sample loaded. Click <strong>Sort &amp; Visualize</strong> to animate the selected algorithm.');
  setResultMode('Ready', 'info');
}

function stopAnimation() {
  state.animationToken += 1;

  if (state.animationFrameHandle) {
    cancelAnimationFrame(state.animationFrameHandle);
    state.animationFrameHandle = 0;
  }
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const width = visualizerCanvas.clientWidth;
  const height = visualizerCanvas.clientHeight;

  if (!width || !height) {
    return;
  }

  visualizerCanvas.width = Math.floor(width * ratio);
  visualizerCanvas.height = Math.floor(height * ratio);
  canvasContext.setTransform(ratio, 0, 0, ratio, 0, 0);

  if (state.lastFrame) {
    drawFrame(state.lastFrame);
    return;
  }

  drawPlaceholder('Load values to preview them on the canvas.');
}

function drawRoundedRect(x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  canvasContext.beginPath();
  canvasContext.moveTo(x + safeRadius, y);
  canvasContext.lineTo(x + width - safeRadius, y);
  canvasContext.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  canvasContext.lineTo(x + width, y + height - safeRadius);
  canvasContext.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  canvasContext.lineTo(x + safeRadius, y + height);
  canvasContext.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  canvasContext.lineTo(x, y + safeRadius);
  canvasContext.quadraticCurveTo(x, y, x + safeRadius, y);
  canvasContext.closePath();
}

function drawPlaceholder(message) {
  const width = visualizerCanvas.clientWidth;
  const height = visualizerCanvas.clientHeight;

  canvasContext.clearRect(0, 0, width, height);

  const background = canvasContext.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, '#07111e');
  background.addColorStop(1, '#143454');

  canvasContext.fillStyle = background;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let line = 0; line < 6; line += 1) {
    const y = ((line + 1) / 7) * height;
    canvasContext.fillRect(0, y, width, 1);
  }

  canvasContext.fillStyle = 'rgba(255, 255, 255, 0.92)';
  canvasContext.font = '700 22px "Avenir Next", "Trebuchet MS", sans-serif';
  canvasContext.textAlign = 'center';
  canvasContext.fillText('Sorting Visualizer', width / 2, height / 2 - 14);

  canvasContext.font = '16px "Avenir Next", "Trebuchet MS", sans-serif';
  canvasContext.fillStyle = 'rgba(255, 255, 255, 0.72)';
  canvasContext.fillText(message, width / 2, height / 2 + 18);
}

function drawFrame(frame) {
  state.lastFrame = frame;

  const width = visualizerCanvas.clientWidth;
  const height = visualizerCanvas.clientHeight;
  const values = frame.values;

  canvasContext.clearRect(0, 0, width, height);

  const background = canvasContext.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, '#07111e');
  background.addColorStop(1, '#143454');
  canvasContext.fillStyle = background;
  canvasContext.fillRect(0, 0, width, height);

  canvasContext.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let line = 0; line < 6; line += 1) {
    const y = ((line + 1) / 7) * height;
    canvasContext.fillRect(18, y, width - 36, 1);
  }

  if (!values.length) {
    drawPlaceholder('Enter at least one number to animate the current algorithm.');
    return;
  }

  const padding = {
    bottom: 44,
    left: 18,
    right: 18,
    top: 26,
  };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const gap = Math.max(2, Math.min(8, plotWidth / Math.max(1, values.length * 5)));
  const barWidth = Math.max(4, (plotWidth - gap * (values.length - 1)) / values.length);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  canvasContext.fillStyle = 'rgba(255, 255, 255, 0.84)';
  canvasContext.font = '600 13px "Avenir Next", "Trebuchet MS", sans-serif';
  canvasContext.textAlign = 'left';
  canvasContext.fillText(frame.label, padding.left, height - 14);

  values.forEach((value, index) => {
    const normalized = max === min ? 0.72 : (value - min) / range;
    const barHeight = Math.max(18, normalized * (plotHeight - 18) + 22);
    const x = padding.left + index * (barWidth + gap);
    const y = padding.top + plotHeight - barHeight;

    let fill = '#76d3c8';
    if (frame.finalFrame) {
      fill = '#88d498';
    } else if (frame.accentIndex === index) {
      fill = '#ffce54';
    } else if (frame.activeIndices.includes(index)) {
      fill = '#ff9a52';
    }

    drawRoundedRect(x, y, barWidth, barHeight, Math.min(8, barWidth / 2));
    canvasContext.fillStyle = fill;
    canvasContext.fill();

    if (values.length <= 24) {
      canvasContext.fillStyle = 'rgba(255, 255, 255, 0.86)';
      canvasContext.font = '600 12px "SFMono-Regular", Consolas, monospace';
      canvasContext.textAlign = 'center';
      canvasContext.fillText(String(value), x + barWidth / 2, Math.max(16, y - 8));
    }
  });
}

function createFrameRecorder(values) {
  const frames = [];
  let operations = 0;

  function capture(activeIndices = [], options = {}) {
    operations += 1;
    const shouldKeep = options.force || operations <= 240 || operations % 4 === 0;

    if (!shouldKeep) {
      return;
    }

    frames.push({
      accentIndex: options.accentIndex === undefined ? null : options.accentIndex,
      activeIndices: activeIndices.slice(0, 4),
      finalFrame: Boolean(options.finalFrame),
      label: options.label || 'Sorting in progress',
      values: values.slice(),
    });
  }

  capture([], { force: true, label: 'Input loaded' });

  return { capture, frames };
}

function compressFrames(frames, limit = MAX_RENDER_FRAMES) {
  if (frames.length <= limit) {
    return frames;
  }

  const result = [frames[0]];
  const interiorTarget = limit - 2;
  const step = (frames.length - 2) / interiorTarget;

  for (let i = 1; i <= interiorTarget; i += 1) {
    result.push(frames[Math.floor(i * step)]);
  }

  result.push(frames[frames.length - 1]);
  return result;
}

function swapValues(values, leftIndex, rightIndex) {
  if (leftIndex === rightIndex) {
    return;
  }

  const temp = values[leftIndex];
  values[leftIndex] = values[rightIndex];
  values[rightIndex] = temp;
}

function createQuickSortFrames(numbers) {
  const values = numbers.slice();
  const { capture, frames } = createFrameRecorder(values);

  function partition(low, high) {
    const pivotIndex = Math.floor((low + high) / 2);
    const pivotValue = values[pivotIndex];

    swapValues(values, pivotIndex, high);
    capture([pivotIndex, high], {
      accentIndex: high,
      label: 'Move pivot into partition boundary',
    });

    let storeIndex = low;

    for (let index = low; index < high; index += 1) {
      capture([index, high], {
        accentIndex: high,
        label: 'Compare current value against the pivot',
      });

      if (values[index] < pivotValue) {
        swapValues(values, index, storeIndex);
        capture([index, storeIndex], {
          accentIndex: high,
          label: 'Swap smaller value into the left partition',
        });
        storeIndex += 1;
      }
    }

    swapValues(values, storeIndex, high);
    capture([storeIndex], {
      accentIndex: storeIndex,
      label: 'Place pivot into its final position',
    });

    return storeIndex;
  }

  function sort(low, high) {
    if (low >= high) {
      return;
    }

    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  }

  sort(0, values.length - 1);
  capture([], {
    finalFrame: true,
    force: true,
    label: 'Quick Sort complete',
  });

  return compressFrames(frames);
}

function createMergeSortFrames(numbers) {
  const values = numbers.slice();
  const { capture, frames } = createFrameRecorder(values);

  function sort(start, end) {
    if (end - start <= 1) {
      return;
    }

    const middle = Math.floor((start + end) / 2);
    sort(start, middle);
    sort(middle, end);

    const merged = [];
    let leftIndex = start;
    let rightIndex = middle;

    while (leftIndex < middle && rightIndex < end) {
      if (values[leftIndex] <= values[rightIndex]) {
        merged.push(values[leftIndex]);
        leftIndex += 1;
      } else {
        merged.push(values[rightIndex]);
        rightIndex += 1;
      }
    }

    while (leftIndex < middle) {
      merged.push(values[leftIndex]);
      leftIndex += 1;
    }

    while (rightIndex < end) {
      merged.push(values[rightIndex]);
      rightIndex += 1;
    }

    for (let offset = 0; offset < merged.length; offset += 1) {
      values[start + offset] = merged[offset];
      capture([start + offset], {
        label: 'Write merged values back into the array',
      });
    }
  }

  sort(0, values.length);
  capture([], {
    finalFrame: true,
    force: true,
    label: 'Merge Sort complete',
  });

  return compressFrames(frames);
}

function createHeapSortFrames(numbers) {
  const values = numbers.slice();
  const { capture, frames } = createFrameRecorder(values);

  function heapify(size, rootIndex) {
    let largest = rootIndex;
    const left = 2 * rootIndex + 1;
    const right = 2 * rootIndex + 2;

    if (left < size && values[left] > values[largest]) {
      largest = left;
    }

    if (right < size && values[right] > values[largest]) {
      largest = right;
    }

    if (largest !== rootIndex) {
      swapValues(values, rootIndex, largest);
      capture([rootIndex, largest], {
        label: 'Heapify swap to restore the max heap',
      });
      heapify(size, largest);
    }
  }

  for (let index = Math.floor(values.length / 2) - 1; index >= 0; index -= 1) {
    heapify(values.length, index);
  }

  for (let end = values.length - 1; end > 0; end -= 1) {
    swapValues(values, 0, end);
    capture([0, end], {
      accentIndex: end,
      label: 'Move the largest heap value into the sorted suffix',
    });
    heapify(end, 0);
  }

  capture([], {
    finalFrame: true,
    force: true,
    label: 'Heap Sort complete',
  });

  return compressFrames(frames);
}

function createInsertionSortFrames(numbers) {
  const values = numbers.slice();
  const { capture, frames } = createFrameRecorder(values);

  for (let index = 1; index < values.length; index += 1) {
    const current = values[index];
    let position = index - 1;

    while (position >= 0 && values[position] > current) {
      values[position + 1] = values[position];
      capture([position, position + 1], {
        label: 'Shift larger values right to open an insertion slot',
      });
      position -= 1;
    }

    values[position + 1] = current;
    capture([position + 1], {
      label: 'Insert the current value into the sorted prefix',
    });
  }

  capture([], {
    finalFrame: true,
    force: true,
    label: 'Insertion Sort complete',
  });

  return compressFrames(frames);
}

function createSelectionSortFrames(numbers) {
  const values = numbers.slice();
  const { capture, frames } = createFrameRecorder(values);

  for (let index = 0; index < values.length - 1; index += 1) {
    let minIndex = index;

    for (let scan = index + 1; scan < values.length; scan += 1) {
      capture([minIndex, scan], {
        accentIndex: minIndex,
        label: 'Scan for the smallest remaining value',
      });

      if (values[scan] < values[minIndex]) {
        minIndex = scan;
        capture([index, minIndex], {
          accentIndex: minIndex,
          label: 'Found a new minimum candidate',
        });
      }
    }

    swapValues(values, index, minIndex);
    capture([index, minIndex], {
      accentIndex: index,
      label: 'Place the smallest remaining value into the next sorted slot',
    });
  }

  capture([], {
    finalFrame: true,
    force: true,
    label: 'Selection Sort complete',
  });

  return compressFrames(frames);
}

function createBubbleSortFrames(numbers) {
  const values = numbers.slice();
  const { capture, frames } = createFrameRecorder(values);

  for (let end = values.length - 1; end > 0; end -= 1) {
    let swapped = false;

    for (let index = 0; index < end; index += 1) {
      capture([index, index + 1], {
        label: 'Compare neighboring values',
      });

      if (values[index] > values[index + 1]) {
        swapValues(values, index, index + 1);
        swapped = true;
        capture([index, index + 1], {
          label: 'Swap the out-of-order pair',
        });
      }
    }

    if (!swapped) {
      break;
    }
  }

  capture([], {
    finalFrame: true,
    force: true,
    label: 'Bubble Sort complete',
  });

  return compressFrames(frames);
}

function createBuiltInSortFrames(numbers) {
  const values = numbers.slice();
  const { capture, frames } = createFrameRecorder(values);
  const sorted = values.slice().sort((left, right) => left - right);

  for (let index = 0; index < sorted.length; index += 1) {
    values[index] = sorted[index];
  }

  capture([], {
    finalFrame: true,
    force: true,
    label: 'Built-in Sort complete',
  });

  return compressFrames(frames);
}

function createVisualizationFrames(algorithmId, numbers) {
  switch (algorithmId) {
    case 'bubble-sort':
      return createBubbleSortFrames(numbers);
    case 'built-in-sort':
      return createBuiltInSortFrames(numbers);
    case 'heap-sort':
      return createHeapSortFrames(numbers);
    case 'insertion-sort':
      return createInsertionSortFrames(numbers);
    case 'merge-sort':
      return createMergeSortFrames(numbers);
    case 'parallel-quick-sort':
    case 'quick-sort':
      return createQuickSortFrames(numbers);
    case 'selection-sort':
      return createSelectionSortFrames(numbers);
    default:
      return createQuickSortFrames(numbers);
  }
}

function getFrameDuration() {
  const speed = Number(animationSpeedInput.value);
  return 155 - Math.round(speed * 1.35);
}

function playFrames(frames) {
  stopAnimation();

  if (!frames.length) {
    return;
  }

  const token = state.animationToken;
  let frameIndex = 0;
  let lastTick = 0;

  function renderFrame(timestamp) {
    if (token !== state.animationToken) {
      return;
    }

    if (lastTick === 0 || timestamp - lastTick >= getFrameDuration()) {
      const frame = frames[frameIndex];
      drawFrame(frame);
      visualizationCaption.textContent = frame.label;
      frameIndex += 1;
      lastTick = timestamp;
    }

    if (frameIndex < frames.length) {
      state.animationFrameHandle = requestAnimationFrame(renderFrame);
      return;
    }

    state.animationFrameHandle = 0;
  }

  state.animationFrameHandle = requestAnimationFrame(renderFrame);
}

async function sortViaApi(algorithmId, numbers) {
  const response = await fetch('/api/sort', {
    body: JSON.stringify({
      algorithm: algorithmId,
      numbers,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload && payload.error ? payload.error : 'The API request failed.');
  }

  return payload;
}

async function runSort() {
  try {
    const numbers = parseNumbers(arrayInput.value);

    if (numbers.length === 0) {
      displayResult('Please enter at least one number to sort.', true);
      setResultMode('Input needed', 'error');
      drawPlaceholder('Enter at least one number to animate the current algorithm.');
      return;
    }

    const algorithmId = algorithmSelect.value;
    const algorithm = getAlgorithmMeta(algorithmId);
    const frames = createVisualizationFrames(algorithmId, numbers);

    playFrames(frames);

    sortButton.disabled = true;
    sortButton.textContent = 'Sorting...';

    const start = performance.now();
    let sorted = [];
    let modeLabel = 'Browser';

    if (algorithmId === PARALLEL_ALGORITHM.id) {
      const payload = await sortViaApi(algorithmId, numbers);
      sorted = payload.sorted;
      modeLabel = 'API / worker threads';
      state.apiAvailable = true;
      apiStatus.textContent = 'Connected';
      apiStatus.className = 'status-success';
    } else {
      const localAlgorithm = getAlgorithmById(algorithmId);
      sorted = localAlgorithm ? localAlgorithm.sort(numbers) : quickSort(numbers);
    }

    const total = performance.now() - start;

    displayResult(
      '<strong>' + algorithm.label + '</strong> completed in ' + total.toFixed(3) + ' ms.<br />' +
      'Sorted output: ' + formatArray(sorted),
    );
    setResultMode(modeLabel, 'success');
  } catch (error) {
    displayResult(error.message, true);
    setResultMode('Error', 'error');

    if (algorithmSelect.value === PARALLEL_ALGORITHM.id) {
      state.apiAvailable = false;
      apiStatus.textContent = 'Offline';
      apiStatus.className = 'status-error';
      updateAlgorithmHelper();
    }
  } finally {
    sortButton.disabled = false;
    sortButton.textContent = 'Sort & Visualize';
  }
}

function runBenchmark() {
  try {
    const numbers = parseNumbers(arrayInput.value);

    if (numbers.length === 0) {
      displayBenchmark('Please enter at least one number before running the benchmark.', true);
      return;
    }

    const iterations = Number(iterationsInput.value);
    if (!Number.isInteger(iterations) || iterations <= 0) {
      displayBenchmark('Benchmark iterations must be a positive whole number.', true);
      return;
    }

    const rows = localAlgorithms.map((algorithm) => {
      const timing = benchmarkSort(algorithm.sort, numbers, iterations);
      return (
        '<tr>' +
          '<td>' + algorithm.label + '</td>' +
          '<td>' + timing.total.toFixed(3) + ' ms</td>' +
          '<td>' + timing.average.toFixed(6) + ' ms</td>' +
        '</tr>'
      );
    }).join('');

    displayBenchmark(
      '<table class="benchmark-table">' +
        '<thead>' +
          '<tr>' +
            '<th>Algorithm</th>' +
            '<th>Total Time</th>' +
            '<th>Average Time</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
      '<p><strong>Note:</strong> Parallel Quick Sort is available through the REST API and is not included in this browser-only timing table.</p>',
    );
  } catch (error) {
    displayBenchmark(error.message, true);
  }
}

function previewCurrentArray() {
  try {
    const numbers = parseNumbers(arrayInput.value);

    if (!numbers.length) {
      drawPlaceholder('Load values to preview them on the canvas.');
      state.lastFrame = null;
      return;
    }

    const label = 'Current input preview';
    const frame = {
      accentIndex: null,
      activeIndices: [],
      finalFrame: false,
      label,
      values: numbers,
    };

    drawFrame(frame);
    visualizationCaption.textContent = label;
  } catch (error) {
    drawPlaceholder('Fix the input to preview the current array.');
    state.lastFrame = null;
  }
}

async function refreshApiStatus() {
  try {
    const response = await fetch('/api/algorithms');

    if (!response.ok) {
      throw new Error('API unavailable');
    }

    const payload = await response.json();
    const count = Array.isArray(payload.algorithms) ? payload.algorithms.length : state.algorithmOptions.length;

    state.apiAvailable = true;
    apiStatus.textContent = 'Connected';
    apiStatus.className = 'status-success';
    algorithmCount.textContent = count + ' modes';
  } catch (error) {
    state.apiAvailable = false;
    apiStatus.textContent = 'Offline';
    apiStatus.className = 'status-error';
    algorithmCount.textContent = state.algorithmOptions.length + ' modes';
  } finally {
    updateAlgorithmHelper();
  }
}

renderAlgorithmOptions();
updateSpeedLabel();
updateAlgorithmHelper();
resizeCanvas();
loadSampleArray([18, 5, 13, 2, 21, 8, 3, 34, 1, 13, 7, 29]);
refreshApiStatus();

sortButton.addEventListener('click', () => {
  runSort();
});

fillSampleButton.addEventListener('click', () => {
  loadSampleArray([18, 5, 13, 2, 21, 8, 3, 34, 1, 13, 7, 29]);
});

randomizeButton.addEventListener('click', () => {
  loadSampleArray(createRandomArray(20));
});

benchmarkButton.addEventListener('click', () => {
  runBenchmark();
});

animationSpeedInput.addEventListener('input', () => {
  updateSpeedLabel();
});

algorithmSelect.addEventListener('change', () => {
  updateAlgorithmHelper();
  previewCurrentArray();
});

arrayInput.addEventListener('input', () => {
  previewCurrentArray();
});

arrayInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    sortButton.click();
  }
});

window.addEventListener('resize', () => {
  resizeCanvas();
});
