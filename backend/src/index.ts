import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { createRoutes } from "./routes.js";
import { MemStorage } from "./storage.js";

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
const memoryStore = MemoryStore(session);
app.use(session({
  store: new memoryStore({ checkPeriod: 86400000 }),
  secret: process.env.SESSION_SECRET || "laroza-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Initialize storage and routes
const storage = new MemStorage();
const routes = createRoutes(storage);
app.use('/api', routes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Laroza Inventory Management API', 
    version: '1.0.0',
    status: 'running'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'حدث خطأ في الخادم',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'المسار غير موجود' });
});

app.listen(port, () => {
  console.log(`🚀 [express] serving on port ${port}`);
});