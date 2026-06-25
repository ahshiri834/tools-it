<script setup lang="ts">
import { toolSeoData } from '@/data/tool-seo-data';

const props = defineProps<{ toolPath: string }>();

const seo = computed(() => toolSeoData[props.toolPath]);
</script>

<template>
  <div v-if="seo" class="seo-section">
    <div class="seo-intro">
      <h2>{{ seo.intro.title }}</h2>
      <p>{{ seo.intro.text }}</p>
    </div>

    <div v-if="seo.useCases?.length" class="seo-usecases">
      <h2>کاربردهای رایج</h2>
      <ul>
        <li v-for="(item, i) in seo.useCases" :key="i">{{ item }}</li>
      </ul>
    </div>

    <div class="seo-faq">
      <h2>سوالات متداول</h2>
      <div v-for="(item, i) in seo.faq" :key="i" class="faq-item">
        <h3>{{ item.q }}</h3>
        <p>{{ item.a }}</p>
      </div>
    </div>

    <div class="seo-guide">
      <h2>راهنمای استفاده</h2>
      <p>{{ seo.guide }}</p>
    </div>
  </div>
</template>

<style scoped>
.seo-section {
  max-width: 860px;
  margin: 60px auto 40px;
  padding: 0 24px;
  direction: rtl;
  font-family: 'Vazirmatn', sans-serif;
}

.seo-intro,
.seo-usecases,
.seo-faq,
.seo-guide {
  margin-bottom: 40px;
}

.seo-usecases ul {
  margin: 0;
  padding-right: 20px;
}

.seo-usecases li {
  font-size: 15px;
  line-height: 1.9;
  opacity: 0.85;
  margin-bottom: 6px;
}

h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  border-right: 4px solid #18a058;
  padding-right: 12px;
}

h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 6px;
}

p {
  font-size: 15px;
  line-height: 1.9;
  opacity: 0.85;
}

.faq-item {
  border-bottom: 1px solid rgba(128,128,128,0.15);
  padding-bottom: 12px;
}
</style>
