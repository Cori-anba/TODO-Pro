<script setup>
import { useReminder } from '@/composables/useReminder'
import { X, Bell, AlertTriangle } from 'lucide-vue-next'

const { toasts, dismissToast } = useReminder()
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-6 right-6 z-50 flex flex-col gap-3 w-80 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-card shadow-modal border transition-all duration-200"
          :class="toast.overdue
            ? 'bg-[#fff3f3] border-[#ffc9c9] text-[#e03131]'
            : 'bg-white border-border text-text-primary'"
        >
          <component
            :is="toast.overdue ? AlertTriangle : Bell"
            :size="18"
            class="mt-0.5 flex-shrink-0"
            :class="toast.overdue ? 'text-[#e03131]' : 'text-[#f08c00]'"
          />
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-semibold leading-tight truncate">{{ toast.title }}</p>
            <p class="text-[11px] mt-0.5 opacity-70">
              {{ toast.overdue ? `已过期 · ${toast.time}` : `即将到期 · ${toast.time}` }}
            </p>
          </div>
          <button
            @click="dismissToast(toast.id)"
            class="flex-shrink-0 p-0.5 rounded-md hover:bg-black/5 transition-colors"
          >
            <X :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
