// تنظیمات متمرکز SEO — برای تغییر دامنه فقط همین فایل را ویرایش کنید
export const siteConfig = {
  domain: 'https://tools-it.ir',
  brand: 'IT Tools',
  // عنوان و توضیح صفحه اصلی
  homeTitle: 'IT Tools | مجموعه ابزارهای آنلاین رایگان برای توسعه‌دهندگان و متخصصان IT',
  homeDescription: 'مجموعه‌ای کامل از ابزارهای آنلاین رایگان برای برنامه‌نویسان و متخصصان فناوری اطلاعات؛ تبدیل JSON و YAML، تولید UUID و هش، رمزگذاری، QR کد، Base64، Regex و ده‌ها ابزار دیگر. سریع، امن و بدون نیاز به نصب.',
};

export function pageUrl(path: string): string {
  if (path === '/') {
    return `${siteConfig.domain}/`;
  }
  return `${siteConfig.domain}${path}`;
}
