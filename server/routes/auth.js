const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const secret = process.env.JWT_SECRET || 'squirrel-agile-secret';

const users = [];
const accounts = [];

function findAccountByUserId(userId) {
  return accounts.find((item) => item.userId === userId);
}

router.post(
  '/register',
  body('name').trim().notEmpty().withMessage('Tên là bắt buộc'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải ít nhất 6 ký tự'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    if (users.find((user) => user.email === email)) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { id: users.length + 1, name, email, password: hashedPassword };
    users.push(newUser);

    const newAccount = {
      userId: newUser.id,
      balance: 0,
      transactions: []
    };
    accounts.push(newAccount);

    const token = jwt.sign({ userId: newUser.id }, secret, { expiresIn: '2h' });
    return res.status(201).json({
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      account: { balance: newAccount.balance, transactions: newAccount.transactions }
    });
  }
);

router.post(
  '/login',
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu là bắt buộc'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = users.find((item) => item.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const account = findAccountByUserId(user.id);
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '2h' });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
      account: { balance: account.balance, transactions: account.transactions }
    });
  }
);

module.exports = router;
module.exports.users = users;
module.exports.accounts = accounts;
