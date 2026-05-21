import { ref, onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import dayjs from 'dayjs'

export function useReminder() {
  const store = useTodoStore()
  const toasts = ref([])
  let timer = null
  const notifiedIds = new Set()

  function checkReminders() {
    const now = dayjs()
    store.tasks.forEach(task => {
      if (task.completed) return
      if (!task.reminder) return
      if (notifiedIds.has(task.id)) return

      const reminderTime = dayjs(task.reminder)
      const diffMinutes = reminderTime.diff(now, 'minute')

      // 10分钟内到期时提醒
      if (diffMinutes <= 10 && diffMinutes > -60) {
        const id = crypto.randomUUID()
        toasts.value.push({
          id,
          taskId: task.id,
          title: task.title,
          time: reminderTime.format('HH:mm'),
          overdue: diffMinutes < 0,
        })
        notifiedIds.add(task.id)
        // 8秒后自动消失
        setTimeout(() => {
          toasts.value = toasts.value.filter(t => t.id !== id)
        }, 8000)
      }
    })
  }

  function dismissToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  onMounted(() => {
    checkReminders()
    timer = setInterval(checkReminders, 30000) // 每30秒检查
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return { toasts, dismissToast }
}
