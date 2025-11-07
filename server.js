// server.js
// Express + Socket.IO server for the Great Meme Reset countdown site.

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const TEMP_DATA_FILE = path.join(__dirname, 'data.json.tmp');

// load or initialize persistent data
let data = { contrib: 0 };
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    data.contrib = typeof parsed.contrib === 'number' ? parsed.contrib : 0;
  } else {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  }
} catch (err) {
  console.error('Error reading data file, initializing to defaults:', err);
  data = { contrib: 0 };
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); } catch (e) { console.error('Failed to create data file:', e); }
}

// Write atomically to avoid corruption: write to temp file then rename
function saveDataSync() {
  try {
    fs.writeFileSync(TEMP_DATA_FILE, JSON.stringify(data, null, 2));
    fs.renameSync(TEMP_DATA_FILE, DATA_FILE);
  } catch (e) {
    console.error('Failed to save data atomically:', e);
  }
}

// Basic in-memory rate limit for contributions per IP (very simple)
const contribCooldownSeconds = 2; // seconds between allowed increments per IP
const recentContribs = new Map(); // ip -> timestamp

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: read current global contrib
app.get('/api/contrib', (req, res) => {
  res.json({ count: data.contrib });
});

// API: increment contributions (safeguarded by simple rate limit)
app.post('/api/contrib', (req, res) => {
  const inc = Number((req.body && req.body.increment) || 1);
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const last = recentContribs.get(ip) || 0;
  if (now - last < contribCooldownSeconds * 1000) {
    return res.status(429).json({ error: 'Too Many Requests - slow down' });
  }
  if (!Number.isFinite(inc) || inc <= 0) {
    return res.status(400).json({ error: 'Bad increment' });
  }
  data.contrib = Math.max(0, data.contrib + Math.floor(inc));
  recentContribs.set(ip, now);
  saveDataSync();
  // broadcast
  io.emit('contribUpdate', { count: data.contrib });
  res.json({ count: data.contrib });
});

// Fallback viewers endpoint (socket.io is the primary channel)
let currentViewers = 0;
app.get('/api/viewers', (req, res) => {
  res.json({ count: currentViewers });
});

io.on('connection', (socket) => {
  currentViewers++;
  // Broadcast current viewers to all
  io.emit('viewersUpdate', { count: currentViewers });

  // Send current contrib value to newly connected client
  socket.emit('contribUpdate', { count: data.contrib });

  // handle incremental requests initiated by socket clients
  socket.on('incrementContrib', (payload) => {
    const inc = Number((payload && payload.increment) || 1);
    if (!Number.isFinite(inc) || inc <= 0) return;
    data.contrib = Math.max(0, data.contrib + Math.floor(inc));
    saveDataSync();
    io.emit('contribUpdate', { count: data.contrib });
  });

  socket.on('disconnect', () => {
    currentViewers = Math.max(0, currentViewers - 1);
    io.emit('viewersUpdate', { count: currentViewers });
  });
});

// Graceful shutdown
function shutdown() {
  console.log('Shutting down server...');
  try { saveDataSync(); } catch (e) { console.error('Error saving data during shutdown:', e); }
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  // force exit after timeout
  setTimeout(() => process.exit(1), 5000);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} (port ${PORT})`);
});
