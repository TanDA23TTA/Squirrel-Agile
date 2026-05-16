const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'squirrel-agile-secret';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Yêu cầu xác thực' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
