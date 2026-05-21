<script setup>
defineProps({
  count: { type: Number, default: 5 },
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-for="i in count" :key="i" class="flex items-center gap-3 px-4 py-3 bg-card rounded-card border border-border">
      <div class="skeleton w-[18px] h-[18px] rounded-[5px] flex-shrink-0" />
      <div class="flex-1 space-y-2">
        <div class="skeleton h-4 rounded-btn" :style="{ width: `${60 + Math.random() * 30}%` }" />
        <div class="skeleton h-3 rounded-btn w-24" />
      </div>
      <div class="flex items-center gap-2">
        <div class="skeleton h-5 w-10 rounded-tag" />
        <div class="skeleton h-3 w-16 rounded-btn" />
      </div>
    </div>
  </div>
</template>
