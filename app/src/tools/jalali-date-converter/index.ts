import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';
import CalendarMonth from '~icons/mdi/calendar-month';

export const tool = defineTool({
  name: translate('tools.jalali-date-converter.title'),
  path: '/jalali-date-converter',
  description: translate('tools.jalali-date-converter.description'),
  keywords: [
    'jalali', 'shamsi', 'persian', 'date', 'converter', 'gregorian', 'hijri',
    'تبدیل', 'تاریخ', 'شمسی', 'میلادی', 'جلالی', 'هجری', 'تقویم',
  ],
  component: () => import('./jalali-date-converter.vue'),
  icon: CalendarMonth,
  createdAt: new Date('2026-08-04'),
});
