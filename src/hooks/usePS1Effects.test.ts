import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWindowSize, usePerformanceMonitor } from './usePS1Effects';

describe('Custom Hooks', () => {
  describe('useWindowSize', () => {
    it('should return window dimensions', () => {
      const { result } = renderHook(() => useWindowSize());

      expect(result.current).toBeDefined();
      expect(result.current.width).toBeGreaterThan(0);
      expect(result.current.height).toBeGreaterThan(0);
    });

    it('should have window as source', () => {
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBe(window.innerWidth);
      expect(result.current.height).toBe(window.innerHeight);
    });

    it('should update on window resize', async () => {
      const { result } = renderHook(() => useWindowSize());

      const originalWidth = result.current.width;

      await act(async () => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: originalWidth + 100,
        });

        window.dispatchEvent(new Event('resize'));

        // Give time for hook to update
        await new Promise((resolve) => setTimeout(resolve, 100));
      });
    });
  });

  describe('usePerformanceMonitor', () => {
    it('should return performance stats', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      expect(result.current).toBeDefined();
      expect(result.current.fps).toBeDefined();
      expect(typeof result.current.fps).toBe('number');
    });

    it('should have fps value', () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      expect(result.current.fps).toBeGreaterThanOrEqual(0);
      expect(result.current.fps).toBeLessThanOrEqual(300);
    });
  });
});
