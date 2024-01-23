import { handleJsonError, logReqs, validatePostRequest } from './middlewares';
import { NextFunction, Request, Response } from 'express';

describe('Middlewares', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe('handleJsonError', () => {
    it('should handle JSON parsing error', () => {
      const mockError = new SyntaxError();
      (mockError as any).body = '';

      handleJsonError(mockError, mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Invalid JSON');
    });

    it('should call next function if no JSON parsing error', () => {
      const mockError = new Error();
      handleJsonError(mockError, mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });
  });

  describe('validatePostRequest', () => {
    it('should validate compliant post request', () => {
      mockRequest.body = {
        text: 'validText',
        translation: 'nvi',
      };
      validatePostRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 400 if text is missing', () => {
      mockRequest.body = {
        translation: 'aa',
      };
      validatePostRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Missing text');
    });

    it('should return 400 if text is invalid', () => {
      mockRequest.body = {
        text: 123,
        translation: 'aa',
      };
      validatePostRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Invalid text');
    });

    it('should return 400 if translation is missing', () => {
      mockRequest.body = {
        text: 'validText',
      };
      validatePostRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Missing translation');
    });

    it('should return 400 if translation is invalid', () => {
      mockRequest.body = {
        text: 'validText',
        translation: 'invalid',
      };
      validatePostRequest(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Invalid translation');
    });
  });
  describe('logReqs', () => {
    it('should log requests', () => {
      mockRequest = {
        method: 'GET',
        url: '/',
        protocol: 'http',
        hostname: 'localhost',
        path: '/',
        ip: '::1',
      };
      const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => { });
      logReqs(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(consoleLog).toHaveBeenCalledWith('Method: GET | URL: / | Source http://localhost/ from ::1');
    });
  });
});
