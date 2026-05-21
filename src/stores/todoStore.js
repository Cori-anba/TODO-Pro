import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'

const STORAGE_KEY = 'todo-pro-tasks'
const THEME_KEY = 'todo-pro-theme'

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'light'
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
}

export const useTodoStore = defineStore('todo', () => {
  // ===== 状态 =====
  const tasks = ref(loadTasks())
  const filter = ref('all') // all | active | completed | favorites | overdue
  const sortBy = ref('created') // created | priority
  const searchQuery = ref('')
  const theme = ref(loadTheme())
  const isLoading = ref(false)

  // ===== 计算属性 =====
  const filteredTasks = computed(() => {
    let result = [...tasks.value]

    // 筛选
    switch (filter.value) {
      case 'active':
        result = result.filter(t => !t.completed)
        break
      case 'completed':
        result = result.filter(t => t.completed)
        break
      case 'favorites':
        result = result.filter(t => t.favorite)
        break
      case 'overdue':
        result = result.filter(t => {
          if (t.completed) return false
          if (!t.reminder) return false
          return dayjs(t.reminder).isBefore(dayjs())
        })
        break
    }

    // 搜索
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      result = result.filter(t => t.title.toLowerCase().includes(q))
    }

    // 排序 — 收藏置顶
    result.sort((a, b) => {
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1
      if (sortBy.value === 'priority') {
        const order = { high: 0, mid: 1, low: 2 }
        return order[a.priority] - order[b.priority]
      }
      return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    })

    return result
  })

  const counts = computed(() => ({
    all: tasks.value.length,
    active: tasks.value.filter(t => !t.completed).length,
    completed: tasks.value.filter(t => t.completed).length,
    favorites: tasks.value.filter(t => t.favorite).length,
    overdue: tasks.value.filter(t => {
      if (t.completed) return false
      if (!t.reminder) return false
      return dayjs(t.reminder).isBefore(dayjs())
    }).length,
  }))

  const overdueTasks = computed(() =>
    tasks.value.filter(t => {
      if (t.completed) return false
      if (!t.reminder) return false
      const diff = dayjs(t.reminder).diff(dayjs(), 'minute')
      return diff <= 10 && diff > -60 // 10分钟内到期，且过去不到1小时
    })
  )

  // ===== 操作方法 =====
  function addTask({ title, priority = 'mid', reminder = null }) {
    const task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      priority,
      favorite: false,
      reminder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    tasks.value.unshift(task)
  }

  function updateTask(id, updates) {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      tasks.value[idx] = {
        ...tasks.value[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
    }
  }

  function deleteTask(id) {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  function deleteTasks(ids) {
    const idSet = new Set(ids)
    tasks.value = tasks.value.filter(t => !idSet.has(t.id))
  }

  function toggleComplete(id) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      task.updatedAt = new Date().toISOString()
    }
  }

  function toggleFavorite(id) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.favorite = !task.favorite
      task.updatedAt = new Date().toISOString()
    }
  }

  function setReminder(id, datetime) {
    updateTask(id, { reminder: datetime })
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // demo 数据（首次使用）
  function seedDemoData() {
    if (tasks.value.length > 0) return
    const now = dayjs()
    const demos = [
      { title: '完成产品需求文档', priority: 'high', favorite: true, reminder: now.add(2, 'hour').toISOString() },
      { title: '设计登录页面原型', priority: 'mid', favorite: true },
      { title: '代码审查并合并 PR', priority: 'high', reminder: now.subtract(1, 'day').toISOString() },
      { title: '更新项目 README 文档', priority: 'low' },
      { title: '修复移动端导航栏布局问题', priority: 'mid', reminder: now.add(30, 'minute').toISOString() },
      { title: '准备本周技术分享 PPT', priority: 'low', favorite: true, reminder: now.add(3, 'day').toISOString() },
    ]
    demos.forEach(d => addTask(d))
  }

  // ===== 持久化 =====
  watch(tasks, (val) => saveTasks(val), { deep: true })
  watch(theme, (val) => {
    saveTheme(val)
    document.documentElement.classList.toggle('dark', val === 'dark')
  })

  // 初始化主题
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  }

  return {
    tasks,
    filter,
    sortBy,
    searchQuery,
    theme,
    isLoading,
    filteredTasks,
    counts,
    overdueTasks,
    addTask,
    updateTask,
    deleteTask,
    deleteTasks,
    toggleComplete,
    toggleFavorite,
    setReminder,
    toggleTheme,
    seedDemoData,
  }
})
