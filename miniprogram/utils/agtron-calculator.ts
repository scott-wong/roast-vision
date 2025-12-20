/**
 * Agtron值计算工具
 * 基于UCCC（通用咖啡色曲线）标准实现Lab值到Agtron值的映射
 */

import { Lab } from './color-converter';

/**
 * UCCC标准数据点
 * 基于docs/UCCC.md中的标准数据
 */
interface UCCCPoint {
  lStar: number; // L*值
  agtron: number; // Agtron值
  roastLevel: string; // 烘焙度级别
  colorDetail: string; // 颜色细分描述
}

// UCCC标准数据表（从UCCC.md提取的关键点）
const UCCC_DATA: UCCCPoint[] = [
  { lStar: 58.2, agtron: 100, roastLevel: '白色烘焙', colorDetail: '暗棕黄色' },
  { lStar: 54.6, agtron: 98, roastLevel: '超浅烘', colorDetail: '浅黄棕色' },
  { lStar: 50.8, agtron: 96, roastLevel: '超浅烘', colorDetail: '黄棕色' },
  { lStar: 47.0, agtron: 94, roastLevel: '超浅烘', colorDetail: '暗黄棕色' },
  { lStar: 43.4, agtron: 92, roastLevel: '超浅烘', colorDetail: '浅红棕色' },
  { lStar: 40.0, agtron: 90, roastLevel: '超浅烘', colorDetail: '红棕色' },
  { lStar: 36.9, agtron: 88, roastLevel: '超浅烘', colorDetail: '暗红棕色' },
  { lStar: 33.9, agtron: 85, roastLevel: '浅烘', colorDetail: '浅棕色' },
  { lStar: 31.1, agtron: 95, roastLevel: '浅烘', colorDetail: '棕色' }, // 极浅
  { lStar: 28.4, agtron: 85, roastLevel: '浅烘', colorDetail: '暗棕色' }, // 肉桂
  { lStar: 25.8, agtron: 80, roastLevel: '中烘', colorDetail: '浅深棕色' },
  { lStar: 23.4, agtron: 75, roastLevel: '中烘', colorDetail: '深棕色' }, // 中烘
  { lStar: 21.0, agtron: 65, roastLevel: '中烘', colorDetail: '暗深棕色' }, // 高度烘焙
  { lStar: 18.6, agtron: 55, roastLevel: '深烘', colorDetail: '浅黑棕色' }, // 城市烘焙
  { lStar: 16.3, agtron: 45, roastLevel: '深烘', colorDetail: '黑棕色' }, // 深度城市
  { lStar: 14.0, agtron: 35, roastLevel: '深烘', colorDetail: '暗黑棕色' }, // 法式
];

/**
 * 烘焙度分类结果
 */
export interface RoastResult {
  agtron: number; // Agtron值
  roastLevel: string; // 烘焙度级别（如"浅烘"、"中烘"、"深烘"）
  colorDetail: string; // 颜色细分描述
  lStar: number; // 使用的L*值
}

/**
 * 根据L*值计算Agtron值和烘焙度分类
 * 使用线性插值方法
 * @param lStar L*值（0-100）
 * @returns 烘焙度结果
 */
export function calculateAgtron(lStar: number): RoastResult {
  // 处理边界情况
  if (lStar >= UCCC_DATA[0].lStar) {
    // 超出最高值，返回最浅烘焙
    return {
      agtron: 100,
      roastLevel: UCCC_DATA[0].roastLevel,
      colorDetail: UCCC_DATA[0].colorDetail,
      lStar: lStar,
    };
  }

  if (lStar <= UCCC_DATA[UCCC_DATA.length - 1].lStar) {
    // 低于最低值，判断是否为超深烘
    if (lStar < 14.0) {
      return {
        agtron: 25,
        roastLevel: '超深烘',
        colorDetail: '黑色',
        lStar: lStar,
      };
    }
    // 返回最深烘焙
    const last = UCCC_DATA[UCCC_DATA.length - 1];
    return {
      agtron: last.agtron,
      roastLevel: last.roastLevel,
      colorDetail: last.colorDetail,
      lStar: lStar,
    };
  }

  // 查找L*值所在区间，进行线性插值
  for (let i = 0; i < UCCC_DATA.length - 1; i++) {
    const point1 = UCCC_DATA[i];
    const point2 = UCCC_DATA[i + 1];

    if (lStar <= point1.lStar && lStar >= point2.lStar) {
      // 计算插值比例
      const ratio = (lStar - point2.lStar) / (point1.lStar - point2.lStar);

      // 线性插值计算Agtron值
      const agtron = point2.agtron + (point1.agtron - point2.agtron) * ratio;

      // 选择更接近的烘焙度级别和颜色描述
      const selectedPoint = ratio > 0.5 ? point1 : point2;

      return {
        agtron: Math.round(agtron),
        roastLevel: selectedPoint.roastLevel,
        colorDetail: selectedPoint.colorDetail,
        lStar: lStar,
      };
    }
  }

  // 如果找不到匹配区间（理论上不应该发生），返回默认值
  return {
    agtron: 50,
    roastLevel: '未知',
    colorDetail: '未知',
    lStar: lStar,
  };
}

/**
 * 根据多个Lab值计算平均Agtron值
 * @param labValues Lab值数组
 * @returns 烘焙度结果
 */
export function calculateAgtronFromLabs(labValues: Lab[]): RoastResult {
  if (labValues.length === 0) {
    throw new Error('Lab值数组不能为空');
  }

  // 计算L*平均值
  const avgLStar = labValues.reduce((sum, lab) => sum + lab.l, 0) / labValues.length;
  const avgA = labValues.reduce((sum, lab) => sum + lab.a, 0) / labValues.length;
  const avgB = labValues.reduce((sum, lab) => sum + lab.b, 0) / labValues.length;

  // 根据平均L*值计算Agtron值
  const result = calculateAgtron(avgLStar);

  return result;
}

