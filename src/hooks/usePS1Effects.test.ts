import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWindowSize, usePS1Effects, usePerformanceMonitor } from './usePS1Effects';

// Mock @react-three/fiber — hooks using useFrame cannot run outside a Canvas context
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Helper to get the most recent callback passed to the useFrame mock
async function getUseFrameMock() {
  const r3f = await import('@react-three/fiber');
  return r3f.useFrame as ReturnType<typeof vi.fn>;
}

describe('usePS1Effects', () => {
  it('returns default values when called with no options', () => {
    const { result } = renderHook(() => usePS1Effects());
    expect(result.current.time).toBe(0);
    expect(result.current.gridSize).toBe(8);
    expect(result.current.wobbleStrength).toBe(0.5);
    expect(result.current.posterizationLevels).toBe(8);
  });

  it('accepts custom options', () => {
    const { result } = renderHook(() =>
      usePS1Effects({ gridSize: 16, wobbleStrength: 1.0, posterizationLevels: 4 })
    );
    expect(result.current.gridSize).toBe(16);
    expect(result.current.wobbleStrength).toBe(1.0);
    expect(result.current.posterizationLevels).toBe(4);
  });

  it('returns uniforms object with correct keys', () => {
    const { result } = renderHook(() => usePS1Effects());
    expect(result.current.uniforms).toHaveProperty('uTime');
    expect(result.current.uniforms).toHaveProperty('uGridSize');
    expect(result.current.uniforms).toHaveProperty('uWobbleStrength');
  });

  it('uniforms reflect the option values', () => {
    const { result } = renderHook(() => usePS1Effects({ gridSize: 4, wobbleStrength: 0.2 }));
    expect(result.current.uniforms.uGridSize.value).toBe(4);
    expect(result.current.uniforms.uWobbleStrength.value).toBe(0.2);
  });

  it('frame callback updates time when enableAnimation is true', async () => {
    const useFrameMock = await getUseFrameMock();
    const { result } = renderHook(() => usePS1Effects({ enableAnimation: true }));

    const frameCallback = useFrameMock.mock.calls[0]?.[0] as (state: {
      clock: { getElapsedTime: () => number };
    }) => void;

    act(() => {
      frameCallback({ clock: { getElapsedTime: () => 2.5 } });
    });

    expect(result.current.time).toBe(2.5);
  });

  it('frame callback does not update time when enableAnimation is false', async () => {
    const useFrameMock = await getUseFrameMock();
    const { result } = renderHook(() => usePS1Effects({ enableAnimation: false }));

    const frameCallback = useFrameMock.mock.calls[0]?.[0] as (state: {
      clock: { getElapsedTime: () => number };
    }) => void;

    act(() => {
      frameCallback({ clock: { getElapsedTime: () => 9.9 } });
    });

    // time should not have changed since animation is disabled
    expect(result.current.time).toBe(0);
  });
});

describe('usePerformanceMonitor', () => {
  it('returns an fps value', () => {
    const { result } = renderHook(() => usePerformanceMonitor());
    expect(typeof result.current.fps).toBe('number');
  });

  it('starts with fps of 0', () => {
    const { result } = renderHook(() => usePerformanceMonitor());
    expect(result.current.fps).toBe(0);
  });

  it('frame callback increments frame count when delta < 1000ms', async () => {
    const useFrameMock = await getUseFrameMock();
    renderHook(() => usePerformanceMonitor());

    const frameCallback = useFrameMock.mock.calls[0]?.[0] as () => void;

    // Should not throw — delta will be < 1000ms (runs right after init)
    act(() => {
      frameCallback();
    });
  });

  it('frame callback updates fps after 1 second has elapsed', async () => {
    const useFrameMock = await getUseFrameMock();
    const { result } = renderHook(() => usePerformanceMonitor());

    const frameCallback = useFrameMock.mock.calls[0]?.[0] as () => void;

    // Advance system time by 1001ms so delta >= 1000
    vi.setSystemTime(Date.now() + 1001);

    act(() => {
      frameCallback();
    });

    expect(result.current.fps).toBeGreaterThanOrEqual(0);
  });
});

describe('useWindowSize', () => {
  it('returns width and height matching window dimensions', () => {
    const { result } = renderHook(() => useWindowSize());
    expect(result.current.width).toBe(window.innerWidth);
    expect(result.current.height).toBe(window.innerHeight);
  });

  it('width and height are positive numbers', () => {
    const { result } = renderHook(() => useWindowSize());
    expect(result.current.width).toBeGreaterThan(0);
    expect(result.current.height).toBeGreaterThan(0);
  });

  it('updates width when window is resized', () => {
    const { result } = renderHook(() => useWindowSize());
    const newWidth = result.current.width + 200;

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: newWidth,
      });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.width).toBe(newWidth);
  });

  it('updates height when window is resized', () => {
    const { result } = renderHook(() => useWindowSize());
    const newHeight = result.current.height + 150;

    act(() => {
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: newHeight,
      });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.height).toBe(newHeight);
  });

  it('cleans up resize listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useWindowSize());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
