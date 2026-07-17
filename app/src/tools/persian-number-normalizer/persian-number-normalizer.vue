<script setup lang="ts">
import {
  autoConvertDigitsToEN,
  digitsEnToFa,
  normalizeText,
  toPersianChars,
} from '@persian-tools/persian-tools';
import InputCopyable from '../../components/InputCopyable.vue';

const input = ref('قیمت: ۱۲٬۳۴۵ تومان — كد ملی ۰۰۱۲۳۴۵۶۷۸');

function safe(fn: (value: string) => string, value: string) {
  if (!value) {
    return '';
  }
  try {
    return fn(value);
  }
  catch {
    return '';
  }
}

const outputs = computed(() => [
  {
    label: 'فارسی/عربی → انگلیسی:',
    value: safe(autoConvertDigitsToEN, input.value),
  },
  {
    label: 'انگلیسی → فارسی:',
    value: safe(digitsEnToFa, input.value),
  },
  {
    label: 'عربی → فارسی (ی/ک):',
    value: safe(toPersianChars, input.value),
  },
  {
    label: 'نرمال‌سازی کامل:',
    value: safe(normalizeText, input.value),
  },
]);

const labelConfig = {
  labelPosition: 'left',
  labelWidth: '170px',
  labelAlign: 'right',
};
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="input"
      label="متن ورودی:"
      placeholder="متن یا عددی که ارقام فارسی/عربی دارد را وارد کنید…"
      multiline
      autosize
      raw-text
      v-bind="labelConfig"
    />

    <div my-16px divider />

    <InputCopyable
      v-for="output in outputs"
      :key="output.label"
      :value="output.value"
      :label="output.label"
      v-bind="labelConfig"
      mb-2
    />
  </c-card>
</template>
