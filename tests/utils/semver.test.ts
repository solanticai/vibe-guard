import { describe, it, expect } from 'vitest';
import { parseSemver, compareSemver, isNewerVersion } from '../../src/utils/semver.js';

describe('parseSemver', () => {
  it('should parse a simple version', () => {
    const v = parseSemver('1.2.3');
    expect(v).toEqual({ major: 1, minor: 2, patch: 3, prerelease: [] });
  });

  it('should parse a version with prerelease', () => {
    const v = parseSemver('1.0.0-alpha.1');
    expect(v).toEqual({ major: 1, minor: 0, patch: 0, prerelease: ['alpha', '1'] });
  });

  it('should strip leading v', () => {
    const v = parseSemver('v2.0.0');
    expect(v).toEqual({ major: 2, minor: 0, patch: 0, prerelease: [] });
  });

  it('should return null for invalid versions', () => {
    expect(parseSemver('not-a-version')).toBeNull();
    expect(parseSemver('1.2')).toBeNull();
    expect(parseSemver('')).toBeNull();
  });
});

describe('compareSemver', () => {
  it('should return 0 for equal versions', () => {
    expect(compareSemver('1.0.0', '1.0.0')).toBe(0);
  });

  it('should compare major versions', () => {
    expect(compareSemver('1.0.0', '2.0.0')).toBe(-1);
    expect(compareSemver('3.0.0', '2.0.0')).toBe(1);
  });

  it('should compare minor versions', () => {
    expect(compareSemver('1.1.0', '1.2.0')).toBe(-1);
    expect(compareSemver('1.3.0', '1.2.0')).toBe(1);
  });

  it('should compare patch versions', () => {
    expect(compareSemver('1.0.1', '1.0.2')).toBe(-1);
    expect(compareSemver('1.0.3', '1.0.2')).toBe(1);
  });

  it('should rank release higher than prerelease', () => {
    expect(compareSemver('1.0.0', '1.0.0-alpha')).toBe(1);
    expect(compareSemver('1.0.0-alpha', '1.0.0')).toBe(-1);
  });

  it('should compare prerelease identifiers', () => {
    expect(compareSemver('1.0.0-alpha', '1.0.0-beta')).toBe(-1);
    expect(compareSemver('1.0.0-alpha.1', '1.0.0-alpha.2')).toBe(-1);
  });

  it('should treat numeric prerelease identifiers as numbers', () => {
    expect(compareSemver('1.0.0-alpha.2', '1.0.0-alpha.10')).toBe(-1);
  });

  it('should handle v prefix', () => {
    expect(compareSemver('v1.0.0', 'v1.0.1')).toBe(-1);
  });
});

describe('isNewerVersion', () => {
  it('should return true when latest is newer', () => {
    expect(isNewerVersion('1.0.0', '1.0.1')).toBe(true);
    expect(isNewerVersion('0.2.0-alpha.0', '0.2.0')).toBe(true);
    expect(isNewerVersion('0.2.0', '1.0.0')).toBe(true);
  });

  it('should return false when versions are equal', () => {
    expect(isNewerVersion('1.0.0', '1.0.0')).toBe(false);
  });

  it('should return false when current is newer', () => {
    expect(isNewerVersion('2.0.0', '1.0.0')).toBe(false);
    expect(isNewerVersion('1.0.0', '1.0.0-beta.1')).toBe(false);
  });
});
