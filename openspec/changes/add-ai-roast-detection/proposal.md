# Change: 新增AI烘焙度检测功能

## Why

当前系统仅支持基于用户手动选择采样点的本地颜色计算方式。为了提供更智能、更便捷的检测体验，需要新增基于AI视觉模型的自动烘焙度检测功能。该功能将：

1. 自动分析整张咖啡图片，无需用户手动选择采样点
2. 利用ModelScope的视觉大模型（Qwen3-VL-30B-A3B-Instruct）进行智能识别
3. 结合UCCC标准给出专业的烘焙度评估结果
4. 为用户提供本地检测和AI检测两种方式的选择

## What Changes

- **新增AI检测能力**: 添加基于ModelScope API的AI烘焙度检测功能
- **新增图片云存储**: 支持将检测图片上传到CloudBase云存储
- **新增云函数**: 创建云函数用于安全调用ModelScope API（保护API密钥）
- **扩展检测方式**: 用户可以选择"本地检测"或"AI检测"两种模式
- **新增AI结果展示**: 展示AI返回的烘焙度、颜色细分、L*值、Agtron值

## Impact

- **新增能力**: `ai-detection` - AI烘焙度检测能力
- **修改能力**: 
  - `image-processing` - 增加图片上传到云存储的功能
  - `result-display` - 增加AI检测结果的展示
  - `user-interaction` - 增加检测模式选择交互
- **新增代码**:
  - 云函数: `cloudfunctions/ai-roast-detection/index.js`
  - 工具函数: `miniprogram/utils/cloud-storage.ts`
  - 工具函数: `miniprogram/utils/ai-detection.ts`
- **新增依赖**: 
  - 云函数需要 `openai` npm包（用于调用ModelScope API）
  - 小程序需要配置CloudBase环境
