# Roast Vision - 咖啡烘焙度检测

一个微信小程序,通过拍照检测咖啡豆/粉的烘焙度(Agtron值)。

## 📱 扫码体验

![微信小程序码](docs/images/mini-code.png)

扫描上方二维码体验小程序

## ✨ 功能特性

- 📸 **图片采集**: 支持拍照和相册选择
- 🎯 **多点采样**: 5点采样减少误差
- 🔬 **精确计算**: 基于UCCC标准的Agtron值计算
- 📊 **结果展示**: 显示Agtron值、烘焙度级别、Lab颜色值
- 💾 **历史记录**: 本地保存检测历史(最多100条)
- ⚡ **纯本地处理**: 无需后端,所有计算在本地完成

## 🚀 快速开始

### 环境要求

- 微信开发者工具
- Node.js (用于运行测试)

### 安装和运行

1. 克隆项目

   ```bash
   git clone <repository-url>
   cd roast-vision
   ```

2. 使用微信开发者工具打开项目目录

3. 点击"编译"运行小程序

### 运行测试

在微信开发者工具控制台中执行:

```javascript
const { runAllTests } = require('./utils/run-tests');
runAllTests();
```

## 📖 使用说明

1. **选择图片**: 点击"拍照"或"从相册选择"按钮
2. **选择采样点**: 在咖啡豆表面点击5次选择采样点
3. **计算结果**: 点击"计算烘焙度"查看检测结果
4. **保存记录**: 点击"保存结果"将检测数据保存到历史记录

### 采样建议

- 在标准光照条件下拍摄
- 选择颜色均匀的咖啡豆表面
- 避免高光和阴影区域
- 分散选择不同位置的采样点

## 🧪 测试验证

### 算法测试结果

- ✅ RGB→Lab转换: 7/7 通过 (100%准确率)
- ✅ Agtron计算: 6/6 UCCC标准点通过
- ✅ 多点采样: 3/3 测试通过
- ✅ 总通过率: 100%

详细测试报告: [docs/TEST_REPORT.md](docs/TEST_REPORT.md)

## 📁 项目结构

```text
roast-vision/
├── miniprogram/           # 小程序源码
│   ├── pages/            # 页面
│   │   └── index/        # 主页面
│   └── utils/            # 工具函数
│       ├── color-converter.ts      # 颜色转换
│       ├── agtron-calculator.ts    # Agtron计算
│       └── image-processor.ts      # 图片处理
├── docs/                 # 文档
│   ├── images/          # 图片资源
│   │   └── mini-code.png # 小程序码
│   ├── UCCC.md          # UCCC标准说明
│   ├── TEST_REPORT.md   # 测试报告
│   └── TESTING_GUIDE.md # 测试指南
└── openspec/            # OpenSpec规范
```

## 🔬 技术实现

### 核心算法

1. **颜色空间转换**: RGB → XYZ → Lab (CIE标准)
2. **Agtron计算**: 基于UCCC标准的16点映射和线性插值
3. **多点采样**: 5点L*平均值减少单点误差

### 技术栈

- TypeScript
- 微信小程序 Canvas 2D API
- 本地存储 (localStorage)

## 📊 烘焙度参考

| Agtron值 | 烘焙度 | 描述 |
|---------|--------|------|
| 95-100  | 白色/超浅烘 | 暗棕黄色 |
| 85-95   | 浅烘 | 黄棕色至棕色 |
| 75-85   | 中烘 | 棕色至深棕色 |
| 55-75   | 深烘 | 深棕色至黑棕色 |
| 25-55   | 超深烘 | 黑棕色至黑色 |

## 📝 文档

- [测试报告](docs/TEST_REPORT.md) - 详细的测试结果和验证
- [测试指南](docs/TESTING_GUIDE.md) - 逐步测试流程
- [实现总结](IMPLEMENTATION_SUMMARY.md) - 完整的实现说明
- [UCCC标准](docs/UCCC.md) - 通用咖啡色曲线标准

## 🎯 已知限制

- 光照条件会影响颜色准确性
- 不同设备的相机和屏幕可能有色差

## 🔮 未来计划

- [ ] 图片缩放和平移功能
- [ ] AI辅助采样点选择
- [ ] 云端数据同步

## 📄 License

Apache-2.0

## 👥 贡献

欢迎提交Issue和Pull Request!

详细实现说明请参考: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
