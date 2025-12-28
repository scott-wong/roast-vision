## MODIFIED Requirements

### Requirement: 图片选择功能
系统 SHALL 支持用户通过拍照或从相册选择图片进行咖啡豆烘焙度检测。

#### Scenario: 用户选择拍照
- **WHEN** 用户点击拍照按钮
- **THEN** 系统调用微信小程序相机API打开相机
- **AND** 用户拍摄照片后，系统获取图片文件路径

#### Scenario: 用户从相册选择
- **WHEN** 用户点击相册选择按钮
- **THEN** 系统调用微信小程序图片选择API打开相册
- **AND** 用户选择图片后，系统获取图片文件路径

### Requirement: Canvas图片处理
系统 SHALL 使用Canvas API加载和处理用户选择的图片，支持提取指定坐标的像素RGB值。

#### Scenario: 图片加载到Canvas
- **WHEN** 系统获得图片文件路径
- **THEN** 系统获取图片信息（宽度和高度）
- **AND** 系统创建Canvas节点（type="2d"）
- **AND** 系统根据设备像素比（DPR）设置Canvas尺寸
- **AND** 系统将图片绘制到Canvas上（保持原始尺寸）
- **AND** Canvas尺寸适配图片尺寸，考虑设备像素比以确保像素提取准确性

#### Scenario: 提取像素RGB值
- **WHEN** 系统需要提取指定坐标(x, y)的像素值（原始图片像素坐标）
- **THEN** 系统通过Canvas 2D API获取Canvas节点
- **AND** 系统考虑设备像素比（DPR），将坐标乘以DPR后获取像素数据
- **AND** 系统通过getImageData获取该坐标的RGB值（范围0-255）
- **AND** 返回格式为 {r: number, g: number, b: number}
- **AND** 如果Canvas未准备好或坐标超出范围，系统返回错误

### Requirement: 图片显示
系统 SHALL 在页面上显示用户选择的图片，供用户进行采样点选择或AI检测。

#### Scenario: 图片展示
- **WHEN** 图片加载完成后
- **THEN** 系统在页面上显示图片
- **AND** 图片以合适尺寸显示，支持用户查看完整内容

## ADDED Requirements

### Requirement: 图片上传到云存储
系统 SHALL 支持将用户选择的图片上传到CloudBase云存储，用于AI检测功能。

#### Scenario: 上传图片到云存储
- **WHEN** 用户选择AI检测模式并选择图片后
- **THEN** 系统调用CloudBase云存储API上传图片
- **AND** 系统生成唯一的文件名（基于时间戳和随机数）
- **AND** 系统将图片上传到指定的云存储路径（如 `ai-detection/{timestamp}-{random}.jpg`）
- **AND** 系统显示上传进度（百分比或加载动画）

#### Scenario: 获取云存储文件URL
- **WHEN** 图片上传成功后
- **THEN** 系统获取云存储文件的cloudPath
- **AND** 系统可以获取临时访问URL（如果需要）
- **AND** 系统将文件URL传递给AI检测服务

#### Scenario: 上传错误处理
- **WHEN** 图片上传失败（网络错误、权限错误等）
- **THEN** 系统显示错误提示："图片上传失败，请重试"
- **AND** 系统记录错误信息
- **AND** 系统允许用户重新选择图片或重试上传
