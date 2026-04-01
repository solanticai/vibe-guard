import { describe, it, expect } from 'vitest';
import {
  getProfileSeverity,
  isValidProfile,
  ALL_PROFILES,
  getProfileDescription,
} from '../../src/config/profiles.js';

describe('config/profiles', () => {
  describe('getProfileSeverity', () => {
    it('strict profile should block everything', () => {
      expect(getProfileSeverity('strict', 'security/branch-protection')).toBe('block');
      expect(getProfileSeverity('strict', 'quality/import-aliases')).toBe('block');
      expect(getProfileSeverity('strict', 'workflow/commit-conventions')).toBe('block');
    });

    it('standard profile should block security, warn quality and workflow', () => {
      expect(getProfileSeverity('standard', 'security/secret-detection')).toBe('block');
      expect(getProfileSeverity('standard', 'quality/no-console-log')).toBe('warn');
      expect(getProfileSeverity('standard', 'workflow/todo-tracker')).toBe('warn');
    });

    it('relaxed profile should block security, info everything else', () => {
      expect(getProfileSeverity('relaxed', 'security/env-exposure')).toBe('block');
      expect(getProfileSeverity('relaxed', 'quality/max-file-length')).toBe('info');
      expect(getProfileSeverity('relaxed', 'workflow/pr-reminder')).toBe('info');
    });

    it('audit profile should make everything info', () => {
      expect(getProfileSeverity('audit', 'security/branch-protection')).toBe('info');
      expect(getProfileSeverity('audit', 'quality/import-aliases')).toBe('info');
      expect(getProfileSeverity('audit', 'workflow/commit-conventions')).toBe('info');
    });
  });

  describe('isValidProfile', () => {
    it('should accept valid profile names', () => {
      expect(isValidProfile('strict')).toBe(true);
      expect(isValidProfile('standard')).toBe(true);
      expect(isValidProfile('relaxed')).toBe(true);
      expect(isValidProfile('audit')).toBe(true);
    });

    it('should reject invalid profile names', () => {
      expect(isValidProfile('invalid')).toBe(false);
      expect(isValidProfile('')).toBe(false);
    });
  });

  describe('ALL_PROFILES', () => {
    it('should list all four profiles', () => {
      expect(ALL_PROFILES).toHaveLength(4);
      expect(ALL_PROFILES).toContain('strict');
      expect(ALL_PROFILES).toContain('standard');
      expect(ALL_PROFILES).toContain('relaxed');
      expect(ALL_PROFILES).toContain('audit');
    });
  });

  describe('getProfileDescription', () => {
    it('should return descriptions for all profiles', () => {
      for (const profile of ALL_PROFILES) {
        expect(getProfileDescription(profile)).toBeTruthy();
      }
    });
  });
});
