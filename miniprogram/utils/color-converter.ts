/**
 * 颜色空间转换工具
 * 实现RGB到XYZ再到Lab的颜色空间转换
 */

// D65标准光源白点值
const D65_WHITE_POINT = {
  x: 95.047,
  y: 100.000,
  z: 108.883,
};

/**
 * RGB值接口
 */
export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

/**
 * XYZ值接口
 */
export interface XYZ {
  x: number;
  y: number;
  z: number;
}

/**
 * Lab值接口
 */
export interface Lab {
  l: number; // L* 亮度 0-100
  a: number; // a* 红绿色轴
  b: number; // b* 黄蓝色轴
}

/**
 * Gamma校正函数
 */
function gammaCorrection(value: number): number {
  if (value > 0.04045) {
    return Math.pow((value + 0.055) / 1.055, 2.4);
  }
  return value / 12.92;
}

/**
 * RGB到XYZ颜色空间转换
 * @param rgb RGB颜色值（0-255范围）
 * @returns XYZ颜色值
 */
export function rgbToXyz(rgb: RGB): XYZ {
  // 归一化到0-1范围
  let r = rgb.r / 255.0;
  let g = rgb.g / 255.0;
  let b = rgb.b / 255.0;

  // Gamma校正
  r = gammaCorrection(r);
  g = gammaCorrection(g);
  b = gammaCorrection(b);

  // 转换为线性RGB（sRGB到XYZ的转换矩阵，D65标准光源）
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
  const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

  // 乘以100（XYZ值通常以0-100范围表示）
  return {
    x: x * 100,
    y: y * 100,
    z: z * 100,
  };
}

/**
 * XYZ到Lab颜色空间转换
 * @param xyz XYZ颜色值
 * @returns Lab颜色值
 */
export function xyzToLab(xyz: XYZ): Lab {
  // 使用D65标准光源作为白点进行归一化
  let x = xyz.x / D65_WHITE_POINT.x;
  let y = xyz.y / D65_WHITE_POINT.y;
  let z = xyz.z / D65_WHITE_POINT.z;

  // f函数（用于Lab转换）
  function f(t: number): number {
    if (t > 0.008856) {
      return Math.pow(t, 1.0 / 3.0);
    }
    return (7.787 * t + 16.0 / 116.0);
  }

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  // 计算Lab值
  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return {
    l: Math.max(0, Math.min(100, l)), // 限制L*在0-100范围
    a: a,
    b: b,
  };
}

/**
 * RGB到Lab颜色空间转换（完整转换链）
 * @param rgb RGB颜色值（0-255范围）
 * @returns Lab颜色值
 */
export function rgbToLab(rgb: RGB): Lab {
  const xyz = rgbToXyz(rgb);
  return xyzToLab(xyz);
}

