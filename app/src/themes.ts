import type { GlobalThemeOverrides } from 'naive-ui';

// naive-ui به‌صورت پیش‌فرض روی همه‌ی کامپوننت‌هایش fontFamily را روی «v-sans» ست
// می‌کند و همین باعث می‌شد عنوان‌ها، دکمه‌ها، اینپوت‌ها و منو با فونت fallback
// رندر شوند، حتی وقتی body روی Vazirmatn تنظیم بود. پس فونت را در common تم
// هم اعلام می‌کنیم تا کل UI یکدست باشد.
const fontFamily = '\'Vazirmatn\', system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Tahoma, sans-serif';
// کد و خروجی‌های فنی باید monospace بمانند تا هم‌ترازی کاراکترها حفظ شود.
const fontFamilyMono = 'SFMono-Regular, Menlo, Consolas, \'Courier New\', monospace';

export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    fontFamily,
    fontFamilyMono,
  },

  Menu: {
    itemHeight: '32px',
  },

  Layout: { color: '#f1f5f9' },

  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px' },
    },
  },
};

export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    fontFamily,
    fontFamilyMono,
    primaryColor: '#1ea54cFF',
    primaryColorHover: '#36AD6AFF',
    primaryColorPressed: '#0C7A43FF',
    primaryColorSuppl: '#36AD6AFF',
  },

  Notification: {
    color: '#333333',
  },

  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px', color: '#1e1e1e' },
    },
  },

  Menu: {
    itemHeight: '32px',
  },

  Layout: {
    color: '#1c1c1c',
    siderColor: '#232323',
    siderBorderColor: 'transparent',
  },

  Card: {
    color: '#232323',
    borderColor: '#282828',
  },

  Table: {
    tdColor: '#232323',
    thColor: '#353535',
  },
};
