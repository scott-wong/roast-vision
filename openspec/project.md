# Project Context

## Purpose

开发微信小程序工具，通过手机拍照实现对咖啡豆/粉的烘焙度检测。用户可以在图片上选择5个采样点，系统计算Lab颜色空间值并转换为Agtron烘焙度单位。当前版本作为纯工具小程序，无需用户认证和后端服务，所有功能在小程序本地实现。

## Tech Stack

- **微信小程序**: 使用微信小程序框架开发
- **TypeScript**: 主要开发语言，提供类型安全
- **微信小程序API**:

  - 相机API (`wx.chooseImage`, `wx.chooseMedia`) - 支持拍照和相册选择
  - Canvas API - 用于图片处理和像素提取
  - 本地存储API (`wx.setStorageSync`, `wx.getStorageSync`) - 保存历史检测记录

## Project Conventions

### Code Style

- 使用TypeScript严格模式
- 遵循微信小程序组件化开发规范
- 文件命名：使用kebab-case（如 `color-converter.ts`）
- 函数命名：使用camelCase
- 类型定义：优先使用接口（interface）定义数据结构
- 注释：关键算法和业务逻辑需要中文注释说明

### Architecture Patterns

- **组件化架构**: 使用微信小程序Component模式，页面和组件分离
- **工具函数模块化**: 颜色转换、Agtron计算等核心逻辑封装为独立工具函数
- **数据流**:

  - 图片选择 → Canvas处理 → RGB提取 → Lab转换 → Agtron计算 → 结果展示
  - 检测结果保存到本地存储，支持历史记录查看
- **状态管理**: 使用小程序Page/Component的data进行状态管理，避免全局状态

### Testing Strategy

- 当前阶段：手动测试为主
- 核心算法（RGB→Lab→Agtron转换）需要重点验证准确性
- 使用真实咖啡豆图片进行测试，对比UCCC标准值

### Git Workflow

- 主分支：`main`
- 功能分支：`feature/功能名称`
- 提交信息：使用中文，清晰描述改动内容
- 提交前确保代码可以正常编译运行

## Domain Context

### 咖啡烘焙度检测

- **Agtron值**: 咖啡烘焙度的标准测量单位，数值范围通常为0-100，数值越小表示烘焙度越深
- **Lab颜色空间**:

  - L* (亮度): 0-100，值越大越亮
  - a* (红绿色轴): 正值偏红，负值偏绿
  - b* (黄蓝色轴): 正值偏黄，负值偏蓝
- **UCCC标准**: The Universal Coffee Color Curve（通用咖啡色曲线），定义了不同烘焙度对应的Lab值范围
  - 参考文档：`docs/UCCC.md`
  - 主要依据L*值进行Agtron值映射
  - 浅烘：L* 28.4-33.9，对应Agtron 85-95
  - 中烘：L* 21.0-25.8，对应Agtron 65-75
  - 深烘：L* 14.0-18.6，对应Agtron 35-55

### 多点采样策略

- 用户在图片上点击选择5个采样点
- 对每个采样点提取Lab值
- 计算5个点的L*平均值
- 根据平均L*值查找UCCC表，确定对应的Agtron值和烘焙度描述

### 颜色转换流程

1. 从Canvas获取像素RGB值（0-255范围）
2. RGB转换为XYZ颜色空间（需要D65标准光源）
3. XYZ转换为Lab颜色空间
4. 使用L*值匹配UCCC标准，获取Agtron值

## Important Constraints

- **无后端依赖**: 所有计算和处理必须在小程序本地完成，不能调用后端API
- **无用户认证**: 当前版本不需要用户登录或身份验证
- **本地存储限制**: 微信小程序本地存储有10MB限制，需要合理管理历史记录数据
- **Canvas性能**: 大图片处理可能影响性能，需要考虑图片压缩或分块处理
- **颜色准确性**: 不同设备屏幕和光照条件可能影响颜色提取准确性，需要在UI中提供使用提示
- **微信小程序版本兼容**: 确保使用的API在目标微信版本中可用

## External Dependencies

- **微信小程序基础库**: 需要支持Canvas 2D API和图片选择API
- **miniprogram-api-typings**: TypeScript类型定义，版本 ^2.8.3-1
- **无第三方服务**: 不依赖任何外部API或云服务
