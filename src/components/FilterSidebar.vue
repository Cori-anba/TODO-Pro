<script setup>
import { useTodoStore } from '@/stores/todoStore'
import { ListTodo, Circle, CheckCircle2, Star, AlertCircle, ArrowDownUp } from 'lucide-vue-next'

const store = useTodoStore()

const filters = [
  { key: 'all', label: '全部任务', icon: ListTodo },
  { key: 'active', label: '进行中', icon: Circle },
  { key: 'completed', label: '已完成', icon: CheckCircle2 },
  { key: 'favorites', label: '已收藏', icon: Star },
  { key: 'overdue', label: '已过期', icon: AlertCircle },
]
</script>

<template>
  <aside class="w-[200px] flex-shrink-0 bg-card border-r border-border flex flex-col h-full transition-colors duration-300">
    <div class="flex-1 p-4">
      <p class="text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 mb-3 select-none">视图</p>
      <nav class="flex flex-col gap-0.5">
        <button
          v-for="f in filters"
          :key="f.key"
          @click="store.filter = f.key"
          class="flex items-center gap-2.5 px-2.5 py-2 rounded-btn text-[13px] transition-all duration-150 w-full text-left"
          :class="store.filter === f.key
            ? 'bg-[#2c2c2c] dark:bg-[#e8e5e0] text-white dark:text-[#111110] font-medium'
            : 'text-text-primary hover:bg-hover-bg'"
        >
          <component :is="f.icon" :size="15" />
          <span class="flex-1">{{ f.label }}</span>
          <span
            class="text-[11px] tabular-nums min-w-[18px] text-center"
            :class="store.filter === f.key ? 'opacity-70' : 'text-text-tertiary'"
          >{{ store.counts[f.key] }}</span>
        </button>
      </nav>

      <p class="text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 mt-6 mb-3 select-none">排序</p>
      <div class="relative">
        <select
          v-model="store.sortBy"
          class="w-full appearance-none pl-2.5 pr-8 py-2 text-[12px] bg-hover-bg border-none rounded-btn
                 outline-none cursor-pointer text-text-primary transition-colors duration-150 hover:brightness-95"
        >
          <option value="created">创建时间</option>
          <option value="priority">优先级</option>
        </select>
        <ArrowDownUp :size="12" class="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
      </div>
    </div>

    <div class="p-4 border-t border-border transition-colors duration-300">
      <p class="text-[10px] text-text-tertiary text-center font-mono select-none">v0.1.0</p>
    </div>
  </aside>
</template>
