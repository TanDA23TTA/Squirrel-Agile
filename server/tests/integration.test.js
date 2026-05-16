const request = require('supertest');
const app = require('../index');

describe('Integration test for auth and account flow', () => {
  let token;

  it('should register a user and return account data', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('test@example.com');
    expect(response.body.account.balance).toBe(0);
  });

  it('should login successfully with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.name).toBe('Test User');
    token = response.body.token;
  });

  it('should return profile data when authenticated', async () => {
    const response = await request(app)
      .get('/api/account/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.balance).toBe(0);
    expect(Array.isArray(response.body.transactions)).toBe(true);
  });

  it('should add deposit transaction and update balance', async () => {
    const response = await request(app)
      .post('/api/account/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'deposit', amount: 150.5, description: 'Nạp tiền thử nghiệm' });

    expect(response.statusCode).toBe(201);
    expect(response.body.balance).toBe(150.5);
    expect(response.body.transaction.type).toBe('deposit');
  });

  it('should add withdraw transaction and reduce balance', async () => {
    const response = await request(app)
      .post('/api/account/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'withdraw', amount: 50, description: 'Rút tiền thử nghiệm' });

    expect(response.statusCode).toBe(201);
    expect(response.body.balance).toBe(100.5);
    expect(response.body.transaction.type).toBe('withdraw');
  });
});
