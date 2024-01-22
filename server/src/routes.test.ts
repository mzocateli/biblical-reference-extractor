import request from 'supertest';
import router from './routes';
import express from 'express';
import * as apiModule from './api';

jest.mock('./api');

const app = express();
app.use(express.json());
app.use(router);

describe('Routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should respond to a POST request at the root route', async () => {
    const resbody = { 'Gn 1.1': 'No princípio Deus criou os céus e a terra.' };
    jest.spyOn(apiModule, 'api').mockResolvedValue(resbody);
    const response = await request(app).post('/').send({ text: 'validText', translation: 'nvi' });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(resbody);
  });

  it('should respond with 500 for a POST with unhandled error', async () => {
    jest.spyOn(apiModule, 'api').mockRejectedValue(new Error('unhandled error'));
    const response = await request(app).post('/').send({ text: 'validText', translation: 'nvi' });
    expect(response.status).toBe(500);
    expect(response.text).toBe('unhandled error');
  });

  it('should respond to an OPTIONS request at any route', async () => {
    const response = await request(app).options('/');
    expect(response.status).toBe(200);
    expect(response.headers.allow).toBe('POST, OPTIONS');
  });

  it('should respond with 405 for non-POST, non-OPTIONS requests at any route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(405);
    expect(response.text).toBe('Method not allowed');
  });
});
