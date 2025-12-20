# Change: 实现咖啡豆烘焙度检测小程序核心功能

## Why

当前项目仅包含微信小程序的基础模板代码，尚未实现任何咖啡豆烘焙度检测功能。需要实现完整的核心功能，包括图片选择、颜色提取、颜色空间转换、Agtron值计算、结果展示和历史记录管理，以提供可用的咖啡豆烘焙度检测工具。

## What Changes

- **ADDED**: 图片选择和处理能力 - 支持拍照和相册选择，通过Canvas提取像素RGB值
- **ADDED**: 颜色空间转换能力 - 实现RGB到XYZ再到Lab颜色空间的转换算法
- **ADDED**: 烘焙度计算能力 - 基于UCCC标准实现Lab值到Agtron值的映射和烘焙度分类
- **ADDED**: 用户交互能力 - 支持在图片上选择5个采样点，显示采样点标记
- **ADDED**: 结果展示能力 - 显示检测结果（Agtron值、烘焙度描述、Lab值）
- **ADDED**: 历史记录管理能力 - 保存检测历史到本地存储，支持查看、删除、导出历史记录，包含独立的历史记录页面

## Impact

- **Affected specs**: 新增6个能力规范（image-processing, color-conversion, roast-calculation, user-interaction, result-display, history-management）
- **Affected code**:
  - `miniprogram/pages/index/` - 主页面已完全重写，实现图片选择、采样点选择、结果计算等功能
  - `miniprogram/pages/history/` - 新增历史记录页面，实现历史记录查看、删除、导出功能
  - `miniprogram/utils/` - 新增颜色转换、Agtron计算、图片处理工具函数
  - `miniprogram/app.json` - 已更新页面配置和导航栏标题为"咖啡烘焙度检测"
