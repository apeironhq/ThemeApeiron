<script setup lang="ts">
import { MessageCircle, Plus, Send } from 'lucide-vue-next'
import { motion } from 'motion-v'
import { faq } from '~/data/content'
import { site } from '~/data/site'

const openIndex = ref<number | null>(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section id="faq" class="scroll-mt-20 py-[clamp(80px,12vw,140px)]">
    <div class="container-ap">
      <SectionHeading eyebrow="FAQ" title="Pertanyaan yang sering muncul." align="center" />

      <div class="mx-auto mt-14 max-w-[820px] space-y-3">
        <div
          v-for="(item, index) in faq"
          :key="item.q"
          class="rounded-[22px] border bg-surface transition-colors duration-300"
          :class="openIndex === index ? 'border-accent/40' : 'border-line'"
        >
          <h3>
            <button
              type="button"
              class="flex w-full items-center gap-4 px-6 py-5 text-left"
              :aria-expanded="openIndex === index"
              :aria-controls="`faq-panel-${index}`"
              @click="toggle(index)"
            >
              <motion.span
                class="grid size-8 shrink-0 place-items-center rounded-full"
                :class="openIndex === index ? 'bg-accent text-accent-ink' : 'bg-soft text-accent'"
                :animate="{ rotate: openIndex === index ? 45 : 0 }"
                :transition="{ type: 'spring', stiffness: 380, damping: 24 }"
              >
                <Plus class="size-4" aria-hidden="true" />
              </motion.span>
              <span class="flex-1 text-base font-medium sm:text-[17px]">{{ item.q }}</span>
            </button>
          </h3>

          <motion.div
            :id="`faq-panel-${index}`"
            class="overflow-hidden"
            :initial="false"
            :animate="openIndex === index ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }"
            :transition="{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }"
          >
            <p class="pb-6 pl-[72px] pr-6 text-[15px] leading-relaxed text-muted">{{ item.a }}</p>
          </motion.div>
        </div>
      </div>

      <div class="mx-auto mt-8 flex max-w-[820px] flex-col gap-4 rounded-[22px] border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-[15px] text-muted">
          <b class="block text-base font-medium text-ink">Masih ada pertanyaan?</b>
          Admin siap membantu lewat WhatsApp atau Telegram.
        </p>
        <div class="flex flex-wrap gap-2">
          <a :href="site.whatsappUrl" target="_blank" rel="noopener" class="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-ink">
            <MessageCircle class="size-4" aria-hidden="true" /> WhatsApp
          </a>
          <a :href="site.telegramUrl" target="_blank" rel="noopener" class="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-medium hover:bg-soft">
            <Send class="size-4" aria-hidden="true" /> Telegram
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
