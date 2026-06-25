<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { NGlobalStyle, NMessageProvider, NNotificationProvider, darkTheme } from 'naive-ui';
import { darkThemeOverrides, lightThemeOverrides } from './themes';
import { layouts } from './layouts';
import { useStyleStore } from './stores/style.store';

const route = useRoute();
const layout = computed(() => route?.meta?.layout ?? layouts.base);
const styleStore = useStyleStore();

const theme = computed(() => (styleStore.isDarkTheme ? darkTheme : null));
const themeOverrides = computed(() => (styleStore.isDarkTheme ? darkThemeOverrides : lightThemeOverrides));

const { locale } = useI18n();

syncRef(
  locale,
  useStorage('locale', locale),
);
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <NGlobalStyle />
    <NMessageProvider placement="bottom">
      <NNotificationProvider placement="bottom-right">
        <component :is="layout">
          <RouterView />
        </component>
      </NNotificationProvider>
    </NMessageProvider>
  </n-config-provider>
</template>

<style>
body {
  min-height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Vazirmatn', system-ui, sans-serif;
  direction: rtl;
}

html {
  height: 100%;
  margin: 0;
  padding: 0;
  direction: rtl;
}

* {
  box-sizing: border-box;
}

/* RTL overrides */
.n-layout-sider {
  right: 0 !important;
  left: auto !important;
}

input, textarea, select {
  direction: ltr;
  text-align: left;
}

/* Code/mono elements stay LTR */
code, pre, .monospace, [class*="code"], [class*="mono"] {
  direction: ltr;
  text-align: left;
  font-family: 'Courier New', monospace;
}
</style>
