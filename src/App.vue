<script setup>
import { ref, onMounted, provide } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import AppHeader from '@/components/AppHeader.vue'
import FilterSidebar from '@/components/FilterSidebar.vue'
import TaskList from '@/components/TaskList.vue'
import ReminderToast from '@/components/ReminderToast.vue'

const store = useTodoStore()
const isSidebarOpen = ref(false)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

provide('toggleSidebar', toggleSidebar)
provide('isSidebarOpen', isSidebarOpen)

onMounted(() => {
  store.seedDemoData()
})
</script>

<template>
  <div class="h-[100dvh] flex flex-col bg-surface transition-colors duration-300 overflow-hidden">
    <AppHeader />

    <div class="flex flex-1 overflow-hidden max-w-[1200px] mx-auto w-full relative">
      <!-- 移动端遮罩 -->
      <Transition name="fade">
        <div
          v-if="isSidebarOpen"
          class="fixed inset-0 bg-black/30 z-30 md:hidden"
          @click="closeSidebar"
        />
      </Transition>

      <!-- 侧边栏 — 桌面端常驻，移动端抽屉 -->
      <FilterSidebar :class="{ 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }" />

      <!-- 主内容区 -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6" @click="closeSidebar">
        <div class="max-w-[720px] mx-auto">
          <div class="flex items-center justify-between mb-4 md:mb-5">
            <h2 class="text-[12px] md:text-[13px] font-semibold text-text-secondary uppercase tracking-wider select-none">
              {{
                {
                  all: '全部任务',
                  active: '进行中',
                  completed: '已完成',
                  favorites: '已收藏',
                  overdue: '已过期',
                }[store.filter]
              }}
            </h2>
            <span class="text-[10px] md:text-[11px] font-mono text-text-tertiary">
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
