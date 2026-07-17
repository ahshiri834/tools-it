import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';
import Numeric from '~icons/mdi/numeric';

export const tool = defineTool({
  name: translate('tools.persian-number-normalizer.title'),
  path: '/persian-number-normalizer',
  description: translate('tools.persian-number-normalizer.description'),
  keywords: ['persian', 'number', 'normalizer', 'farsi', 'arabic', 'digits', 'اعداد', 'فارسی', 'عربی', 'نرمال‌سازی'],
  component: () => import('./persian-number-normalizer.vue'),
  icon: Numeric,
  createdAt: new Date('2026-07-17'),
});
