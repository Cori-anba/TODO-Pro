<script setup>
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import TaskItem from './TaskItem.vue'
import EmptyState from './EmptyState.vue'
import SkeletonLoader from './SkeletonLoader.vue'

const store = useTodoStore()
const isInitialLoad = ref(true)

const filterMessages = {
  all: { message: '暂无任务', hint: '点击上方「+ 新任务」或按 ^N 开始添加' },
  active: { message: '没有进行中的任务', hint: '任务全部搞定，干得漂亮' },
  completed: { message: '没有已完成的任务', hint: '完成任务后将显示在这里' },
  favorites: { message: '没有收藏的任务', hint: '点击任务右侧的星标即可收藏' },
  overdue: { message: '没有已过期的任务', hint: '所有带提醒的任务都在有效期内' },
}

onMounted(() => {
  // 模拟首次加载
  setTimeout(() => {
    isInitialLoad.value = false
  }, 600)
})
</script>

<template>
  <!-- 骨架屏 -->
  <SkeletonLoader v-if="isInitialLoad" :count="5" />

  <!-- 列表 -->
  <div v-else-if="store.filteredTasks.length > 0" class="flex flex-col gap-2">
    <TransitionGroup name="fade">
      <TaskItem
        v-for="task in store.filteredTasks"
        :key="task.id"
        :task="task"
      />
    </TransitionGroup>
  </div>

  <!-- 空状态 -->
  <EmptyState
    v-else
    :message="filterMessages[store.filter].message"
    :hint="filterMessages[store.filter].hint"
  />
</template>
