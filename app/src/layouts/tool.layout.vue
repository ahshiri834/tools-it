<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';
import type { HeadObject } from '@vueuse/head';

import BaseLayout from './base.layout.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';
import ToolSeoContent from '@/components/ToolSeoContent.vue';
import type { Tool } from '@/tools/tools.types';
import { toolSeoData } from '@/data/tool-seo-data';
import { pageUrl, siteConfig } from '@/seo.config';

const route = useRoute();
const { t } = useI18n();

const i18nKey = computed<string>(() => route.path.trim().replace('/', ''));
const toolTitle = computed<string>(() => t(`tools.${i18nKey.value}.title`, String(route.meta.name)));
const toolDescription = computed<string>(() => t(`tools.${i18nKey.value}.description`, String(route.meta.description)));

const seo = computed(() => toolSeoData[i18nKey.value]);
const canonical = computed<string>(() => pageUrl(route.path));

// عنوان سئو: اگر metaTitle اختصاصی تعریف شده باشد از آن، در غیر این صورت ساختار استاندارد
const metaTitle = computed<string>(() => seo.value?.metaTitle ?? `${toolTitle.value} | ${siteConfig.brand}`);
// توضیح متا: متن مقدمه سئو (کیوردمحور) و در نبود آن، توضیح کوتاه ابزار
const metaDescription = computed<string>(() => seo.value?.metaDescription ?? seo.value?.intro?.text ?? toolDescription.value);

// Structured Data: FAQPage برای نمایش در نتایج ریچ گوگل
const faqJsonLd = computed<string | null>(() => {
  if (!seo.value?.faq?.length) {
    return null;
  }
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': seo.value.faq.map(item => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': { '@type': 'Answer', 'text': item.a },
    })),
  });
});

// Structured Data: معرفی هر ابزار به عنوان یک WebApplication رایگان + مسیر breadcrumb
const appJsonLd = computed<string>(() => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  'name': metaTitle.value,
  'description': metaDescription.value,
  'url': canonical.value,
  'applicationCategory': 'DeveloperApplication',
  'operatingSystem': 'Any',
  'inLanguage': 'fa-IR',
  'isAccessibleForFree': true,
  'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'IRR' },
  'publisher': { '@type': 'Organization', 'name': siteConfig.brand, 'url': siteConfig.domain },
}));

const breadcrumbJsonLd = computed<string>(() => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', 'position': 1, 'name': 'خانه', 'item': siteConfig.domain },
    { '@type': 'ListItem', 'position': 2, 'name': toolTitle.value, 'item': canonical.value },
  ],
}));

const head = computed<HeadObject>(() => ({
  title: metaTitle.value,
  link: [{ rel: 'canonical', href: canonical.value }],
  meta: [
    { name: 'description', content: metaDescription.value },
    { name: 'keywords', content: ((route.meta.keywords ?? []) as string[]).join('، ') },
    { property: 'og:title', content: metaTitle.value },
    { property: 'og:description', content: metaDescription.value },
    { property: 'og:url', content: canonical.value },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:title', content: metaTitle.value },
    { name: 'twitter:description', content: metaDescription.value },
  ],
  script: [
    ...(faqJsonLd.value ? [{ type: 'application/ld+json', children: faqJsonLd.value }] : []),
    { type: 'application/ld+json', children: appJsonLd.value },
    { type: 'application/ld+json', children: breadcrumbJsonLd.value },
  ],
}));
useHead(head);
</script>

<template>
  <BaseLayout>
    <div class="tool-layout">
      <div class="tool-header">
        <div flex flex-nowrap items-center justify-between>
          <n-h1>
            {{ toolTitle }}
          </n-h1>

          <div>
            <FavoriteButton :tool="{ name: route.meta.name, path: route.path } as Tool" />
          </div>
        </div>

        <div class="separator" />

        <div class="description">
          {{ toolDescription }}
        </div>
      </div>
    </div>

    <div class="tool-content">
      <slot />
    </div>

    <ToolSeoContent :tool-path="i18nKey" />
  </BaseLayout>
</template>

<style lang="less" scoped>
.tool-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;

  ::v-deep(& > *) {
    flex: 0 1 600px;
  }
}

.tool-layout {
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;

  .tool-header {
    padding: 40px 0;
    width: 100%;

    .n-h1 {
      opacity: 0.9;
      font-size: 40px;
      font-weight: 400;
      margin: 0;
      line-height: 1;
    }

    .separator {
      width: 200px;
      height: 2px;
      background: rgb(161, 161, 161);
      opacity: 0.2;

      margin: 10px 0;
    }

    .description {
      margin: 0;

      opacity: 0.7;
    }
  }
}
</style>
