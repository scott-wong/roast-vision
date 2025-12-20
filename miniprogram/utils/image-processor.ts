/**
 * 图片处理工具
 * 使用Canvas API处理图片和提取像素RGB值
 */

import { RGB } from './color-converter';

/**
 * 从Canvas获取指定坐标的RGB值
 * @param canvasId Canvas组件ID
 * @param x 像素X坐标
 * @param y 像素Y坐标
 * @returns Promise<RGB> RGB颜色值
 */
export function getPixelRGB(
  canvasId: string,
  x: number,
  y: number
): Promise<RGB> {
  return new Promise((resolve, reject) => {
    // 获取Canvas上下文
    const query = wx.createSelectorQuery();
    query
      .select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          reject(new Error('Canvas节点未找到'));
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        // 获取像素数据
        const imageData = ctx.getImageData(x, y, 1, 1);
        const data = imageData.data;

        resolve({
          r: data[0],
          g: data[1],
          b: data[2],
        });
      });
  });
}

/**
 * 在Canvas上绘制图片
 * @param canvasId Canvas组件ID
 * @param imagePath 图片路径
 * @returns Promise<{width: number, height: number}>
 */
export function drawImageOnCanvas(
  canvasId: string,
  imagePath: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // 获取Canvas节点
    const query = wx.createSelectorQuery();
    query
      .select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          reject(new Error('Canvas节点未找到'));
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getWindowInfo().pixelRatio;

        // 获取图片信息
        wx.getImageInfo({
          src: imagePath,
          success: (imageInfo) => {
            // 设置Canvas尺寸（需要考虑设备像素比）
            const width = imageInfo.width;
            const height = imageInfo.height;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            // 创建图片对象并绘制
            const img = canvas.createImage();
            img.onload = () => {
              ctx.clearRect(0, 0, width, height);
              ctx.drawImage(img, 0, 0, width, height);
              resolve({
                width: width,
                height: height,
              });
            };
            img.onerror = () => {
              reject(new Error('图片加载失败'));
            };
            img.src = imagePath;
          },
          fail: () => {
            reject(new Error('获取图片信息失败'));
          },
        });
      });
  });
}

/**
 * 从Canvas获取指定坐标的RGB值（简化版本，使用Canvas 2D）
 * 注意：此函数需要在Canvas已经绘制图片后调用
 * @param canvasId Canvas组件ID
 * @param x 像素X坐标（原始图片坐标，不需要考虑dpr）
 * @param y 像素Y坐标（原始图片坐标，不需要考虑dpr）
 * @returns Promise<RGB> RGB颜色值
 */
export function getPixelRGBFromCanvas2D(
  canvasId: string,
  x: number,
  y: number
): Promise<RGB> {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery();
    query
      .select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          reject(new Error('Canvas节点未找到'));
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getWindowInfo().pixelRatio;

        try {
          // 获取像素数据（需要考虑dpr缩放）
          const imageData = ctx.getImageData(x * dpr, y * dpr, 1, 1);
          const data = imageData.data;

          resolve({
            r: data[0],
            g: data[1],
            b: data[2],
          });
        } catch (error) {
          reject(new Error('获取像素数据失败: ' + error));
        }
      });
  });
}

