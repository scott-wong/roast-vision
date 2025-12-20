# result-display Specification

## Purpose
TBD - created by archiving change implement-coffee-roast-detection. Update Purpose after archive.
## Requirements
### Requirement: 检测结果展示
系统 SHALL 在用户完成5个采样点选择后，自动计算并展示检测结果。

#### Scenario: 显示检测结果
- **WHEN** 用户完成5个采样点选择
- **THEN** 系统自动计算5个点的L*平均值
- **AND** 系统计算对应的Agtron值和烘焙度描述
- **AND** 系统在结果区域显示：
  - Agtron值（主要结果，大字体显示）
  - 烘焙度描述（如"浅烘"、"中烘"、"深烘"）
  - 颜色细分描述（如"浅棕色"、"深棕色"）
  - 平均L*值（格式化显示，保留2位小数）
- **AND** 系统自动滚动到结果区域，使结果显示在主视觉位置

### Requirement: 采样点详细信息
系统 SHALL 显示每个采样点的详细信息，包括坐标和Lab值。

#### Scenario: 显示采样点信息
- **WHEN** 检测结果计算完成后
- **THEN** 系统在结果卡片中显示"采样点详情"部分
- **AND** 系统显示每个采样点的Lab值（格式：点X: L*=XX.XX, a*=XX.XX, b*=XX.XX）
- **AND** 采样点按选择顺序编号（点1到点5）

### Requirement: 结果保存提示
系统 SHALL 在显示检测结果后，提示用户可以将结果保存到历史记录。

#### Scenario: 保存结果提示
- **WHEN** 检测结果计算完成后
- **THEN** 系统显示"保存结果"按钮
- **AND** 用户点击后，系统将结果保存到本地存储
- **AND** 系统提示用户"保存成功"

