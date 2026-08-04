<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import {
  GREGORIAN_MONTH_NAMES,
  JALALI_MONTH_NAMES,
  gregorianToJalali,
  isValidGregorianDate,
  isValidJalaliDate,
  jalaliToGregorian,
  pad2,
  parseDateParts,
  toPersianDigits,
  weekdayName,
} from './jalali-date-converter.service';

interface ConversionResult {
  error?: string
  rows?: { label: string; value: string }[]
}

const now = new Date();
const today = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());

const jalaliInput = ref(`${today.jy}/${pad2(today.jm)}/${pad2(today.jd)}`);
const gregorianInput = ref(`${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`);

// شمسی → میلادی
const jalaliToGregorianResult = computed<ConversionResult>(() => {
  const parts = parseDateParts(jalaliInput.value);
  if (!parts) {
    return { error: 'تاریخ شمسی را به شکل ۱۴۰۴/۰۵/۱۳ وارد کنید.' };
  }

  const [jy, jm, jd] = parts;
  if (!isValidJalaliDate(jy, jm, jd)) {
    return { error: 'این تاریخ شمسی معتبر نیست. ماه باید ۱ تا ۱۲ و روز در بازه‌ی همان ماه باشد.' };
  }

  const { gy, gm, gd } = jalaliToGregorian(jy, jm, jd);

  return {
    rows: [
      { label: 'میلادی:', value: `${gy}-${pad2(gm)}-${pad2(gd)}` },
      { label: 'با نام ماه:', value: `${gd} ${GREGORIAN_MONTH_NAMES[gm - 1]} ${gy}` },
      { label: 'شمسی با حروف:', value: `${jd} ${JALALI_MONTH_NAMES[jm - 1]} ${jy}` },
      { label: 'روز هفته:', value: weekdayName(gy, gm, gd) },
      { label: 'شمسی با ارقام فارسی:', value: toPersianDigits(`${jy}/${pad2(jm)}/${pad2(jd)}`) },
      { label: 'فرمت ISO:', value: `${gy}-${pad2(gm)}-${pad2(gd)}T00:00:00` },
    ],
  };
});

// میلادی → شمسی
const gregorianToJalaliResult = computed<ConversionResult>(() => {
  const parts = parseDateParts(gregorianInput.value);
  if (!parts) {
    return { error: 'تاریخ میلادی را به شکل 2026-08-04 وارد کنید.' };
  }

  const [gy, gm, gd] = parts;
  if (!isValidGregorianDate(gy, gm, gd)) {
    return { error: 'این تاریخ میلادی معتبر نیست. ماه باید ۱ تا ۱۲ و روز در بازه‌ی همان ماه باشد.' };
  }

  // سال‌های میلادی خارج از محدوده‌ی جلالی پشتیبانی‌شده خطا می‌دهند.
  let jalali;
  try {
    jalali = gregorianToJalali(gy, gm, gd);
  }
  catch {
    return { error: 'این تاریخ خارج از محدوده‌ی پشتیبانی‌شده‌ی تقویم جلالی است.' };
  }
  const { jy, jm, jd } = jalali;

  return {
    rows: [
      { label: 'شمسی:', value: `${jy}/${pad2(jm)}/${pad2(jd)}` },
      { label: 'با نام ماه:', value: `${jd} ${JALALI_MONTH_NAMES[jm - 1]} ${jy}` },
      { label: 'میلادی با حروف:', value: `${gd} ${GREGORIAN_MONTH_NAMES[gm - 1]} ${gy}` },
      { label: 'روز هفته:', value: weekdayName(gy, gm, gd) },
      { label: 'شمسی با ارقام فارسی:', value: toPersianDigits(`${jy}/${pad2(jm)}/${pad2(jd)}`) },
    ],
  };
});

function setToday() {
  const d = new Date();
  const j = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  jalaliInput.value = `${j.jy}/${pad2(j.jm)}/${pad2(j.jd)}`;
  gregorianInput.value = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

const labelConfig = {
  labelPosition: 'left',
  labelWidth: '150px',
  labelAlign: 'right',
} as const;
</script>

<template>
  <div>
    <div mb-3 flex justify-center>
      <c-button @click="setToday()">
        امروز
      </c-button>
    </div>

    <c-card title="تبدیل تاریخ شمسی به میلادی" mb-3>
      <c-input-text
        v-model:value="jalaliInput"
        label="تاریخ شمسی:"
        placeholder="۱۴۰۴/۰۵/۱۳"
        raw-text
        v-bind="labelConfig"
        mb-2
      />

      <div my-16px divider />

      <c-alert v-if="jalaliToGregorianResult.error" type="warning">
        {{ jalaliToGregorianResult.error }}
      </c-alert>

      <template v-else>
        <InputCopyable
          v-for="row in jalaliToGregorianResult.rows"
          :key="row.label"
          :value="row.value"
          :label="row.label"
          v-bind="labelConfig"
          mb-2
        />
      </template>
    </c-card>

    <c-card title="تبدیل تاریخ میلادی به شمسی">
      <c-input-text
        v-model:value="gregorianInput"
        label="تاریخ میلادی:"
        placeholder="2026-08-04"
        raw-text
        v-bind="labelConfig"
        mb-2
      />

      <div my-16px divider />

      <c-alert v-if="gregorianToJalaliResult.error" type="warning">
        {{ gregorianToJalaliResult.error }}
      </c-alert>

      <template v-else>
        <InputCopyable
          v-for="row in gregorianToJalaliResult.rows"
          :key="row.label"
          :value="row.value"
          :label="row.label"
          v-bind="labelConfig"
          mb-2
        />
      </template>
    </c-card>
  </div>
</template>
