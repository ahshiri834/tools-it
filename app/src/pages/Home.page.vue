<script setup lang="ts">
import { IconDragDrop, IconHeart } from '@tabler/icons-vue';
import { useHead } from '@vueuse/head';
import { computed } from 'vue';
import Draggable from 'vuedraggable';
import ColoredCard from '../components/ColoredCard.vue';
import ToolCard from '../components/ToolCard.vue';
import { useToolStore } from '@/tools/tools.store';
import { config } from '@/config';
import { siteConfig } from '@/seo.config';

const toolStore = useToolStore();

// پرسش‌های متداول سطح سایت (برای سئو و نمایش ریچ گوگل)
const homeFaq = [
  {
    q: 'IT Tools چیست و چه کاربردی دارد؟',
    a: 'IT Tools مجموعه‌ای از ابزارهای آنلاین رایگان برای توسعه‌دهندگان، برنامه‌نویسان و متخصصان فناوری اطلاعات است؛ از تبدیل فرمت‌های داده مثل JSON و YAML گرفته تا تولید UUID، هش، رمزگذاری، QR کد و ده‌ها ابزار پرکاربرد دیگر.',
  },
  {
    q: 'آیا استفاده از این ابزارها رایگان است؟',
    a: 'بله، تمام ابزارها کاملاً رایگان هستند و نیازی به ثبت‌نام یا نصب نرم‌افزار ندارند.',
  },
  {
    q: 'آیا داده‌های من به سرور ارسال می‌شود؟',
    a: 'خیر، اکثر ابزارها کاملاً سمت کلاینت (در مرورگر شما) اجرا می‌شوند و هیچ داده‌ای به سرور ارسال نمی‌شود؛ بنابراین حریم خصوصی شما حفظ می‌شود.',
  },
  {
    q: 'آیا این ابزارها روی موبایل هم کار می‌کنند؟',
    a: 'بله، رابط کاربری به‌صورت کاملاً واکنش‌گرا (Responsive) طراحی شده و روی موبایل، تبلت و دسکتاپ به‌خوبی کار می‌کند.',
  },
];

useHead({
  title: siteConfig.homeTitle,
  link: [{ rel: 'canonical', href: `${siteConfig.domain}/` }],
  meta: [
    { name: 'description', content: siteConfig.homeDescription },
    { name: 'keywords', content: 'ابزار آنلاین برنامه نویسی، ابزار توسعه دهندگان، تبدیل json، تولید uuid، هش آنلاین، base64، رمزگذاری آنلاین، qr code، regex، ابزار it' },
    { property: 'og:title', content: siteConfig.homeTitle },
    { property: 'og:description', content: siteConfig.homeDescription },
    { property: 'og:url', content: `${siteConfig.domain}/` },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': siteConfig.brand,
        'url': siteConfig.domain,
        'inLanguage': 'fa-IR',
        'description': siteConfig.homeDescription,
      }),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': homeFaq.map(item => ({
          '@type': 'Question',
          'name': item.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': item.a },
        })),
      }),
    },
  ],
});
const { t } = useI18n();

const favoriteTools = computed(() => toolStore.favoriteTools);

// Update favorite tools order when drag is finished
function onUpdateFavoriteTools() {
  toolStore.updateFavoriteTools(favoriteTools.value); // Update the store with the new order
}
</script>

<template>
  <div class="pt-50px">
    <div class="grid-wrapper">
      <div class="home-hero">
        <h1 class="home-hero__title">
          مجموعه ابزارهای آنلاین رایگان برای توسعه‌دهندگان و متخصصان IT
        </h1>
        <p class="home-hero__subtitle">
          بیش از ۸۰ ابزار کاربردی برای برنامه‌نویسی، شبکه و فناوری اطلاعات — تبدیل
          <strong>JSON</strong> و <strong>YAML</strong>، تولید <strong>UUID</strong> و
          <strong>هش</strong>، <strong>رمزگذاری</strong>، <strong>QR کد</strong>،
          <strong>Base64</strong>، <strong>Regex</strong> و بسیاری دیگر. همگی رایگان، سریع و
          بدون نیاز به نصب.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
        <ColoredCard v-if="config.showBanner" :title="$t('home.follow.title')" :icon="IconHeart">
          {{ $t('home.follow.p1') }}
          <a
            href="https://github.com/CorentinTh/it-tools"
            rel="noopener"
            target="_blank"
            :aria-label="$t('home.follow.githubRepository')"
          >GitHub</a>
          {{ $t('home.follow.p2') }}
          <a
            href="https://x.com/ittoolsdottech"
            rel="noopener"
            target="_blank"
            :aria-label="$t('home.follow.twitterXAccount')"
          >X</a>.
          {{ $t('home.follow.thankYou') }}
          <n-icon :component="IconHeart" />
        </ColoredCard>
      </div>

      <transition name="height">
        <div v-if="toolStore.favoriteTools.length > 0">
          <h3 class="mb-5px mt-25px text-neutral-400 font-500">
            {{ $t('home.categories.favoriteTools') }}
            <c-tooltip :tooltip="$t('home.categories.favoritesDndToolTip')">
              <n-icon :component="IconDragDrop" size="18" />
            </c-tooltip>
          </h3>
          <Draggable
            :list="favoriteTools"
            class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4"
            ghost-class="ghost-favorites-draggable"
            item-key="name"
            @end="onUpdateFavoriteTools"
          >
            <template #item="{ element: tool }">
              <ToolCard :tool="tool" />
            </template>
          </Draggable>
        </div>
      </transition>

      <div v-if="toolStore.newTools.length > 0">
        <h3 class="mb-5px mt-25px text-neutral-400 font-500">
          {{ t('home.categories.newestTools') }}
        </h3>
        <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
          <ToolCard v-for="tool in toolStore.newTools" :key="tool.name" :tool="tool" />
        </div>
      </div>

      <h3 class="mb-5px mt-25px text-neutral-400 font-500">
        {{ $t('home.categories.allTools') }}
      </h3>
      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
        <ToolCard v-for="tool in toolStore.tools" :key="tool.name" :tool="tool" />
      </div>

      <section class="home-seo">
        <h2>ابزارهای آنلاین برنامه‌نویسی و IT در یک مجموعه کامل</h2>
        <p>
          <strong>IT Tools</strong> یک مجموعه‌ی کامل و رایگان از ابزارهای آنلاین برای
          توسعه‌دهندگان، برنامه‌نویسان، مدیران شبکه و متخصصان فناوری اطلاعات است. به جای جستجوی
          ابزارهای پراکنده در سراسر وب، همه‌ی ابزارهای پرکاربرد را یک‌جا در اختیار دارید: از
          تبدیل فرمت‌های داده مانند <strong>JSON به YAML</strong>، <strong>XML به JSON</strong> و
          <strong>TOML</strong>، تا تولید <strong>UUID</strong>، <strong>توکن تصادفی</strong> و
          انواع <strong>هش (MD5، SHA256، Bcrypt)</strong>.
        </p>

        <h2>چرا از ابزارهای آنلاین IT Tools استفاده کنیم؟</h2>
        <p>
          همه‌ی ابزارها <strong>رایگان</strong> و <strong>بدون نیاز به ثبت‌نام</strong> هستند و
          بیشتر آن‌ها کاملاً در مرورگر شما اجرا می‌شوند؛ یعنی داده‌های حساس شما هرگز به سرور ارسال
          نمی‌شود و حریم خصوصی‌تان حفظ می‌گردد. رابط کاربری ساده، سریع و واکنش‌گرا است و روی
          موبایل و دسکتاپ به‌خوبی کار می‌کند.
        </p>

        <h2>دسته‌بندی ابزارها</h2>
        <p>
          ابزارها در دسته‌های <strong>رمزنگاری (Crypto)</strong>،
          <strong>تبدیل‌گر (Converter)</strong>، <strong>وب (Web)</strong>،
          <strong>شبکه (Network)</strong>، <strong>توسعه (Development)</strong>،
          <strong>متن (Text)</strong>، <strong>ریاضی</strong> و
          <strong>تصویر و ویدیو</strong> سازمان‌دهی شده‌اند تا به‌سرعت ابزار مورد نیاز خود را پیدا کنید.
        </p>

        <h2>سوالات متداول</h2>
        <div v-for="(item, i) in homeFaq" :key="i" class="home-seo__faq-item">
          <h3>{{ item.q }}</h3>
          <p>{{ item.a }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="less">
.home-hero {
  text-align: center;
  max-width: 820px;
  margin: 0 auto 10px;
  padding: 0 16px;

  &__title {
    font-size: 26px;
    font-weight: 700;
    line-height: 1.6;
    margin: 0 0 12px;
  }

  &__subtitle {
    font-size: 15px;
    line-height: 1.9;
    opacity: 0.75;
    margin: 0;
  }
}

.home-seo {
  max-width: 900px;
  margin: 60px auto 20px;
  padding: 0 16px;
  line-height: 1.9;

  h2 {
    font-size: 21px;
    font-weight: 700;
    margin: 32px 0 10px;
    border-right: 4px solid #18a058;
    padding-right: 12px;
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 18px 0 6px;
  }

  p {
    font-size: 15px;
    opacity: 0.82;
    margin: 0 0 8px;
  }

  &__faq-item {
    border-bottom: 1px solid rgba(128, 128, 128, 0.15);
    padding-bottom: 10px;
    margin-bottom: 6px;
  }
}

.height-enter-active,
.height-leave-active {
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  max-height: 500px;
}

.height-enter-from,
.height-leave-to {
  max-height: 42px;
  overflow: hidden;
  opacity: 0;
  margin-bottom: 0;
}

.ghost-favorites-draggable {
  opacity: 0.4;
  background-color: #ccc;
  border: 2px dashed #666;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
  animation: ghost-favorites-draggable-animation 0.2s ease-out;
}

@keyframes ghost-favorites-draggable-animation {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 0.4;
    transform: scale(1.0);
  }
}
</style>
