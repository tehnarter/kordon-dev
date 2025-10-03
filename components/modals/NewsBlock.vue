
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

// --- Emits ---
const emit = defineEmits<{
  (e: "close"): void
}>()

// --- I18n ---
const {t, locale } = useI18n();

// --- State ---
interface NewsBlock {
  type: "p" | "h2" | "h3" | "ul";
  text?: string;
  items?: string[];
}

interface NewsItem {
  title: string;
  content: NewsBlock[];
}

const news = ref<NewsItem[]>([]);

// --- Runtime config ---
const config = useRuntimeConfig();
const apiKey = config.public.apiKey;
const apiUrl = config.public.apiBase;

// --- Utils ---
function safeParse(content: string): NewsBlock[] {
  try {
    return JSON.parse(content) as NewsBlock[];
  } catch {
    return [];
  }
}

// --- API ---
async function loadNews(lang: string) {
  try {
    const res = await fetch(`${apiUrl}/api/get-news.php?lang=${lang}&api_key=${apiKey}`);
    const data = await res.json();

    if (Array.isArray(data) && data.length) {
      news.value = data.map((item: any) => ({
        title: item.title,
        content: safeParse(item.content)
      }));
    } else if (data?.title) {
      news.value = [{
        title: data.title,
        content: safeParse(data.content)
      }];
    } else {
      news.value = [];
    }
  } catch (err) {
    console.error("Помилка завантаження:", err);
    news.value = [];
  }
}

// --- Modal control ---
function closeNewsModal() {
  emit("close");
}

// --- Lifecycle ---
onMounted(() => {
  document.body.style.overflow = "hidden";
});
onUnmounted(() => {
  document.body.style.overflow = "";
});

// --- Watchers ---
watch(locale, (newLang) => {
  loadNews(newLang);
}, { immediate: true });
</script>


<template>
  <Teleport to="body">
    <div class="news-modal-overlay">
      <button class="close-button" @click="closeNewsModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
             class="bi bi-x-circle" viewBox="0 0 16 16">
          <path
            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path
            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5
               0 0 1 .708.708L8.707 8l2.647 2.646a.5.5
               0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5
               0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5
               0 0 1 0-.708"/>
        </svg>
      </button>

      <div class="news-modal">
        <template v-if="news.length">
          <details class="accordion" v-for="(item, i) in news" :key="i">
            <summary class="accordion-header">{{ item.title }}</summary>
            <div class="accordion-body">
              <template v-for="(block, j) in item.content" :key="j">
                <p v-if="block.type === 'p'" v-html="block.text"></p>
                <h2 v-else-if="block.type === 'h2'" v-html="block.text"></h2>
                <h3 v-else-if="block.type === 'h3'" v-html="block.text"></h3>
                <ul v-else-if="block.type === 'ul'">
                  <li v-for="(li, k) in block.items" :key="k" v-html="li"></li>
                </ul>
              </template>
            </div>
          </details>
        </template>

        <template v-else>
         <p class="no-news">{{ t("modals.news") }}</p>
        </template>
      </div>
    </div>
  </Teleport>
</template>


<style scoped lang="scss">
.news-modal-overlay {
  position: fixed;
  inset: 0;
  top: 96px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
  z-index: 2000;
}

.news-modal {
  position: relative;
  background: var(--themes-bg-modal);
  width: 100%;
  max-width: 900px;
  min-height: 100vh;
  padding: 10px;
  animation: fadeIn 0.3s ease;
  transition: background-color 0.3s ease;
}

.close-button {
  position: fixed;
  top: 60px;
  right: 20px;
  z-index: 2100;
  background: none;
  border: none;
  cursor: pointer;
}

/* Акордеон */
.accordion {
  margin: 10px 5px;
  border: 1px solid #bbbcc9;
  border-radius: 6px;
  overflow: hidden;

  summary {
    padding: 16px;
    font-weight: 700;
    list-style: none;
    font-size: 22px;
    color: #4db6ac;
    cursor: pointer;
  }

  .accordion-body {
    padding: 16px;
    font-size: 18px;
  }
}

.no-news {
  padding: 20px;
  text-align: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
