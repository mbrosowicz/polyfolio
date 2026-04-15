import { describe, it, expect } from 'vitest';
import { defaultProjectNodes } from './projectNodes';

describe('defaultProjectNodes', () => {
  it('contains at least four project nodes', () => {
    expect(defaultProjectNodes.length).toBeGreaterThanOrEqual(4);
  });

  it('uses unique ids for each project', () => {
    const ids = defaultProjectNodes.map((project) => project.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('has valid marker positions for all nodes', () => {
    for (const project of defaultProjectNodes) {
      expect(project.position).toHaveLength(3);
      expect(project.position.every((value) => Number.isFinite(value))).toBe(true);
    }
  });

  it('includes stack tags for all nodes', () => {
    for (const project of defaultProjectNodes) {
      expect(project.stack.length).toBeGreaterThan(0);
    }
  });
});
