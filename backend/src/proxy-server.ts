import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();

// Basic middleware
app.use(bodyParser.json());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const API_TOKENS = {
  LOCAL: '0829198d-ca2f-4b3f-9e5a-00ea8c2c88ce',
  CLOUD: 'cZeanvbdQy-Jk4Qyq1S3p7:APA91bGiRWrgXObyzGGPNJsy5UmB6SARhv7NtWovplGYNCZFrF_cB52PdKH-GJITgK5unzvHQPblFYxHbq4Ze4ZNhUq0v3wWZqoJ_fsE3AAWC9oqd7_cJck'
};

const TARGETS = {
  LOCAL: 'http://192.168.22.212:8082',
  CLOUD: 'http://100.119.24.43:8082',
  MOCK: 'http://localhost:3001/mock'
};

let activeTarget = TARGETS.MOCK;
let activeToken = API_TOKENS.LOCAL;

// Auth middleware - now with public endpoints
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // List of paths that don't require authentication
  const publicPaths = ['/health', '/mock/health'];
  
  if (publicPaths.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split('Bearer ')[1];

  if (!token) {
    console.log('No token provided for:', req.path);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No token provided'
    });
  }

  if (token !== API_TOKENS.LOCAL && token !== API_TOKENS.CLOUD) {
    console.log('Invalid token for:', req.path);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    });
  }

  activeToken = token;
  next();
};

// Health check endpoint (before auth middleware)
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    activeTarget,
    timestamp: new Date().toISOString()
  });
});

// Apply auth middleware after health check
app.use(authMiddleware);

// Mock SMS endpoint
app.post('/mock/api/sms', (req, res) => {
  const { phone, message } = req.body;
  console.log(`Mock SMS to ${phone}: ${message}`);
  res.json({
    success: true,
    message: 'SMS sent successfully (mock)',
    data: { phone, message }
  });
});

// Create proxy middleware
const smsProxy = createProxyMiddleware({
  target: activeTarget,
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    '^/sms': '/api/sms'
  },
  onProxyReq: (proxyReq, req: express.Request) => {
    // Forward auth token and set headers
    proxyReq.setHeader('Authorization', `Bearer ${activeToken}`);
    proxyReq.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST' && req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }

    console.log('Proxying request:', {
      method: req.method,
      url: req.url,
      target: activeTarget
    });
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(502).json({
      error: 'Bad Gateway',
      message: 'Target server unreachable'
    });
  }
});

// Main routes
app.use('/sms', smsProxy);

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log('Available targets:', TARGETS);
  console.log(`Initial target: ${activeTarget}`);
  console.log('Public endpoints: /health');
  console.log('Protected endpoints: /sms, /mock/api/sms');
});
