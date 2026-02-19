import request, { Response } from 'supertest';
import app from '../src/app';
import { prisma } from '../src/lib/db'

describe('Better Auth - Authentication Flow', () => {
  let sessionCookie: string = '';

  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'securepassword123',
    metricSystem: 'EU',
  };

  // clean from previous wrong executions
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  // cleanup
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });

    await prisma.$disconnect();
  });

  it('1. Should successfully sign up a new user', async () => {
    const res: Response = await request(app)
      .post('/api/auth/sign-up/email')
      .send(testUser);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('2. Should successfully log in the user and return a cookie', async () => {
    const res: Response = await request(app)
      .post('/api/auth/sign-in/email')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);

    const rawCookieHeader = res.headers['set-cookie'];

    const cookies: string[] = Array.isArray(rawCookieHeader)
      ? rawCookieHeader
      : typeof rawCookieHeader === 'string'
        ? [rawCookieHeader]
        : [];

    expect(cookies.length).toBeGreaterThan(0);

    const firstCookie = cookies[0];
    if (!firstCookie) {
      throw new Error('No session cookie returned from Better Auth');
    }

    const cookieValue = firstCookie.split(';')[0];
    if (!cookieValue) {
      throw new Error('Malformed session cookie');
    }
    sessionCookie = cookieValue;
  });

  it('3. Should access a protected route using the session cookie', async () => {
    const res: Response = await request(app)
      .get('/api/test')
      .set('Cookie', sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Success');
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('4. Should reject access to a protected route without a cookie', async () => {
    const res: Response = await request(app)
      .get('/api/test');

    expect(res.status).toBe(401);
  });
});
