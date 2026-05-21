<script setup>
import { ref, nextTick } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import { Star, Pencil, Trash2, Clock, Bell, BellOff } from 'lucide-vue-next'
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
    class="group flex items-center gap-3 px-4 py-3 bg-card rounded-card border transition-all duration-150"
    :class="{
      'opacity-50': task.completed,
      'border-overdue-border bg-overdue-bg': isOverdue(),
      'border-border shadow-card hover:shadow-card-hover hover:border-border-hover': !isOverdue(),
    }"
  >
    <!-- 复选框 -->
    <button
      @click="store.toggleComplete(task.id)"
      class="w-[18px] h-[18px] flex-shrink-0 rounded-[5px] border-2 flex items-center justify-center transition-all duration-150"
      :class="task.completed
        ? 'bg-[#40c057] border-[#40c057] dark:bg-[#51cf66] dark:border-[#51cf66]'
        : 'border-text-tertiary/40 hover:border-text-secondary/60'"
    >
      <svg v-if="task.completed" width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4l2.5 2.5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- 主内容区 -->
    <div class="flex-1 min-w-0 flex items-center gap-3">
      <div class="flex-1 min-w-0" @dblclick="startEdit">
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
          class="text-[14px] cursor-default select-none transition-colors duration-150"
          :class="task.completed ? 'line-through text-text-tertiary' : 'text-text-primary'"
        >{{ task.title }}</span>
      </div>

      <div class="flex items-center gap-2 flex-shrink-0">
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

        <span class="text-[11px] text-text-tertiary font-mono whitespace-nowrap hidden sm:inline">
          {{ dayjs(task.createdAt).format('MM-DD') }}
        </span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center gap-0.5 flex-shrink-0">
      <button
        @click="store.toggleFavorite(task.id)"
        class="w-7 h-7 flex items-center justify-center rounded-md transition-all duration-150"
        :class="task.favorite
          ? 'text-[#f08c00]'
          : 'text-text-tertiary/50 hover:text-[#f08c00] opacity-0 group-hover:opacity-100'"
        :title="task.favorite ? '取消收藏' : '收藏'"
      >
        <Star :size="15" :fill="task.favorite ? 'currentColor' : 'none'" />
      </button>

      <div class="relative">
        <button
          @click="toggleReminderPicker"
          class="w-7 h-7 flex items-center justify-center rounded-md transition-all duration-150"
          :class="task.reminder
            ? 'text-[#f08c00]'
            : 'text-text-tertiary/50 hover:text-text-secondary opacity-0 group-hover:opacity-100'"
          title="设置提醒"
        >
          <Clock :size="15" />
        </button>
        <Transition name="fade">
          <div v-if="showReminderPicker" class="absolute right-0 top-full mt-1 z-20 bg-card rounded-card shadow-modal
                        border border-border p-3 flex items-center gap-2 transition-colors duration-300">
            <input
              v-model="reminderValue"
              type="datetime-local"
              class="px-2 py-1.5 text-[12px] bg-input-bg border border-border rounded-btn outline-none text-text-primary"
              @keydown.enter="handleSetReminder"
            />
            <button
              @click="handleSetReminder"
              class="px-3 py-1.5 text-[11px] font-semibold bg-[#2c2c2c] text-white dark:bg-[#e8e5e0] dark:text-[#111110] rounded-btn hover:opacity-90 transition-opacity"
            >确定</button>
            <button
              v-if="task.reminder"
              @click="clearReminder"
              class="px-3 py-1.5 text-[11px] font-semibold text-tag-high-text hover:bg-tag-high-bg rounded-btn transition-colors"
            >清除</button>
          </div>
        </Transition>
      </div>

      <button
        @click="startEdit"
        class="w-7 h-7 flex items-center justify-center rounded-md text-text-tertiary/50
               hover:text-text-secondary opacity-0 group-hover:opacity-100 transition-all duration-150"
        title="编辑"
      >
        <Pencil :size="14" />
      </button>

      <button
        @click="store.deleteTask(task.id)"
        class="w-7 h-7 flex items-center justify-center rounded-md text-text-tertiary/50
               hover:text-tag-high-text opacity-0 group-hover:opacity-100 transition-all duration-150"
        title="删除"
      >
        <Trash2 :size="14" />
      </button>
    </div>
  </div>
</template>
