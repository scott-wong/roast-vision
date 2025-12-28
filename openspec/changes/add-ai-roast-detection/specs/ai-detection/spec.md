## ADDED Requirements

### Requirement: AI烘焙度检测
系统 SHALL 支持基于ModelScope视觉大模型的AI自动烘焙度检测功能，无需用户手动选择采样点。

#### Scenario: 用户选择AI检测模式
- **WHEN** 用户在主页面选择"AI检测"模式
- **THEN** 系统显示AI检测模式的说明和提示
- **AND** 系统提供图片选择功能（拍照或从相册选择）

#### Scenario: 图片上传到云存储
- **WHEN** 用户选择图片后点击"开始AI检测"
- **THEN** 系统将图片上传到CloudBase云存储
- **AND** 系统显示上传进度（百分比或加载动画）
- **AND** 上传成功后，系统获取云存储文件URL

#### Scenario: 调用AI检测服务
- **WHEN** 图片上传成功后
- **THEN** 系统调用云函数 `ai-roast-detection`
- **AND** 云函数接收图片URL，调用ModelScope API进行检测
- **AND** 云函数使用指定的提示词和UCCC标准数据
- **AND** 云函数返回AI检测结果（烘焙度、颜色细分、L*值、Agtron值）

#### Scenario: AI检测结果展示
- **WHEN** AI检测完成后
- **THEN** 系统解析AI返回的结果
- **AND** 系统展示烘焙度、颜色细分、L*值、Agtron值
- **AND** 系统提供"保存结果"功能，将AI检测结果保存到历史记录
- **AND** 结果格式与本地检测结果保持一致，便于对比

#### Scenario: AI检测错误处理
- **WHEN** 图片上传失败
- **THEN** 系统显示错误提示："图片上传失败，请重试"
- **AND** 系统允许用户重新选择图片

#### Scenario: AI检测API错误
- **WHEN** 云函数调用ModelScope API失败或返回错误
- **THEN** 系统显示错误提示："AI检测失败，请稍后重试或使用本地检测"
- **AND** 系统提供"切换到本地检测"的选项

#### Scenario: 网络超时处理
- **WHEN** AI检测请求超时（超过30秒）
- **THEN** 系统显示超时提示："检测超时，请检查网络后重试"
- **AND** 系统允许用户取消或重试

### Requirement: 云函数AI检测服务
系统 SHALL 提供云函数服务，安全地调用ModelScope API进行烘焙度检测。

#### Scenario: 云函数接收请求
- **WHEN** 小程序调用云函数 `ai-roast-detection`
- **THEN** 云函数接收参数：图片URL（cloudPath或临时URL）
- **AND** 云函数验证请求参数的有效性

#### Scenario: 调用ModelScope API
- **WHEN** 云函数收到有效的图片URL
- **THEN** 云函数使用OpenAI SDK（配置ModelScope base_url）调用API
- **AND** 云函数使用模型 `Qwen/Qwen3-VL-30B-A3B-Instruct`
- **AND** 云函数发送包含UCCC标准数据的提示词和图片URL
- **AND** 提示词要求AI根据UC Davis研究和UCCC标准给出烘焙度评估结果

#### Scenario: 解析AI返回结果
- **WHEN** ModelScope API返回检测结果
- **THEN** 云函数解析AI返回的文本内容
- **AND** 云函数提取烘焙度、颜色细分、L*值、Agtron值
- **AND** 云函数将结果格式化为标准JSON格式返回给小程序

#### Scenario: 云函数错误处理
- **WHEN** ModelScope API调用失败
- **THEN** 云函数记录错误日志
- **AND** 云函数返回错误信息给小程序
- **AND** 错误信息包含错误类型和可读的错误描述

### Requirement: 检测模式选择
系统 SHALL 支持用户选择"本地检测"或"AI检测"两种检测模式。

#### Scenario: 模式选择界面
- **WHEN** 用户进入主页面
- **THEN** 系统显示检测模式选择（本地检测/AI检测）
- **AND** 默认选择"本地检测"模式（保持现有功能）
- **AND** 用户可以选择切换到"AI检测"模式

#### Scenario: 本地检测模式
- **WHEN** 用户选择"本地检测"模式
- **THEN** 系统使用现有的本地检测流程
- **AND** 系统显示图片选择界面
- **AND** 系统支持用户手动选择5个采样点
- **AND** 系统基于本地计算显示检测结果

#### Scenario: AI检测模式
- **WHEN** 用户选择"AI检测"模式
- **THEN** 系统显示AI检测模式的说明
- **AND** 系统显示图片选择界面
- **AND** 系统提供"开始AI检测"按钮（替代"选择采样点"）
- **AND** 系统自动进行AI检测，无需用户选择采样点

#### Scenario: 模式切换
- **WHEN** 用户在不同检测模式之间切换
- **THEN** 系统清除当前检测状态（采样点、结果等）
- **AND** 系统更新UI以匹配选择的模式
- **AND** 用户可以重新选择图片并开始新的检测
