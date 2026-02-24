import { describe, it, expect } from 'vitest';
import { ENV } from './env';

describe('Environment Variables', () => {
  it('should have default app title', () => {
    expect(ENV.APP_TITLE).toBe('Polyfolio');
  });

  it('should have API URL', () => {
    expect(ENV.API_URL).toBeDefined();
    expect(typeof ENV.API_URL).toBe('string');
  });

  it('should have DEBUG mode defined', () => {
    expect(ENV.DEBUG).toBeDefined();
    expect(typeof ENV.DEBUG).toBe('boolean');
  });

  it('should have MODE defined', () => {
    expect(ENV.MODE).toBeDefined();
  });

  it('should have PROD and DEV flags', () => {
    expect(typeof ENV.PROD).toBe('boolean');
    expect(typeof ENV.DEV).toBe('boolean');
  });

  it('should be readonly', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (ENV as any).APP_TITLE = 'Test';
    }).toThrow();
  });
});
