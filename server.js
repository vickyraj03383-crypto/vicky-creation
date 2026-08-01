/**
 * Vicky's Creation — simple backend
 * -----------------------------------
 * Collects leads from the contact form on index.html and stores them
 * in a local JSON file (data/submissions.json). No external database
 * needed — good enough for a small business site.
 *
 * Run:
 *   npm install
 *   npm start
 *
 * Then open: http://localhost:3000
 * Admin view: http://localhost:3000/admin?key=YOUR_ADMIN_KEY
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // 👈 CORS Add kiya

// गलत तरीका:
fetch('/api/contact', { method: 'POST', body: data })

// सही तरीका (अपने बैकएंड का सही पोर्ट डालें):
fetch('http://localhost:5000/api/contact', { method: 'POST', body: data })

// Change this before deploying anywhere public!
const ADMIN_KEY = process.env.ADMIN_KEY || 'Vickymanshi@200727';

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');

// Make sure data folder/file exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');

// Middlewares
app.use(cors()); // 👈 Cross-Origin Requests allow karne ke liye
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serves index.html, style.css

// ---------- helpers ----------
function readSubmissions() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeSubmissions(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, '').slice(-10));
}

function isValidEmail(email) {
  if (!email) return true; // email optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------- API: receive form submissions ----------
app.post('/api/contact', (req, res) => {
  const { name, phone, email, topic, message } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Naam required hai.' });
  }
  if (!phone || !isValidPhone(phone)) {
    return res.status(400).json({ success: false, error: 'Valid 10-digit phone number do.' });
  }
  if (!topic || !topic.trim()) {
    return res.status(400).json({ success: false, error: 'Topic required hai.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, error: 'Valid email do (ya khaali chhod do).' });
  }

  const submissions = readSubmissions();

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name: name.trim(),
    phone: phone.trim(),
    email: (email || '').trim(),
    topic: topic.trim(),
    message: (message || '').trim(),
    createdAt: new Date().toISOString()
  };

  submissions.push(entry);
  writeSubmissions(submissions);

  console.log('New lead:', entry.name, entry.phone, entry.topic);

  res.json({ success: true });
});

// ---------- Admin: view submissions ----------
app.get('/admin', (req, res) => {
  if (req.query.key !== ADMIN_KEY) {
    return res.status(401).send('Unauthorized. Add ?key=YOUR_ADMIN_KEY to the URL.');
  }

  const submissions = readSubmissions().slice().reverse();

  const rows = submissions.map(s => `
    <tr>
      <td>${new Date(s.createdAt).toLocaleString('en-IN')}</td>
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.phone)}</td>
      <td>${escapeHtml(s.email)}</td>
      <td>${escapeHtml(s.topic)}</td>
      <td>${escapeHtml(s.message)}</td>
    </tr>
  `).join('');

  res.send(`
    <html>
    <head>
      <title>Vicky's Creation — Leads</title>
      <style>
        body { font-family: sans-serif; background:#0f0f2a; color:#fff; padding:24px; }
        h1 { color: #ffe600; }
        table { width:100%; border-collapse: collapse; margin-top:16px; }
        th, td { border: 1px solid #333; padding: 8px 10px; text-align:left; font-size:14px; }
        th { background:#1a1a3a; }
        tr:nth-child(even) { background: rgba(255,255,255,0.03); }
        a.export { color:#00cfff; }
      </style>
    </head>
    <body>
      <h1>📋 Leads (${submissions.length})</h1>
      <a class="export" href="/admin/export?key=${ADMIN_KEY}">⬇ Download as CSV</a>
      <table>
        <tr><th>Date</th><th>Name</th><th>Phone</th><th>Email</th><th>Topic</th><th>Message</th></tr>
        ${rows || '<tr><td colspan="6">Abhi tak koi submission nahi.</td></tr>'}
      </table>
    </body>
    </html>
  `);
});

// ---------- Admin: export as CSV ----------
app.get('/admin/export', (req, res) => {
  if (req.query.key !== ADMIN_KEY) {
    return res.status(401).send('Unauthorized.');
  }

  const submissions = readSubmissions();
  const header = 'Date,Name,Phone,Email,Topic,Message\n';
  const csv = submissions.map(s => [
    s.createdAt, s.name, s.phone, s.email, s.topic, s.message
  ].map(csvEscape).join(',')).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.send(header + csv);
});

function csvEscape(val) {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

app.listen(PORT, () => {
  console.log(`✅ Vicky's Creation server running at http://localhost:${PORT}`);
  console.log(`🔑 Admin panel: http://localhost:${PORT}/admin?key=${ADMIN_KEY}`);
});
