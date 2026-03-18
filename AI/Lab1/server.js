const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { URL } = require('node:url');

const parallelQuickSort = require('./ParallelQuickSort');
const {
  algorithmEntries,
  getAlgorithmById,
  quickSort,
} = require('./sortingAlgorithms');

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT) || 3000;
const STATIC_ROOT = __dirname;

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

const apiAlgorithms = [
  ...algorithmEntries.map((entry) => ({
    family: entry.family,
    id: entry.id,
    label: entry.label,
    mode: 'local',
  })),
  {
    family: 'divide-and-conquer',
    id: 'parallel-quick-sort',
    label: 'Parallel Quick Sort (API)',
    mode: 'parallel-api',
  },
];

function sendJson(res, statusCode, payload) {
  const content = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Length': Buffer.byteLength(content),
    'Content-Type': MIME_TYPES['.json'],
  });
  res.end(content);
}

function sendText(res, statusCode, content, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, {
    'Content-Length': Buffer.byteLength(content),
    'Content-Type': contentType,
  });
  res.end(content);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body is too large.'));
      }
    });

    req.on('end', () => {
      if (body.trim() === '') {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Request body must be valid JSON.'));
      }
    });

    req.on('error', reject);
  });
}

function ensureNumbersArray(value) {
  if (!Array.isArray(value)) {
    throw new TypeError('numbers must be an array');
  }

  for (const item of value) {
    if (typeof item !== 'number' || Number.isNaN(item)) {
      throw new TypeError('numbers must contain only valid numbers');
    }
  }
}

async function sortWithAlgorithm(algorithmId, numbers) {
  if (algorithmId === 'parallel-quick-sort') {
    const sorted = await parallelQuickSort(numbers);
    return {
      algorithm: apiAlgorithms.find((entry) => entry.id === algorithmId),
      sorted,
    };
  }

  const algorithm = getAlgorithmById(algorithmId);
  if (!algorithm) {
    throw new Error('Unknown algorithm: ' + algorithmId);
  }

  return {
    algorithm: {
      family: algorithm.family,
      id: algorithm.id,
      label: algorithm.label,
      mode: 'local',
    },
    sorted: algorithm.sort(numbers),
  };
}

async function handleApiRoute(method, pathname, body = {}) {
  if (method === 'GET' && pathname === '/api/algorithms') {
    return {
      payload: { algorithms: apiAlgorithms },
      statusCode: 200,
    };
  }

  if (method === 'POST' && pathname === '/api/quicksort') {
    ensureNumbersArray(body.numbers);

    const useParallel = body.parallel !== false;
    const sorted = useParallel ? await parallelQuickSort(body.numbers) : quickSort(body.numbers);

    return {
      payload: {
        algorithm: useParallel ? 'parallel-quick-sort' : 'quick-sort',
        count: body.numbers.length,
        sorted,
      },
      statusCode: 200,
    };
  }

  if (method === 'POST' && pathname === '/api/sort') {
    ensureNumbersArray(body.numbers);

    const algorithmId = typeof body.algorithm === 'string' ? body.algorithm : 'quick-sort';
    const { algorithm, sorted } = await sortWithAlgorithm(algorithmId, body.numbers);

    return {
      payload: {
        algorithm,
        count: body.numbers.length,
        sorted,
      },
      statusCode: 200,
    };
  }

  return {
    payload: { error: 'API route not found.' },
    statusCode: 404,
  };
}

function resolveFilePath(requestPath) {
  const relativePath = requestPath === '/' ? '/index.html' : requestPath;
  const normalizedPath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, '');
  const absolutePath = path.join(STATIC_ROOT, normalizedPath);

  if (!absolutePath.startsWith(STATIC_ROOT)) {
    return null;
  }

  return absolutePath;
}

function serveStaticFile(req, res, requestPath) {
  const absolutePath = resolveFilePath(requestPath);

  if (!absolutePath) {
    sendText(res, 403, 'Forbidden');
    return;
  }

  fs.readFile(absolutePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        sendText(res, 404, 'Not Found');
        return;
      }

      sendText(res, 500, 'Unable to read file.');
      return;
    }

    const extension = path.extname(absolutePath);
    const contentType = MIME_TYPES[extension] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

async function handleApiRequest(req, res, pathname) {
  try {
    const body = req.method === 'POST' ? await readRequestBody(req) : {};
    const { payload, statusCode } = await handleApiRoute(req.method, pathname, body);
    sendJson(res, statusCode, payload);
  } catch (error) {
    sendJson(res, 400, { error: error.message });
  }
}

function createServer() {
  return http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url, 'http://' + HOST + ':' + PORT);

    if (requestUrl.pathname.startsWith('/api/')) {
      await handleApiRequest(req, res, requestUrl.pathname);
      return;
    }

    if (req.method !== 'GET') {
      sendText(res, 405, 'Method Not Allowed');
      return;
    }

    serveStaticFile(req, res, requestUrl.pathname);
  });
}

function startServer(port = PORT, host = HOST) {
  const server = createServer();

  server.listen(port, host, () => {
    console.log('Sorting lab running at http://' + host + ':' + port);
  });

  return server;
}

module.exports = {
  HOST,
  PORT,
  apiAlgorithms,
  createServer,
  handleApiRoute,
  startServer,
};

if (require.main === module) {
  startServer();
}
