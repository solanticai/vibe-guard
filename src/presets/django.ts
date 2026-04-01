import type { Preset } from '../types.js';

export const django: Preset = {
  id: 'django',
  name: 'Django',
  description: 'Django conventions: snake_case files, migration safety, import aliases.',
  version: '1.0.0',
  rules: {
    'workflow/migration-safety': true,
    'quality/import-aliases': {
      aliases: [],
      maxRelativeDepth: 3,
    },
  },
};
