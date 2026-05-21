<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import { Search, Plus, Sun, Moon } from 'lucide-vue-next'

const store = useTodoStore()
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
  <header class="bg-card border-b border-border transition-colors duration-300">
    <div class="flex items-center gap-4 px-6 py-4 max-w-[1200px] mx-auto">
      <!-- Logo -->
      <h1 class="font-display text-[22px] italic tracking-tight flex-shrink-0 select-none">
        <span class="bg-[#2c2c2c] dark:bg-[#e8e5e0] text-white dark:text-[#111110] px-[10px] py-[3px] rounded-btn text-[16px] not-italic transition-colors duration-300">TODO</span>
        <span class="ml-1 text-[#2c2c2c] dark:text-[#e8e5e0] transition-colors duration-300">Pro</span>
      </h1>

      <!-- 搜索框 -->
      <div class="relative flex-1 max-w-[340px]">
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
      <div class="flex items-center gap-3 ml-auto">
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
          class="flex items-center gap-2 px-4 py-2 bg-[#2c2c2c] dark:bg-[#e8e5e0] text-white dark:text-[#111110] rounded-btn text-[13px] font-semibold
                 hover:opacity-90 transition-all duration-150"
        >
          <Plus :size="16" />
          新任务
          <kbd class="hidden sm:inline text-[10px] opacity-60 font-mono">^N</kbd>
        </button>
      </div>
    </div>

    <!-- 展开的添加表单 -->
    <Transition name="fade">
      <div v-if="showForm" class="px-6 pb-4 max-w-[1200px] mx-auto">
        <div class="flex items-center gap-3 flex-wrap">
          <input
            v-model="newTitle"
            @keydown.enter="handleAdd"
            type="text"
            placeholder="输入任务标题，按 Enter 添加..."
            class="flex-1 min-w-[260px] px-4 py-2.5 text-[14px] bg-input-bg border border-border rounded-btn
                   outline-none focus:border-[#2c2c2c]/30 focus:bg-card transition-all duration-150 text-text-primary
                   placeholder:text-text-tertiary"
            ref="titleInput"
          />
          <select
            v-model="newPriority"
            class="px-3 py-2.5 text-[13px] bg-input-bg border border-border rounded-btn outline-none
                   focus:border-[#2c2c2c]/30 cursor-pointer text-text-primary transition-colors duration-150"
          >
            <option v-for="p in priorities" :key="p.value" :value="p.value">
              {{ p.label }}优先级
            </option>
          </select>
          <input
            v-model="newReminder"
            type="datetime-local"
            class="px-3 py-2.5 text-[13px] bg-input-bg border border-border rounded-btn outline-none
                   focus:border-[#2c2c2c]/30 text-text-primary transition-colors duration-150"
          />
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
