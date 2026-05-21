<script setup>
import { ref, nextTick } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import { Star, Pencil, Trash2, Clock, BellOff } from 'lucide-vue-next'
import dayjs from 'dayjs'

const props = defineProps({
  task: { type: Object, required: true },
})

const store = useTodoStore()
const isEditing = ref(false)
const editTitle = ref('')
const editInput = ref(null)
const showReminderPicker = ref(false)
const reminderValue = ref('')

const priorityMap = {
  high: { label: '高', class: 'bg-tag-high-bg text-tag-high-text' },
  mid: { label: '中', class: 'bg-tag-mid-bg text-tag-mid-text' },
  low: { label: '低', class: 'bg-tag-low-bg text-tag-low-text' },
}

const isOverdue = () => {
  if (props.task.completed) return false
  if (!props.task.reminder) return false
  return dayjs(props.task.reminder).isBefore(dayjs())
}

function startEdit() {
  editTitle.value = props.task.title
  isEditing.value = true
  nextTick(() => editInput.value?.focus())
}

function finishEdit() {
  const trimmed = editTitle.value.trim()
  if (trimmed && trimmed !== props.task.title) {
    store.updateTask(props.task.id, { title: trimmed })
  }
  isEditing.value = false
}

function onEditKeydown(e) {
  if (e.key === 'Enter') finishEdit()
  if (e.key === 'Escape') {
    editTitle.value = props.task.title
    isEditing.value = false
  }
}

function handleSetReminder() {
  if (reminderValue.value) {
    store.setReminder(props.task.id, new Date(reminderValue.value).toISOString())
  }
  showReminderPicker.value = false
  reminderValue.value = ''
}

function clearReminder() {
  store.setReminder(props.task.id, null)
  showReminderPicker.value = false
}

function toggleReminderPicker() {
  showReminderPicker.value = !showReminderPicker.value
  if (showReminderPicker.value) {
    reminderValue.value = props.task.reminder
      ? dayjs(props.task.reminder).format('YYYY-MM-DDTHH:mm')
      : dayjs().add(1, 'hour').format('YYYY-MM-DDTHH:mm')
  }
}
</script>

<template>
  <div
    class="group flex items-start gap-2.5 md:gap-3 px-3 md:px-4 py-3 bg-card rounded-card border transition-all duration-150"
    :class="{
      'opacity-50': task.completed,
      'border-overdue-border bg-overdue-bg': isOverdue(),
      'border-border shadow-card hover:shadow-card-hover hover:border-border-hover': !isOverdue(),
    }"
  >
    <!-- 复选框 -->
    <button
      @click="store.toggleComplete(task.id)"
      class="w-[20px] h-[20px] md:w-[18px] md:h-[18px] mt-0.5 flex-shrink-0 rounded-[5px] border-2 flex items-center justify-center transition-all duration-150"
      :class="task.completed
        ? 'bg-[#40c057] border-[#40c057] dark:bg-[#51cf66] dark:border-[#51cf66]'
        : 'border-text-tertiary/40 hover:border-text-secondary/60'"
    >
      <svg v-if="task.completed" width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4l2.5 2.5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- 主内容区 -->
    <div class="flex-1 min-w-0">
      <div @dblclick="startEdit">
        <input
          v-if="isEditing"
          ref="editInput"
          v-model="editTitle"
          @blur="finishEdit"
          @keydown="onEditKeydown"
          class="w-full px-2 py-1 -mx-2 text-[14px] border border-[#2c2c2c]/30 rounded-btn outline-none bg-card text-text-primary"
        />
        <span
          v-else
          class="text-[14px] leading-snug cursor-default select-none transition-colors duration-150 break-words"
          :class="task.completed ? 'line-through text-text-tertiary' : 'text-text-primary'"
        >{{ task.title }}</span>
      </div>

      <!-- 元信息行 -->
      <div class="flex items-center gap-2 mt-1.5 flex-wrap">
        <span
          class="text-[10px] font-semibold px-2 py-0.5 rounded-tag leading-none transition-colors duration-300"
          :class="priorityMap[task.priority].class"
        >{{ priorityMap[task.priority].label }}</span>

        <span
          v-if="task.reminder"
          class="text-[11px] font-mono whitespace-nowrap transition-colors duration-150"
          :class="isOverdue() ? 'text-tag-high-text' : 'text-text-secondary'"
        >
          <BellOff v-if="isOverdue()" :size="11" class="inline mr-0.5 -mt-0.5" />
          {{ dayjs(task.reminder).format('MM-DD HH:mm') }}
        </span>

        <span class="text-[11px] text-text-tertiary font-mono whitespace-nowrap">
          {{ dayjs(task.createdAt).format('MM-DD') }}
        </span>
      </div>
    </div>

    <!-- 操作按钮 — 桌面端 hover 可见，移动端始终可见 -->
    <div
      class="flex items-center gap-0.5 flex-shrink-0
             md:opacity-0 md:group-hover:opacity-100 transition-all duration-150"
    >
      <button
        @click="store.toggleFavorite(task.id)"
        class="w-8 h-8 md:w-7 md:h-7 flex items-center justify-center rounded-md transition-all duration-150"
        :class="task.favorite
          ? 'text-[#f08c00]'
          : 'text-text-tertiary/50 hover:text-[#f08c00]'"
        :title="task.favorite ? '取消收藏' : '收藏'"
      >
        <Star :size="16" class="md:w-[15px] md:h-[15px]" :fill="task.favorite ? 'currentColor' : 'none'" />
      </button>

      <!-- 提醒 -->
      <div class="relative">
        <button
          @click="toggleReminderPicker"
          class="w-8 h-8 md:w-7 md:h-7 flex items-center justify-center rounded-md transition-all duration-150"
          :class="task.reminder
            ? 'text-[#f08c00]'
            : 'text-text-tertiary/50 hover:text-text-secondary'"
          title="设置提醒"
        >
          <Clock :size="16" class="md:w-[15px] md:h-[15px]" />
        </button>
        <Transition name="fade">
          <div v-if="showReminderPicker" class="absolute right-0 top-full mt-1 z-20 bg-card rounded-card shadow-modal
                        border border-border p-3 flex items-center gap-2 transition-colors duration-300">
            <input
              v-model="reminderValue"
              type="datetime-local"
              class="w-[160px] px-2 py-1.5 text-[12px] bg-input-bg border border-border rounded-btn outline-none text-text-primary"
              @keydown.enter="handleSetReminder"
            />
            <button
              @click="handleSetReminder"
              class="px-3 py-1.5 text-[11px] font-semibold bg-[#2c2c2c] text-white dark:bg-[#e8e5e0] dark:text-[#111110] rounded-btn hover:opacity-90 transition-opacity whitespace-nowrap"
            >确定</button>
            <button
              v-if="task.reminder"
              @click="clearReminder"
              class="px-2.5 py-1.5 text-[11px] font-semibold text-tag-high-text hover:bg-tag-high-bg rounded-btn transition-colors whitespace-nowrap"
            >清除</button>
          </div>
        </Transition>
      </div>

      <button
        @click="startEdit"
        class="w-8 h-8 md:w-7 md:h-7 flex items-center justify-center rounded-md text-text-tertiary/50
               hover:text-text-secondary transition-all duration-150"
        title="编辑"
      >
        <Pencil :size="15" class="md:w-[14px] md:h-[14px]" />
      </button>

      <button
        @click="store.deleteTask(task.id)"
        class="w-8 h-8 md:w-7 md:h-7 flex items-center justify-center rounded-md text-text-tertiary/50
               hover:text-tag-high-text transition-all duration-150"
        title="删除"
      >
        <Trash2 :size="15" class="md:w-[14px] md:h-[14px]" />
      </button>
    </div>
  </div>
</template>
