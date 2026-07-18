<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { pageUrl } from '@/seo.config';

// canonical صفحه‌ی درباره؛ بدون این، og:url/canonical از قالب اصلی به صفحه‌ی خانه اشاره می‌کرد.
const canonical = pageUrl('/about');

useHead({
  title: 'About - IT Tools',
  link: [{ rel: 'canonical', href: canonical }],
  meta: [{ property: 'og:url', content: canonical }],
});
</script>

<template>
  <c-markdown :markdown="$t('about.content')" mx-auto mt-50px max-w-600px />
</template>
