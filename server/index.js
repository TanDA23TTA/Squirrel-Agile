const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: 'Quá nhiều yêu cầu, hãy thử lại sau.' }
});
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;
