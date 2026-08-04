import { describe, expect, it } from 'vitest';
import {
  gregorianToJalali,
  isJalaliLeapYear,
  isValidGregorianDate,
  isValidJalaliDate,
  jalaliMonthLength,
  jalaliToGregorian,
  parseDateParts,
  toPersianDigits,
  weekdayName,
} from './jalali-date-converter.service';

/**
 * جفت‌های مرجع (جلالی ↔ میلادی) که به‌صورت مستقل قابل راستی‌آزمایی هستند؛
 * شامل اول فروردین چند سال، پایان سال کبیسه و تاریخ‌های تاریخی.
 */
const REFERENCE_PAIRS: { jalali: [number, number, number]; gregorian: [number, number, number] }[] = [
  { jalali: [1300, 1, 1], gregorian: [1921, 3, 21] },
  { jalali: [1357, 11, 22], gregorian: [1979, 2, 11] },
  { jalali: [1398, 1, 1], gregorian: [2019, 3, 21] },
  { jalali: [1399, 12, 30], gregorian: [2021, 3, 20] },
  { jalali: [1400, 1, 1], gregorian: [2021, 3, 21] },
  { jalali: [1403, 1, 1], gregorian: [2024, 3, 20] },
  { jalali: [1403, 12, 30], gregorian: [2025, 3, 20] },
  { jalali: [1404, 1, 1], gregorian: [2025, 3, 21] },
  { jalali: [1405, 1, 1], gregorian: [2026, 3, 21] },
  { jalali: [1405, 5, 13], gregorian: [2026, 8, 4] },
];

describe('jalali-date-converter', () => {
  describe('gregorianToJalali', () => {
    it.each(REFERENCE_PAIRS)('$gregorian → $jalali', ({ jalali, gregorian }) => {
      const [gy, gm, gd] = gregorian;
      const [jy, jm, jd] = jalali;
      expect(gregorianToJalali(gy, gm, gd)).toEqual({ jy, jm, jd });
    });
  });

  describe('jalaliToGregorian', () => {
    it.each(REFERENCE_PAIRS)('$jalali → $gregorian', ({ jalali, gregorian }) => {
      const [jy, jm, jd] = jalali;
      const [gy, gm, gd] = gregorian;
      expect(jalaliToGregorian(jy, jm, jd)).toEqual({ gy, gm, gd });
    });
  });

  it('is a round trip over a long continuous range of days', () => {
    // از ابتدای ۱۳۹۰ به مدت ~۲۰ سال، هر روز باید رفت‌وبرگشت پایدار باشد.
    const start = Date.UTC(2011, 2, 21); // 1390-01-01
    const oneDay = 86400000;

    for (let i = 0; i < 365 * 20; i += 1) {
      const date = new Date(start + i * oneDay);
      const gy = date.getUTCFullYear();
      const gm = date.getUTCMonth() + 1;
      const gd = date.getUTCDate();

      const { jy, jm, jd } = gregorianToJalali(gy, gm, gd);

      expect(isValidJalaliDate(jy, jm, jd)).toBe(true);
      expect(jalaliToGregorian(jy, jm, jd)).toEqual({ gy, gm, gd });
    }
  });

  describe('isJalaliLeapYear', () => {
    it('detects known leap years', () => {
      // سال‌های کبیسه‌ی شناخته‌شده (اسفند ۳۰ روزه)
      for (const jy of [1387, 1391, 1395, 1399, 1403, 1408]) {
        expect(isJalaliLeapYear(jy)).toBe(true);
      }
    });

    it('detects known common years', () => {
      for (const jy of [1400, 1401, 1402, 1404, 1405]) {
        expect(isJalaliLeapYear(jy)).toBe(false);
      }
    });
  });

  describe('jalaliMonthLength', () => {
    it('gives 31 days to the first six months', () => {
      for (let jm = 1; jm <= 6; jm += 1) {
        expect(jalaliMonthLength(1404, jm)).toBe(31);
      }
    });

    it('gives 30 days to months seven through eleven', () => {
      for (let jm = 7; jm <= 11; jm += 1) {
        expect(jalaliMonthLength(1404, jm)).toBe(30);
      }
    });

    it('gives esfand 30 days only in a leap year', () => {
      expect(jalaliMonthLength(1403, 12)).toBe(30);
      expect(jalaliMonthLength(1404, 12)).toBe(29);
    });
  });

  describe('isValidJalaliDate', () => {
    it('accepts esfand 30 in a leap year and rejects it otherwise', () => {
      expect(isValidJalaliDate(1403, 12, 30)).toBe(true);
      expect(isValidJalaliDate(1404, 12, 30)).toBe(false);
    });

    it('rejects out of range values', () => {
      expect(isValidJalaliDate(1404, 0, 1)).toBe(false);
      expect(isValidJalaliDate(1404, 13, 1)).toBe(false);
      expect(isValidJalaliDate(1404, 1, 0)).toBe(false);
      expect(isValidJalaliDate(1404, 1, 32)).toBe(false);
      expect(isValidJalaliDate(1404.5, 1, 1)).toBe(false);
    });

    it('rejects years outside the supported span without throwing', () => {
      expect(isValidJalaliDate(-100, 1, 1)).toBe(false);
      expect(isValidJalaliDate(4000, 1, 1)).toBe(false);
    });
  });

  describe('isValidGregorianDate', () => {
    it('accepts february 29 in a leap year and rejects it otherwise', () => {
      expect(isValidGregorianDate(2024, 2, 29)).toBe(true);
      expect(isValidGregorianDate(2025, 2, 29)).toBe(false);
    });

    it('rejects april 31', () => {
      expect(isValidGregorianDate(2025, 4, 31)).toBe(false);
    });

    it('handles two digit years without mapping them to 19xx', () => {
      expect(isValidGregorianDate(99, 1, 1)).toBe(true);
    });
  });

  describe('weekdayName', () => {
    it('names the weekday of known dates', () => {
      // 2026-08-04 سه‌شنبه است، 2024-03-20 چهارشنبه.
      expect(weekdayName(2026, 8, 4)).toBe('سه‌شنبه');
      expect(weekdayName(2024, 3, 20)).toBe('چهارشنبه');
    });
  });

  describe('toPersianDigits', () => {
    it('converts ascii digits and leaves other characters untouched', () => {
      expect(toPersianDigits('1404/05/13')).toBe('۱۴۰۴/۰۵/۱۳');
      expect(toPersianDigits('no digits')).toBe('no digits');
    });
  });

  describe('parseDateParts', () => {
    it('accepts the common separators', () => {
      expect(parseDateParts('1404/05/13')).toEqual([1404, 5, 13]);
      expect(parseDateParts('1404-05-13')).toEqual([1404, 5, 13]);
      expect(parseDateParts('1404.05.13')).toEqual([1404, 5, 13]);
      expect(parseDateParts('1404 05 13')).toEqual([1404, 5, 13]);
    });

    it('accepts persian and arabic digits', () => {
      expect(parseDateParts('۱۴۰۴/۰۵/۱۳')).toEqual([1404, 5, 13]);
      expect(parseDateParts('١٤٠٤/٠٥/١٣')).toEqual([1404, 5, 13]);
    });

    it('tolerates surrounding whitespace', () => {
      expect(parseDateParts('  1404/5/13  ')).toEqual([1404, 5, 13]);
    });

    it('rejects input that is not three numbers', () => {
      expect(parseDateParts('')).toBeNull();
      expect(parseDateParts('1404/05')).toBeNull();
      expect(parseDateParts('1404/05/13/22')).toBeNull();
      expect(parseDateParts('hello')).toBeNull();
    });
  });
});
