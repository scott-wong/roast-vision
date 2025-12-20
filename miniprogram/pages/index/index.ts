// index.ts
import { rgbToLab, Lab } from '../../utils/color-converter';
import { calculateAgtronFromLabs, RoastResult } from '../../utils/agtron-calculator';
import { drawImageOnCanvas, getPixelRGBFromCanvas2D } from '../../utils/image-processor';

interface SamplePoint {
  x: number;
  y: number;
  lab: Lab;
  labFormatted?: string; // 格式化后的Lab值字符串，用于显示
}

Page({
  data: {
    imagePath: '',
    imageWidth: 0, // 原始图片宽度
    imageHeight: 0, // 原始图片高度
    displayWidth: 0, // 显示宽度
    displayHeight: 0, // 显示高度
    samplePoints: [] as SamplePoint[],
    result: null as RoastResult | null,
    resultFormatted: {
      lStar: '',
    },
    canvasReady: false,
  },

  onLoad() {
    // 页面加载时的初始化
  },

  /**
   * 选择图片（拍照）
   */
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          imagePath: tempFilePath,
          samplePoints: [],
          result: null,
          resultFormatted: {
            lStar: '',
          },
        });
        // 等待图片加载后初始化Canvas
        setTimeout(() => {
          this.initCanvas();
        }, 100);
      },
      fail: (err) => {
        console.error('拍照失败:', err);
        wx.showToast({
          title: '拍照失败',
          icon: 'none',
        });
      },
    });
  },

  /**
   * 从相册选择图片
   */
  chooseImageFromAlbum() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          imagePath: tempFilePath,
          samplePoints: [],
          result: null,
          resultFormatted: {
            lStar: '',
          },
        });
        // 等待图片加载后初始化Canvas
        setTimeout(() => {
          this.initCanvas();
        }, 100);
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none',
        });
      },
    });
  },

  /**
   * 初始化Canvas并绘制图片
   */
  async initCanvas() {
    try {
      const { imagePath } = this.data;
      if (!imagePath) return;

      // 获取图片信息
      const imageInfo = await new Promise<{
        width: number;
        height: number;
      }>((resolve, reject) => {
        wx.getImageInfo({
          src: imagePath,
          success: resolve,
          fail: reject,
        });
      });

      // 绘制图片到Canvas
      await drawImageOnCanvas('imageCanvas', imagePath);

      this.setData({
        imageWidth: imageInfo.width,
        imageHeight: imageInfo.height,
        canvasReady: true,
      });
    } catch (error) {
      console.error('Canvas初始化失败:', error);
      wx.showToast({
        title: '图片处理失败',
        icon: 'none',
      });
    }
  },

  /**
   * 图片加载完成
   */
  onImageLoad(e: any) {
    const { width, height } = e.detail;
    
    // 保存原始尺寸
    this.setData({
      imageWidth: width,
      imageHeight: height,
    }, () => {
      // 获取实际渲染尺寸
      setTimeout(() => {
        const query = wx.createSelectorQuery();
        query.select('.coffee-image').boundingClientRect().exec((res: any) => {
          const imageRect = res[0];
          if (imageRect && imageRect.width > 0 && imageRect.height > 0) {
            this.setData({
              displayWidth: imageRect.width,
              displayHeight: imageRect.height
            });
          }
        });
      }, 100);
    });
    
    // 初始化Canvas
    this.initCanvas();
  },

  /**
   * 图片加载错误
   */
  onImageError(e: any) {
    console.error('图片加载失败', e.detail);
    wx.showToast({
      title: '图片加载失败',
      icon: 'none',
    });
  },

  /**
   * 图片点击事件 - 选择采样点
   */
  async onImageTap(e: any) {
    if (this.data.samplePoints.length >= 5) {
      wx.showToast({
        title: '已选择5个采样点',
        icon: 'none',
      });
      return;
    }

    if (!this.data.canvasReady) {
      wx.showToast({
        title: '图片处理中，请稍候',
        icon: 'none',
      });
      return;
    }

    // 获取点击位置（相对于图片）
    const query = wx.createSelectorQuery();
    query
      .select('.coffee-image')
      .boundingClientRect((rect: any) => {
        if (!rect) return;

        const touch = e.detail;
        // 计算点击位置相对于图片的坐标（使用显示尺寸）
        const x = Math.round(touch.x - rect.left);
        const y = Math.round(touch.y - rect.top);

        // 确保坐标在图片显示范围内
        if (x < 0 || x >= rect.width || y < 0 || y >= rect.height) {
          return;
        }

        // 计算实际像素坐标（考虑图片缩放比例）
        const scaleX = this.data.imageWidth / rect.width;
        const scaleY = this.data.imageHeight / rect.height;
        const scale = Math.min(scaleX, scaleY);
        
        // 计算原始图片中的像素坐标
        const pixelX = Math.round(x * scale);
        const pixelY = Math.round(y * scale);

        // 确保像素坐标在原始图片范围内
        if (pixelX < 0 || pixelX >= this.data.imageWidth || pixelY < 0 || pixelY >= this.data.imageHeight) {
          return;
        }

        this.addSamplePoint(pixelX, pixelY, x, y);
      })
      .exec();
  },

  /**
   * 添加采样点
   */
  async addSamplePoint(pixelX: number, pixelY: number, displayX: number, displayY: number) {
    try {
      // 从Canvas获取RGB值
      const rgb = await getPixelRGBFromCanvas2D('imageCanvas', pixelX, pixelY);

      // 转换为Lab值
      const lab = rgbToLab(rgb);

      // 获取图片和容器的实际位置，用于正确定位采样点标记
      const query = wx.createSelectorQuery();
      query
        .select('.coffee-image')
        .boundingClientRect()
        .select('.image-container')
        .boundingClientRect()
        .exec((res) => {
          const imageRect = res[0];
          const containerRect = res[1];

          if (!imageRect || !containerRect) {
            // 如果获取不到位置信息，直接使用相对于图片的坐标
            const samplePoints = [...this.data.samplePoints];
            samplePoints.push({
              x: displayX,
              y: displayY,
              lab: lab,
              labFormatted: `L*=${lab.l.toFixed(2)}, a*=${lab.a.toFixed(2)}, b*=${lab.b.toFixed(2)}`,
            });
            this.setData({ samplePoints });
            return;
          }

          // 计算图片在容器中的偏移
          const offsetX = imageRect.left - containerRect.left;
          const offsetY = imageRect.top - containerRect.top;

          // 添加到采样点列表，坐标相对于容器
          const samplePoints = [...this.data.samplePoints];
          samplePoints.push({
            x: displayX + offsetX,
            y: displayY + offsetY,
            lab: lab,
            labFormatted: `L*=${lab.l.toFixed(2)}, a*=${lab.a.toFixed(2)}, b*=${lab.b.toFixed(2)}`,
          });

          this.setData({
            samplePoints: samplePoints,
          });

          // 如果已选择5个点，自动计算结果
          if (samplePoints.length === 5) {
            wx.showToast({
              title: '采样完成，正在计算...',
              icon: 'loading',
              duration: 500,
            });
            // 延迟一点点再计算，让用户看到提示
            setTimeout(() => {
              this.calculateResult();
            }, 500);
          }
        });
    } catch (error) {
      console.error('添加采样点失败:', error);
      wx.showToast({
        title: '提取颜色失败',
        icon: 'none',
      });
    }
  },

  /**
   * 删除采样点
   */
  removeSamplePoint(e: any) {
    const index = e.currentTarget.dataset.index;
    const samplePoints = [...this.data.samplePoints];
    samplePoints.splice(index, 1);
    this.setData({
      samplePoints: samplePoints,
      result: null,
      resultFormatted: {
        lStar: '',
      },
    });
  },

  /**
   * 计算检测结果
   */
  calculateResult() {
    if (this.data.samplePoints.length !== 5) {
      wx.showToast({
        title: '请选择5个采样点',
        icon: 'none',
      });
      return;
    }

    try {
      // 提取所有Lab值
      const labValues = this.data.samplePoints.map((point) => point.lab);

      // 计算Agtron值
      const result = calculateAgtronFromLabs(labValues);

      this.setData({
        result: result,
        resultFormatted: {
          lStar: result.lStar.toFixed(2),
        },
      }, () => {
        // 检测完成后，滚动到结果区域显示在主视觉位置
        setTimeout(() => {
          const query = wx.createSelectorQuery();
          query.select('#result-section').boundingClientRect();
          query.selectViewport().scrollOffset();
          query.exec((res: any) => {
            const rect = res[0];
            const scroll = res[1];
            if (rect && scroll) {
              // 计算需要滚动的距离：当前滚动位置 + 元素距离视口顶部的距离 - 顶部间距
              const scrollTop = scroll.scrollTop + rect.top - 40;
              wx.pageScrollTo({
                scrollTop: Math.max(0, scrollTop),
                duration: 400,
              });
            } else {
              // 备用方案：使用 selector
              wx.pageScrollTo({
                selector: '#result-section',
                duration: 400,
              });
            }
          });
        }, 300);
      });
    } catch (error) {
      console.error('计算结果失败:', error);
      wx.showToast({
        title: '计算失败',
        icon: 'none',
      });
    }
  },

  /**
   * 清除所有数据，重新开始
   */
  clearAll() {
    wx.showModal({
      title: '确认',
      content: '确定要清除当前检测数据吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            samplePoints: [],
            result: null,
            resultFormatted: {
              lStar: '',
            },
            canvasReady: false,
          }, () => {
            // 重新初始化Canvas，因为图片已经加载完成，onImageLoad不会再次触发
            if (this.data.imagePath) {
              this.initCanvas();
            }
            // 重新检测时，滚动回顶部恢复默认布局
            setTimeout(() => {
              wx.pageScrollTo({
                scrollTop: 0,
                duration: 400,
              }).catch(() => {
                // 如果失败，尝试使用 selector
                wx.pageScrollTo({
                  selector: '.top-actions',
                  duration: 400,
                });
              });
            }, 300);
          });
        }
      },
    });
  },

  /**
   * 查看历史记录
   */
  viewHistory() {
    wx.navigateTo({
      url: '/pages/history/history',
    });
  },

  /**
   * 保存检测结果到历史记录
   */
  saveResult() {
    if (!this.data.result) {
      return;
    }

    try {
      // 获取历史记录
      const historyStr = wx.getStorageSync('roastHistory') || '[]';
      const history = JSON.parse(historyStr);

      // 创建新记录
      const newRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        agtron: this.data.result.agtron,
        roastLevel: this.data.result.roastLevel,
        colorDetail: this.data.result.colorDetail,
        lStar: this.data.result.lStar,
        samplePoints: this.data.samplePoints.map((point) => ({
          lab: point.lab,
        })),
      };

      // 添加到历史记录（最多保存100条）
      history.unshift(newRecord);
      if (history.length > 100) {
        history.pop();
      }

      // 保存到本地存储
      wx.setStorageSync('roastHistory', JSON.stringify(history));

      wx.showToast({
        title: '保存成功',
        icon: 'success',
      });
    } catch (error) {
      console.error('保存失败:', error);
      wx.showToast({
        title: '保存失败',
        icon: 'none',
      });
    }
  },
});
