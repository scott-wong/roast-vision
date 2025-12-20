/**
 * 测试运行器
 * 在小程序环境中运行所有单元测试
 */

import {
  runColorConverterTests,
  runXyzConverterTests,
} from './color-converter.test';
import { runAllAgtronTests } from './agtron-calculator.test';

/**
 * 运行所有测试
 */
export function runAllTests(): void {
  console.log('==========================================');
  console.log('咖啡烘焙度检测 - 测试套件');
  console.log('==========================================\n');

  try {
    // RGB→XYZ转换测试
    console.log('1. RGB→XYZ转换测试');
    console.log('------------------------------------------');
    const xyzResults = runXyzConverterTests();

    // RGB→Lab转换测试
    console.log('2. RGB→Lab转换测试');
    console.log('------------------------------------------');
    const labResults = runColorConverterTests();

    // Agtron值计算测试
    console.log('3. Agtron值计算与UCCC标准匹配测试');
    console.log('------------------------------------------');
    runAllAgtronTests();

    console.log('\n==========================================');
    console.log('测试完成');
    console.log('==========================================');
  } catch (error) {
    console.error('测试运行失败:', error);
  }
}

/**
 * 快速验证测试（仅关键测试）
 */
export function runQuickTests(): void {
  console.log('运行快速验证测试...\n');

  // 测试1: 白色转换
  const { rgbToLab } = require('./color-converter');
  const whiteLab = rgbToLab({ r: 255, g: 255, b: 255 });
  console.log(
    `白色转换: L*=${whiteLab.l.toFixed(2)} (预期~100) ${Math.abs(whiteLab.l - 100) < 1 ? '✓' : '✗'}`
  );

  // 测试2: 黑色转换
  const blackLab = rgbToLab({ r: 0, g: 0, b: 0 });
  console.log(
    `黑色转换: L*=${blackLab.l.toFixed(2)} (预期~0) ${Math.abs(blackLab.l) < 1 ? '✓' : '✗'}`
  );

  // 测试3: 中烘咖啡豆颜色
  const mediumRoastLab = rgbToLab({ r: 100, g: 60, b: 40 });
  console.log(
    `中烘咖啡豆: L*=${mediumRoastLab.l.toFixed(2)} (预期20-35范围)`
  );

  // 测试4: Agtron计算
  const { calculateAgtron } = require('./agtron-calculator');
  const result = calculateAgtron(23.4);
  console.log(
    `L*=23.4 → Agtron=${result.agtron} (预期~75) ${Math.abs(result.agtron - 75) <= 2 ? '✓' : '✗'}`
  );

  console.log('\n快速测试完成');
}

