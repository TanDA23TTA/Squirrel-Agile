const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const authRoutes = require('./auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', (req, res) => {
  const account = authRoutes.accounts.find((item) => item.userId === req.user.userId);
  if (!account) {
    return res.status(404).json({ error: 'Không tìm thấy tài khoản' });
  }
  return res.json({ balance: account.balance, transactions: account.transactions });
});

router.post(
  '/transaction',
  body('type').isIn(['deposit', 'withdraw']).withMessage('Loại giao dịch không hợp lệ'),
  body('amount').isFloat({ gt: 0 }).withMessage('Số tiền phải lớn hơn 0'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, amount, description = '' } = req.body;
    const account = authRoutes.accounts.find((item) => item.userId === req.user.userId);
    if (!account) {
      return res.status(404).json({ error: 'Không tìm thấy tài khoản' });
    }

    if (type === 'withdraw' && account.balance < amount) {
      return res.status(400).json({ error: 'Số dư không đủ để rút' });
    }

    const signedAmount = type === 'deposit' ? amount : -amount;
    account.balance += signedAmount;
    const transaction = {
      id: account.transactions.length + 1,
      type,
      amount,
      description,
      createdAt: new Date().toISOString()
    };
    account.transactions.unshift(transaction);

    return res.status(201).json({ balance: account.balance, transaction, transactions: account.transactions });
  }
);

module.exports = router;
