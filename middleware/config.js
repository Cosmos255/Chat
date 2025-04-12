const path = require('path');

let blacklistTokens = new Set(); // Store blacklisted tokens in memory

const corsOptions = {
  origin: 'http://your-frontend-url.com', // Replace with actual frontend URL
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

const JWT_SECRET_KEY = "uczDmqYS6i"; // Store securely in environment variable if needed
const DB_URI = "mongodb://127.0.0.1:27017/messages";

// Static paths
const pathtosource = path.join(__dirname, 'src');
const paths = {
  indexHTML: path.join(pathtosource, 'messages.html'),
  log_in: path.join(pathtosource, 'log_in.html'),
  register: path.join(pathtosource, 'register.html'),
  indexCSS: path.join(pathtosource, 'style.css'),
  indexJS: path.join(pathtosource, 'index.ts')
};

module.exports = {
  corsOptions,
  JWT_SECRET_KEY,
  DB_URI,
  paths
};