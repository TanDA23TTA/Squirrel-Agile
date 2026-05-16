const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const transactionBtn = document.getElementById('transactionBtn');
const accountSection = document.getElementById('accountSection');
const accountInfo = document.getElementById('accountInfo');
const balanceInfo = document.getElementById('balanceInfo');
const transactionsList = document.getElementById('transactionsList');
const messageBox = document.getElementById('message');

function showMessage(text, type = 'info') {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
}

function saveToken(token) {
  localStorage.setItem('authToken', token);
}

function getToken() {
  return localStorage.getItem('authToken');
}

function setAccountInfo(user, account) {
  accountInfo.textContent = `Tên: ${user.name} • Email: ${user.email}`;
  balanceInfo.textContent = `Số dư: ${account.balance.toFixed(2)} VND`;
  accountSection.classList.remove('hidden');
  transactionsList.innerHTML = '';
  account.transactions.forEach((tx) => {
    const li = document.createElement('li');
    li.textContent = `${tx.createdAt} | ${tx.type.toUpperCase()} | ${tx.amount.toFixed(2)} | ${tx.description}`;
    transactionsList.appendChild(li);
  });
}

async function register() {
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;

  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    showMessage(data.error || data.errors?.[0]?.msg || 'Đăng ký thất bại', 'error');
    return;
  }

  saveToken(data.token);
  setAccountInfo(data.user, data.account);
  showMessage('Đăng ký thành công', 'success');
}

async function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    showMessage(data.error || data.errors?.[0]?.msg || 'Đăng nhập thất bại', 'error');
    return;
  }

  saveToken(data.token);
  setAccountInfo(data.user, data.account);
  showMessage('Đăng nhập thành công', 'success');
}

async function loadProfile() {
  const token = getToken();
  if (!token) {
    return;
  }
  const response = await fetch('/api/account/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) {
    showMessage(data.error || 'Không thể tải tài khoản', 'error');
    return;
  }
  accountInfo.textContent = 'Thông tin tài khoản đã đăng nhập';
  balanceInfo.textContent = `Số dư: ${data.balance.toFixed(2)} VND`;
  accountSection.classList.remove('hidden');
  transactionsList.innerHTML = '';
  data.transactions.forEach((tx) => {
    const li = document.createElement('li');
    li.textContent = `${tx.createdAt} | ${tx.type.toUpperCase()} | ${tx.amount.toFixed(2)} | ${tx.description}`;
    transactionsList.appendChild(li);
  });
}

async function addTransaction() {
  const token = getToken();
  if (!token) {
    showMessage('Bạn cần đăng nhập trước', 'error');
    return;
  }

  const type = document.getElementById('transactionType').value;
  const amount = parseFloat(document.getElementById('transactionAmount').value);
  const description = document.getElementById('transactionDescription').value.trim();

  const response = await fetch('/api/account/transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ type, amount, description })
  });

  const data = await response.json();
  if (!response.ok) {
    showMessage(data.error || data.errors?.[0]?.msg || 'Lỗi thêm giao dịch', 'error');
    return;
  }

  balanceInfo.textContent = `Số dư: ${data.balance.toFixed(2)} VND`;
  const li = document.createElement('li');
  li.textContent = `${data.transaction.createdAt} | ${data.transaction.type.toUpperCase()} | ${data.transaction.amount.toFixed(2)} | ${data.transaction.description}`;
  transactionsList.prepend(li);
  showMessage('Giao dịch đã được thêm', 'success');
}

registerBtn.addEventListener('click', register);
loginBtn.addEventListener('click', login);
transactionBtn.addEventListener('click', addTransaction);
window.addEventListener('load', loadProfile);
