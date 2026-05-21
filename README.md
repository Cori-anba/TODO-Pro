# TODO Pro

简约、高级的任务管理单页应用，基于 Vue 3 构建。

## 技术栈

- **Vue 3** — Composition API + `<script setup>`
- **Pinia** — 状态管理
- **Tailwind CSS** — 原子化样式 + CSS 变量主题系统
- **Lucide Icons** — 线性图标库
- **dayjs** — 日期处理
- **Vite** — 构建工具
- **localStorage** — 数据持久化

## 功能

- 任务增删改查，支持优先级（高/中/低）
- 行内编辑，双击任务文本进入编辑模式
- 提醒功能 — 设置日期时间，到期前弹出 Toast 通知
- 收藏/置顶 — 收藏任务自动排序到列表顶部
- 多视图筛选 — 全部 / 进行中 / 已完成 / 已收藏 / 已过期
- 搜索 + 排序（按创建时间 / 优先级）
- 暗色 / 亮色主题切换
- 键盘快捷键 — `/` 聚焦搜索，`Ctrl+N` 快速添加
- 骨架屏加载 + 入场/离场动画
- localStorage 持久化，刷新不丢失

## 运行

```bash
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:5173`。

### 构建生产版本

```bash
npm run build
npm run preview
```

## 项目结构

```
src/
├── main.js                   # 入口文件
├── App.vue                   # 根组件
├── stores/
│   └── todoStore.js          # Pinia Store（状态 + localStorage 持久化）
├── components/
│   ├── AppHeader.vue         # 顶部栏（Logo、搜索、添加任务）
│   ├── FilterSidebar.vue     # 左侧筛选栏
│   ├── TaskList.vue          # 任务列表容器
│   ├── TaskItem.vue          # 单个任务卡片
│   ├── EmptyState.vue        # 空状态插画
│   ├── SkeletonLoader.vue    # 骨架屏
│   └── ReminderToast.vue     # 提醒通知
├── composables/
│   └── useReminder.js        # 提醒检查逻辑
└── styles/
    └── main.css              # 全局样式 + CSS 变量主题
```

## 未来规划

- 邮箱绑定 + 邮件提醒
- 响应式移动端适配
- 云端部署
- 任务拖拽排序
- JSON 数据导入/导出

## License

MIT
