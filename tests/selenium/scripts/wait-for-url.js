#!/usr/bin/env node
const http = require('node:http');
const https = require('node:https');

const baseUrl = process.env.BASE_URL || 'http://wordpress';
const timeoutMs = 120000;
const intervalMs = 3000;

function requestOnce(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, (res) => {
      res.resume();
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(null));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

(async () => {
  const start = Date.now();
  process.stdout.write(`Waiting for ${baseUrl}\n`);
  while (Date.now() - start < timeoutMs) {
    const status = await requestOnce(baseUrl);
    if (status && (status >= 200 && status < 400)) {
      process.stdout.write('Ready.\n');
      process.exit(0);
    }
    process.stdout.write('.');
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  process.stdout.write('\nTimeout waiting for app.\n');
  process.exit(1);
})();
