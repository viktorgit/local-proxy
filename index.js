require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

const TARGET = process.env.TARGET;
const COOKIE_VALUE = process.env.COOKIE_VALUE;

const setProxyHeaders = (proxyReq, req) => {
  if (COOKIE_VALUE) {
    proxyReq.setHeader('Cookie', COOKIE_VALUE.trim());
  }
  proxyReq.setHeader('User-Agent', req.headers['user-agent'] || '');
  proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
  proxyReq.setHeader('X-Real-IP', req.connection.remoteAddress || '');
};

app.use(
  '/api',
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api',
    },
    onProxyReq: setProxyHeaders,
    logLevel: 'debug',
  })
);

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}, forwarding to ${TARGET}`);
});
