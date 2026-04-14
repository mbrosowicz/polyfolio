import { describe, it, expect } from 'vitest';
import { ENV } from './env';

describe('ENV', () => {
  it('APP_TITLE falls back to "Polyfolio" when env var is absent', () => {
    expect(ENV.APP_TITLE).toBe('Polyfolio');
  });

  it('API_URL is a non-empty string', () => {
    expect(typeof ENV.API_URL).toBe('string');
    expect(ENV.API_URL.length).toBeGreaterThan(0);
  });

  it('API_URL falls back to localhost when env var is absent', () => {
    expect(ENV.API_URL).toContain('localhost');
  });

  it('DEBUG is a boolean', () => {
    expect(typeof ENV.DEBUG).toBe('boolean');
  });

  it('MODE is a string', () => {
    expect(typeof ENV.MODE).toBe('string');
    expect(ENV.MODE.length).toBeGreaterThan(0);
  });

  it('PROD is a boolean', () => {
    expect(typeof ENV.PROD).toBe('boolean');
  });

  it('DEV is a boolean', () => {
    expect(typeof ENV.DEV).toBe('boolean');
  });

  it('PROD and DEV are mutually exclusive', () => {
    expect(ENV.PROD && ENV.DEV).toBe(false);
  });

  it('object is frozen (readonly)', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (ENV as any).APP_TITLE = 'Hack';
    }).toThrow();
  });
});
