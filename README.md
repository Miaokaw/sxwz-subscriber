# 四禧丸子订阅姬 (SXWZ Subscriber)

一个基于 Tauri 2.0 和 React 的桌面应用程序，用于订阅和管理四禧丸子的相关动态。

## 项目概述

本项目是一个现代化的桌面应用程序，使用 Tauri 2.0 框架构建，结合了 Rust 后端和 React 前端技术。应用旨在为用户提供便捷的方式来订阅和跟踪四禧丸子的最新动态。

## 技术栈

- **前端框架**: React 19.2.4
- **路由**: React Router 7.12.0
- **UI 库**: shadcn/ui 组件库，配合 Tailwind CSS
- **图标**: Lucide React
- **桌面框架**: Tauri 2.0
- **后端语言**: Rust
- **构建工具**: Vite, Bun
- **类型检查**: TypeScript
- **样式**: Tailwind CSS

## 项目结构

```
sxwz-subscriber/
├── README.md
├── sxwz-subscriber-app/
│   ├── .dockerignore
│   ├── .gitignore
│   ├── bun.lockb
│   ├── components.json
│   ├── Dockerfile
│   ├── package.json
│   ├── react-router.config.ts
│   ├── README.md
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui 组件
│   │   │   └── Layout.tsx    # 主布局组件
│   │   ├── features/         # 功能模块
│   │   │   ├── header/       # 头部组件
│   │   │   ├── sidebar/      # 侧边栏组件
│   │   │   └── subscriber/   # 订阅功能模块
│   │   ├── hooks/            # 自定义 React Hooks
│   │   ├── lib/              # 工具函数库
│   │   ├── routes/           # 路由组件
│   │   ├── app.css           # 全局样式
│   │   ├── root.tsx          # 应用根组件
│   │   └── routes.ts         # 路由配置
│   ├── build/                # 构建输出目录
│   ├── node_modules/         # Node.js 依赖包
│   ├── public/               # 静态资源
│   └── src-tauri/            # Tauri Rust 后端
│       ├── Cargo.toml        # Rust 依赖配置
│       ├── tauri.conf.json   # Tauri 配置文件
│       ├── build.rs          # 构建脚本
│       ├── capabilities/     # Tauri 权限配置
│       ├── gen/              # 生成的代码
│       ├── icons/            # 应用图标
│       ├── src/              # Rust 源码
│       └── target/           # Rust 编译输出
```

## 核心功能模块

### 1. 侧边栏 (Sidebar)
- 提供导航菜单
- 包含用户信息展示
- 支持主题切换

### 2. 订阅功能 (Subscriber)
- 管理订阅列表
- 显示订阅内容
- 支持订阅源管理

### 3. 动态管理 (Dynamics)
- 展示最新的动态信息
- 支持动态过滤和搜索

## 开发设置

### 环境要求
- Node.js >= 18.0
- Rust >= 1.77.2
- Bun (推荐) 或 npm/yarn/pnpm

### 安装依赖

```bash
cd sxwz-subscriber-app
bun install
```

### 开发运行

```bash
# 启动开发服务器
bun run dev

# 在另一个终端启动 Tauri 应用
cd src-tauri
cargo tauri dev
```

### 构建应用

```bash
# 构建前端
bun run build

# 构建完整 Tauri 应用
cargo tauri build
```

## 配置文件说明

### react-router.config.ts
- 配置 SSR 设置 (当前为 SPA 模式)
- 可根据需要启用服务端渲染

### vite.config.ts
- 使用 Vite 进行快速开发构建
- 集成 Tailwind CSS 和 TypeScript 路径映射

### tauri.conf.json
- 应用基本信息配置
- 窗口大小和标题设置
- 安全策略配置

### Cargo.toml
- Rust 依赖管理
- Tauri 相关插件配置
- 构建目标设置

## UI 组件库

项目使用 shadcn/ui 组件库，包含以下常用组件：
- Button, Input, Card
- Dialog, Sheet, Tooltip
- Sidebar, Navigation
- Avatar, Badge, Switch

## API 和通信

- 前后端通过 Tauri 提供的安全接口通信
- 使用 Rust 实现高性能后端逻辑
- 支持本地数据存储和网络请求

## 部署

### Docker 部署
```bash
# 构建 Docker 镜像
docker build -t sxwz-subscriber .

# 运行容器
docker run -p 3000:3000 sxwz-subscriber
```

### 桌面应用分发
使用 `cargo tauri build` 命令可以为不同平台构建原生安装包。

## 贡献指南

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

此项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有任何问题，请提交 Issue 或联系项目维护者。