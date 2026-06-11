import { describe, it, expect } from 'vitest';
import { decodeMode06Response, labelTid } from './mode06.js';

describe('mode06 decoders', () => {
  it('decodes a 46-frame test result', () => {
    const results = decodeMode06Response(['46 03 11 01 2C 00 64 02 58']);
    expect(results).toHaveLength(1);
    expect(results[0].tid).toBe('03');
    expect(results[0].cid).toBe('11');
    expect(results[0].value).toBe(300);
    expect(results[0].status).toBe('pass');
  });

  it('labels known TIDs', () => {
    expect(labelTid('03')).toContain('catalyst');
  });
});
