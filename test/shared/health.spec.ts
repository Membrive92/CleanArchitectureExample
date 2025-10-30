import { describe, it, expect } from 'vitest';
import { checkHealth } from '../../src/shared/health';

describe('Health Check', () => {
  it('should return healthy status', () => {
    const result = checkHealth();
    
    expect(result.status).toBe('healthy');
    expect(result.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
  });
});
