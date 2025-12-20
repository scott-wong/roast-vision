## ADDED Requirements

### Requirement: UCCC标准数据映射
系统 SHALL 实现UCCC（通用咖啡色曲线）标准数据，包含不同烘焙度对应的L*值范围和Agtron值。

#### Scenario: UCCC数据查询
- **WHEN** 系统需要根据L*值查找对应的烘焙度信息
- **THEN** 系统根据UCCC标准表匹配L*值范围
- **AND** 返回对应的烘焙度描述和Agtron值范围

### Requirement: Agtron值计算
系统 SHALL 根据L*值计算对应的Agtron烘焙度值，基于UCCC标准进行线性插值或区间映射。

#### Scenario: 单点L*值转Agtron
- **WHEN** 系统获得单个采样点的L*值
- **THEN** 系统根据UCCC标准查找L*值所在的区间
- **AND** 计算对应的Agtron值（通过线性插值或区间映射）
- **AND** 返回Agtron值（范围通常为0-100）

#### Scenario: 多点L*平均值转Agtron
- **WHEN** 系统获得5个采样点的L*值
- **THEN** 系统计算5个L*值的平均值
- **AND** 根据平均L*值计算对应的Agtron值
- **AND** 返回最终Agtron值和烘焙度描述

### Requirement: 烘焙度分类
系统 SHALL 根据Agtron值或L*值对咖啡烘焙度进行分类，包括浅烘、中烘、深烘等。

#### Scenario: 烘焙度分类
- **WHEN** 系统计算出Agtron值或L*值
- **THEN** 系统根据UCCC标准确定烘焙度类别
- **AND** 返回烘焙度描述（如"浅烘"、"中烘"、"深烘"等）
- **AND** 返回对应的颜色细分描述（如"浅棕色"、"深棕色"等）

