<script setup>
import { ClipboardList } from 'lucide-vue-next'

defineProps({
  message: { type: String, default: '暂无任务' },
  hint: { type: String, default: '' },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div class="w-20 h-20 rounded-full bg-empty-icon-bg flex items-center justify-center mb-6 transition-colors duration-300">
      <ClipboardList :size="32" class="text-empty-icon-color transition-colors duration-300" />
    </div>
    <p class="text-[15px] font-semibold text-text-primary mb-1.5">{{ message }}</p>
    <p v-if="hint" class="text-[13px] text-text-secondary max-w-[260px] leading-relaxed">{{ hint }}</p>
  </div>
</template>
