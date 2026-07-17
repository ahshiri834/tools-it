// تنظیمات متمرکز SEO — برای تغییر دامنه فقط همین فایل را ویرایش کنید
export const siteConfig = {
  domain: 'https://tools-it.ir',
  brand: 'IT Tools',
  // عنوان و توضیح صفحه اصلی
  homeTitle: 'IT Tools | مجموعه ابزارهای آنلاین رایگان برای توسعه‌دهندگان و متخصصان IT',
  homeDescription: 'مجموعه‌ای کامل از ابزارهای آنلاین رایگان برای برنامه‌نویسان و متخصصان فناوری اطلاعات؛ تبدیل JSON و YAML، تولید UUID و هش، رمزگذاری، QR کد، Base64، Regex و ده‌ها ابزار دیگر. سریع، امن و بدون نیاز به نصب.',
};

// آدرس canonical همیشه با اسلش پایانی ساخته می‌شود، چون صفحات پیش‌رندرشده
// به شکل dist/<route>/index.html نوشته می‌شوند و آپاچی فرم بدون اسلش را ۳۰۱ می‌کند.
// بدون این، هر canonical به آدرسی اشاره می‌کرد که خودش ریدایرکت می‌شود.
export function pageUrl(path: string): string {
  const withSlash = path.endsWith('/') ? path : `${path}/`;
  return `${siteConfig.domain}${withSlash}`;
}
