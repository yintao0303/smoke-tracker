# 戒烟助手 (Smoke Tracker)

一款基于 uni-app 开发的多端吸烟数量追踪小程序，帮助用户记录和分析每日吸烟情况，助力健康生活。

## 项目简介

本项目是一个帮助用户追踪每日吸烟数量的多端应用程序。通过直观的数据记录和可视化分析，帮助用户了解自己的吸烟习惯，为戒烟过程提供数据支持。

## 功能特点

- 📝 每日吸烟记录
- 📊 数据可视化统计
- 📅 历史数据回顾
- 📈 趋势分析
- 🎯 戒烟目标设定
- 🔔 智能提醒

## 技术栈

- 框架：uni-app
- 前端：Vue 2.6.14
- UI组件：uni-ui 1.4.20
- 状态管理：Vuex 3.6.2
- 图表库：ECharts 5.4.0

## 支持平台

- 微信小程序
- H5
- App（Android/iOS）
- 其他小程序平台

## 开发环境搭建

1. 确保已安装 Node.js (建议 12.0 以上版本)

2. 安装依赖
```bash
npm install
```

3. 运行开发服务
```bash
# 运行到 H5
npm run dev:h5

# 运行到微信小程序
npm run dev:mp-weixin
```

4. 发布构建
```bash
# H5 平台
npm run build:h5

# 微信小程序
npm run build:mp-weixin
```

## 项目结构

```
smoke-tracker/
├── components/     # 组件目录
├── pages/         # 页面文件目录
├── static/        # 静态资源目录
├── store/         # Vuex 状态管理
├── common/        # 公共工具类
├── App.vue        # 应用入口组件
├── main.js        # 应用入口文件
├── manifest.json  # 应用配置文件
└── pages.json     # 页面路由配置
```

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 版本历史

- 1.0.0
  - 首次发布
  - 基础功能实现

## 作者

[Todd] - 项目创建者