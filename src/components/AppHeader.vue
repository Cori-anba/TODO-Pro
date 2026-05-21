<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import { Search, Plus, Sun, Moon, Menu } from 'lucide-vue-next'

const store = useTodoStore()
const toggleSidebar = inject('toggleSidebar')
const showForm = ref(false)
const newTitle = ref('')
const newPriority = ref('mid')
const newReminder = ref('')
const searchInput = ref(null)

const priorities = [
  { value: 'high', label: '高' },
  { value: 'mid', label: '中' },
  { value: 'low', label: '低' },
]

function handleAdd() {
  const title = newTitle.value.trim()
  if (!title) return
  store.addTask({
    title,
    priority: newPriority.value,
    reminder: newReminder.value || null,
  })
  newTitle.value = ''
  newReminder.value = ''
  newPriority.value = 'mid'
  showForm.value = false
}

function onKeydown(e) {
  if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
    e.preventDefault()
    searchInput.value?.focus()
  }
  if (e.ctrlKey && e.key === 'n') {
    e.preventDefault()
    showForm.value = !showForm.value
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="bg-card border-b border-border transition-colors duration-300 flex-shrink-0">
    <!-- 第一行：Logo + 操作 -->
    <div class="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 max-w-[1200px] mx-auto">
      <!-- 移动端汉堡菜单 -->
      <button
        @click="toggleSidebar()"
        class="w-9 h-9 flex items-center justify-center rounded-btn hover:bg-hover-bg transition-colors duration-150 text-text-secondary md:hidden flex-shrink-0"
      >
        <Menu :size="20" />
      </button>

      <!-- Logo -->
      <h1 class="font-display text-[18px] md:text-[22px] italic tracking-tight flex-shrink-0 select-none">
        <span class="bg-[#2c2c2c] dark:bg-[#e8e5e0] text-white dark:text-[#111110] px-[8px] md:px-[10px] py-[3px] rounded-btn text-[14px] md:text-[16px] not-italic transition-colors duration-300">TODO</span>
        <span class="ml-1 text-[#2c2c2c] dark:text-[#e8e5e0] transition-colors duration-300">Pro</span>
      </h1>

      <!-- 搜索框 — 桌面端 -->
      <div class="relative flex-1 max-w-[340px] hidden sm:block">
        <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
        <input
          ref="searchInput"
          v-model="store.searchQuery"
          type="text"
          placeholder="搜索任务..."
          class="w-full pl-9 pr-9 py-2 text-[13px] bg-input-bg border-none rounded-btn outline-none
                 focus:bg-input-bg-focus transition-colors duration-150 placeholder:text-text-tertiary
                 text-text-primary"
        />
        <kbd class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-tertiary font-mono
                   bg-card/50 px-1.5 py-0.5 rounded-[3px] border border-border/50 pointer-events-none">/</kbd>
      </div>

      <!-- 右侧操作 -->
      <div class="flex items-center gap-2 md:gap-3 ml-auto">
        <button
          @click="store.toggleTheme()"
          class="w-9 h-9 flex items-center justify-center rounded-btn hover:bg-hover-bg transition-all duration-150 text-text-secondary"
          title="切换主题"
        >
          <Sun :size="17" class="block dark:hidden" />
          <Moon :size="17" class="hidden dark:block" />
        </button>

        <button
          @click="showForm = !showForm"
          class="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-[#2c2c2c] dark:bg-[#e8e5e0] text-white dark:text-[#111110] rounded-btn text-[12px] md:text-[13px] font-semibold
                 hover:opacity-90 transition-all duration-150 flex-shrink-0"
        >
          <Plus :size="16" />
          <span class="hidden sm:inline">新任务</span>
          <kbd class="hidden lg:inline text-[10px] opacity-60 font-mono">^N</kbd>
        </button>
      </div>
    </div>

    <!-- 移动端搜索 — 单独一行 -->
    <div class="px-4 pb-3 sm:hidden">
      <div class="relative">
        <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
        <input
          v-model="store.searchQuery"
          type="text"
          placeholder="搜索任务..."
          class="w-full pl-9 pr-4 py-2 text-[14px] bg-input-bg border-none rounded-btn outline-none
                 focus:bg-input-bg-focus transition-colors duration-150 placeholder:text-text-tertiary
                 text-text-primary"
        />
      </div>
    </div>

    <!-- 展开的添加表单 -->
    <Transition name="fade">
      <div v-if="showForm" class="px-4 md:px-6 pb-4 max-w-[1200px] mx-auto">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <input
            v-model="newTitle"
            @keydown.enter="handleAdd"
            type="text"
            placeholder="输入任务标题，按 Enter 添加..."
            class="flex-1 min-w-0 px-4 py-2.5 text-[14px] bg-input-bg border border-border rounded-btn
                   outline-none focus:border-[#2c2c2c]/30 focus:bg-card transition-all duration-150 text-text-primary
                   placeholder:text-text-tertiary"
            ref="titleInput"
          />
          <div class="flex items-center gap-2">
            <select
              v-model="newPriority"
              class="flex-1 sm:flex-none px-3 py-2.5 text-[13px] bg-input-bg border border-border rounded-btn outline-none
                     focus:border-[#2c2c2c]/30 cursor-pointer text-text-primary transition-colors duration-150"
            >
              <option v-for="p in priorities" :key="p.value" :value="p.value">
                {{ p.label }}优先级
              </option>
            </select>
            <input
              v-model="newReminder"
              type="datetime-local"
              class="flex-1 sm:flex-none px-3 py-2.5 text-[13px] bg-input-bg border border-border rounded-btn outline-none
                     focus:border-[#2c2c2c]/30 text-text-primary transition-colors duration-150"
            />
          </div>
          <button
            @click="handleAdd"
            :disabled="!newTitle.trim()"
            class="px-5 py-2.5 bg-[#2c2c2c] dark:bg-[#e8e5e0] text-white dark:text-[#111110] rounded-btn text-[13px] font-semibold
                   hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            添加
          </button>
        </div>
      </div>
    </Transition>
  </header>
</template>
