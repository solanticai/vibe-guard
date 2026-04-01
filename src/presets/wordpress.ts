import type { Preset } from '../types.js';

export const wordpress: Preset = {
  id: 'wordpress',
  name: 'WordPress',
  description: 'WordPress conventions: migration safety, naming patterns.',
  version: '1.0.0',
  rules: {
    'workflow/migration-safety': true,
    'quality/naming-conventions': {
      vagueFilenames: ['functions.php'],
    },
  },
};
