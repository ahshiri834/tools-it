/**
 * تبدیل تاریخ هجری شمسی (جلالی) و میلادی.
 *
 * پیاده‌سازی مستقیم الگوریتم استاندارد جلالی (بر پایه‌ی کار Kazimierz M. Borkowski)
 * انجام شده و به کتابخانه‌ی خارجی وابسته نیست. دلیل: هیچ‌کدام از وابستگی‌های
 * فعلی پروژه تبدیل جلالی ندارند و نصب پکیج جدید هم به‌خاطر تعارض peer dependency
 * موجود (tiptap) شکست می‌خورد. الگوریتم قطعی است و با تست پوشش داده شده.
 *
 * محدوده‌ی معتبر سال جلالی: -61 تا 3177
 */

export interface JalaliDate { jy: number; jm: number; jd: number }
export interface GregorianDate { gy: number; gm: number; gd: number }

function div(a: number, b: number): number {
  return Math.trunc(a / b);
}

function mod(a: number, b: number): number {
  return a - Math.trunc(a / b) * b;
}

/**
 * نقاط شکست چرخه‌ی کبیسه در گاه‌شماری جلالی. این آرایه بخشی از تعریف الگوریتم
 * است و نباید تغییر کند.
 */
const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181,
  1210, 1635, 1701, 1866, 2020, 2317, 2394, 2456, 3178,
];

export const MIN_JALALI_YEAR = BREAKS[0];
export const MAX_JALALI_YEAR = BREAKS[BREAKS.length - 1] - 1;

interface JalaliCalInfo { leap: number; gy: number; march: number }

/**
 * اطلاعات تقویمی یک سال جلالی: وضعیت کبیسه، سال میلادی متناظر و روزِ مارس که
 * اول فروردین روی آن می‌افتد.
 */
function jalCal(jy: number): JalaliCalInfo {
  if (jy < MIN_JALALI_YEAR || jy > MAX_JALALI_YEAR) {
    throw new RangeError(`سال جلالی خارج از محدوده‌ی معتبر است: ${jy}`);
  }

  const gy = jy + 621;
  let leapJ = -14;
  let jp = BREAKS[0];
  let jump = 0;

  for (let i = 1; i < BREAKS.length; i += 1) {
    const jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) {
      break;
    }
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }

  let n = jy - jp;

  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) {
    leapJ += 1;
  }

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) {
    n = n - jump + div(jump + 4, 33) * 33;
  }
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) {
    leap = 4;
  }

  return { leap, gy, march };
}

/** شماره‌ی روز ژولینی از تاریخ میلادی */
function g2d(gy: number, gm: number, gd: number): number {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
    + div(153 * mod(gm + 9, 12) + 2, 5)
    + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

/** تاریخ میلادی از شماره‌ی روز ژولینی */
function d2g(jdn: number): GregorianDate {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

/** شماره‌ی روز ژولینی از تاریخ جلالی */
function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

/** تاریخ جلالی از شماره‌ی روز ژولینی */
function d2j(jdn: number): JalaliDate {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;

  if (k >= 0) {
    if (k <= 185) {
      return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
    }
    k -= 186;
  }
  else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) {
      k += 1;
    }
  }

  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 };
}

/** آیا سال جلالی کبیسه است (اسفند ۳۰ روزه دارد)؟ */
export function isJalaliLeapYear(jy: number): boolean {
  return jalCal(jy).leap === 0;
}

/** تعداد روزهای یک ماه جلالی */
export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) {
    return 31;
  }
  if (jm <= 11) {
    return 30;
  }
  return isJalaliLeapYear(jy) ? 30 : 29;
}

/** آیا ترکیب سال/ماه/روز جلالی یک تاریخ واقعی است؟ */
export function isValidJalaliDate(jy: number, jm: number, jd: number): boolean {
  if (!Number.isInteger(jy) || !Number.isInteger(jm) || !Number.isInteger(jd)) {
    return false;
  }
  if (jy < MIN_JALALI_YEAR || jy > MAX_JALALI_YEAR || jm < 1 || jm > 12 || jd < 1) {
    return false;
  }
  return jd <= jalaliMonthLength(jy, jm);
}

/** آیا ترکیب سال/ماه/روز میلادی یک تاریخ واقعی است؟ */
export function isValidGregorianDate(gy: number, gm: number, gd: number): boolean {
  if (!Number.isInteger(gy) || !Number.isInteger(gm) || !Number.isInteger(gd)) {
    return false;
  }
  if (gm < 1 || gm > 12 || gd < 1 || gd > 31) {
    return false;
  }
  // با ساخت Date و مقایسه‌ی اجزا، روزهای نامعتبر مثل ۳۱ آوریل رد می‌شوند.
  const date = new Date(Date.UTC(gy, gm - 1, gd));
  date.setUTCFullYear(gy);
  return date.getUTCFullYear() === gy && date.getUTCMonth() === gm - 1 && date.getUTCDate() === gd;
}

/** میلادی → جلالی */
export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  return d2j(g2d(gy, gm, gd));
}

/** جلالی → میلادی */
export function jalaliToGregorian(jy: number, jm: number, jd: number): GregorianDate {
  return d2g(j2d(jy, jm, jd));
}

export const JALALI_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];

export const GREGORIAN_MONTH_NAMES = [
  'ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن',
  'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر',
];

export const WEEKDAY_NAMES = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

/** نام روز هفته‌ی فارسی برای یک تاریخ میلادی */
export function weekdayName(gy: number, gm: number, gd: number): string {
  const dayIndex = new Date(Date.UTC(gy, gm - 1, gd)).getUTCDay();
  return WEEKDAY_NAMES[dayIndex];
}

/** عدد را با صفر ابتدایی به طول دو رقم می‌برد */
export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** ارقام انگلیسی یک رشته را به فارسی تبدیل می‌کند */
export function toPersianDigits(value: string): string {
  return value.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

/** ارقام فارسی و عربی را به ارقام انگلیسی تبدیل می‌کند */
export function toEnglishDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x06F0))
    .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660));
}

/**
 * رشته‌ی تاریخ را به سه عدد سال/ماه/روز تبدیل می‌کند.
 * ارقام فارسی و عربی و جداکننده‌های / - . و فاصله پذیرفته می‌شوند.
 */
export function parseDateParts(input: string): [number, number, number] | null {
  const parts = toEnglishDigits(input)
    .trim()
    .split(/[^0-9]+/)
    .filter(Boolean);

  if (parts.length !== 3) {
    return null;
  }

  const [y, m, d] = parts.map(Number);
  if ([y, m, d].some(n => !Number.isFinite(n))) {
    return null;
  }

  return [y, m, d];
}
