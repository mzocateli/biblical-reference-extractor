import request from 'supertest';
import server from './server';

describe('server', () => {
  afterAll(done => {
    server.close(done);
  });

  it('should use JSON middleware', async () => {
    const res = await request(server).post('/').send({ text: 'text', translation: 'aa' }).expect('Content-Type', /json/);
    expect(res.status).toBe(200);
  });

  it('should use Helmet middleware', async () => {
    const res = await request(server).options('/');
    console.log(res.headers);
    expect(res.header['x-dns-prefetch-control']).toBe('off');
  });

  it('should use CORS middleware', async () => {
    const res = await request(server).options('/');
    expect(res.header['access-control-allow-methods']).toBe('POST,OPTIONS');
    expect(res.header['access-control-allow-headers']).toBe('Content-Type');
  });
});
