<script setup>
import { onMounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import AppHeader from '@/components/AppHeader.vue'
import FilterSidebar from '@/components/FilterSidebar.vue'
import TaskList from '@/components/TaskList.vue'
import ReminderToast from '@/components/ReminderToast.vue'

const store = useTodoStore()

onMounted(() => {
  store.seedDemoData()
})
</script>

<template>
  <div class="h-screen flex flex-col bg-surface dark:bg-[#111110] transition-colors duration-300">
    <AppHeader />

    <div class="flex flex-1 overflow-hidden max-w-[1200px] mx-auto w-full">
      <FilterSidebar />

      <main class="flex-1 overflow-y-auto p-6">
        <div class="max-w-[720px] mx-auto">
          <!-- 当前视图标题 -->
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-[13px] font-semibold text-text-secondary uppercase tracking-wider select-none">
              {{ {
                all: '全部任务',
                active: '进行中',
                completed: '已完成',
                favorites: '已收藏',
                overdue: '已过期',
              }[store.filter] }}
            </h2>
            <span class="text-[11px] font-mono text-[#adb5bd]">
              {{ store.filteredTasks.length }} 项
            </span>
          </div>

          <TaskList />
        </div>
      </main>
    </div>

    <ReminderToast />
  </div>
</template>
