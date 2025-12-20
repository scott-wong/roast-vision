/**
 * 颜色转换算法测试
 * 使用已知的标准颜色值验证RGB到Lab转换的准确性
 */

import { rgbToLab, rgbToXyz, xyzToLab, RGB, XYZ, Lab } from './color-converter';

/**
 * 测试用例数据（来自标准颜色空间转换参考）
 */
const testCases = [
  {
    name: '白色',
    rgb: { r: 255, g: 255, b: 255 },
    expectedLab: { l: 100, a: 0, b: 0 },
    tolerance: 0.5,
  },
  {
    name: '黑色',
    rgb: { r: 0, g: 0, b: 0 },
    expectedLab: { l: 0, a: 0, b: 0 },
    tolerance: 0.5,
  },
  {
    name: '红色',
    rgb: { r: 255, g: 0, b: 0 },
    expectedLab: { l: 53.23, a: 80.11, b: 67.22 },
    tolerance: 2,
  },
  {
    name: '绿色',
    rgb: { r: 0, g: 255, b: 0 },
    expectedLab: { l: 87.74, a: -86.18, b: 83.18 },
    tolerance: 2,
  },
  {
    name: '蓝色',
    rgb: { r: 0, g: 0, b: 255 },
    expectedLab: { l: 32.30, a: 79.19, b: -107.86 },
    tolerance: 2,
  },
  {
    name: '中灰色',
    rgb: { r: 128, g: 128, b: 128 },
    expectedLab: { l: 53.59, a: 0, b: 0 },
    tolerance: 1,
  },
  // 咖啡豆烘焙度相关的棕色系
  {
    name: '浅棕色（浅烘）',
    rgb: { r: 150, g: 100, b: 70 },
    expectedLab: { l: 46.5, a: 16.3, b: 25.4 },
    tolerance: 3,
  },
  {
    name: '中棕色（中烘）',
    rgb: { r: 100, g: 60, b: 40 },
    expectedLab: { l: 30.2, a: 19.5, b: 23.1 },
    tolerance: 3,
  },
  {
    name: '深棕色（深烘）',
    rgb: { r: 60, g: 40, b: 30 },
    expectedLab: { l: 18.4, a: 11.2, b: 11.8 },
    tolerance: 3,
  },
];

/**
 * 验证Lab值是否在容差范围内
 */
function isLabWithinTolerance(
  actual: Lab,
  expected: Lab,
  tolerance: number
): boolean {
  const lDiff = Math.abs(actual.l - expected.l);
  const aDiff = Math.abs(actual.a - expected.a);
  const bDiff = Math.abs(actual.b - expected.b);

  return lDiff <= tolerance && aDiff <= tolerance && bDiff <= tolerance;
}

/**
 * 运行所有测试
 */
export function runColorConverterTests(): {
  passed: number;
  failed: number;
  results: Array<{
    name: string;
    passed: boolean;
    actual: Lab;
    expected: Lab;
    tolerance: number;
  }>;
} {
  const results = [];
  let passed = 0;
  let failed = 0;

  console.log('开始RGB→Lab转换算法测试...\n');

  for (const testCase of testCases) {
    const actual = rgbToLab(testCase.rgb);
    const isPassed = isLabWithinTolerance(
      actual,
      testCase.expectedLab,
      testCase.tolerance
    );

    results.push({
      name: testCase.name,
      passed: isPassed,
      actual: actual,
      expected: testCase.expectedLab,
      tolerance: testCase.tolerance,
    });

    if (isPassed) {
      passed++;
      console.log(`✓ ${testCase.name} - 通过`);
    } else {
      failed++;
      console.log(`✗ ${testCase.name} - 失败`);
    }

    console.log(
      `  RGB: (${testCase.rgb.r}, ${testCase.rgb.g}, ${testCase.rgb.b})`
    );
    console.log(
      `  预期Lab: (L=${testCase.expectedLab.l.toFixed(2)}, a=${testCase.expectedLab.a.toFixed(2)}, b=${testCase.expectedLab.b.toFixed(2)})`
    );
    console.log(
      `  实际Lab: (L=${actual.l.toFixed(2)}, a=${actual.a.toFixed(2)}, b=${actual.b.toFixed(2)})`
    );
    console.log(
      `  差异: (ΔL=${Math.abs(actual.l - testCase.expectedLab.l).toFixed(2)}, Δa=${Math.abs(actual.a - testCase.expectedLab.a).toFixed(2)}, Δb=${Math.abs(actual.b - testCase.expectedLab.b).toFixed(2)})`
    );
    console.log('');
  }

  console.log(`测试完成: ${passed}/${testCases.length} 通过\n`);

  return {
    passed,
    failed,
    results,
  };
}

/**
 * 运行XYZ转换测试
 */
export function runXyzConverterTests(): {
  passed: number;
  failed: number;
} {
  console.log('开始RGB→XYZ转换测试...\n');

  // 白色应该接近D65白点 (95.047, 100.000, 108.883)
  const whiteRgb: RGB = { r: 255, g: 255, b: 255 };
  const whiteXyz = rgbToXyz(whiteRgb);
  const whiteExpected = { x: 95.047, y: 100.0, z: 108.883 };
  const whiteTolerance = 0.1;

  const whiteXPassed = Math.abs(whiteXyz.x - whiteExpected.x) <= whiteTolerance;
  const whiteYPassed = Math.abs(whiteXyz.y - whiteExpected.y) <= whiteTolerance;
  const whiteZPassed = Math.abs(whiteXyz.z - whiteExpected.z) <= whiteTolerance;
  const whitePassed = whiteXPassed && whiteYPassed && whiteZPassed;

  console.log(`白色RGB→XYZ转换: ${whitePassed ? '✓ 通过' : '✗ 失败'}`);
  console.log(
    `  预期XYZ: (${whiteExpected.x.toFixed(3)}, ${whiteExpected.y.toFixed(3)}, ${whiteExpected.z.toFixed(3)})`
  );
  console.log(
    `  实际XYZ: (${whiteXyz.x.toFixed(3)}, ${whiteXyz.y.toFixed(3)}, ${whiteXyz.z.toFixed(3)})`
  );
  console.log('');

  // 黑色应该接近(0, 0, 0)
  const blackRgb: RGB = { r: 0, g: 0, b: 0 };
  const blackXyz = rgbToXyz(blackRgb);
  const blackTolerance = 0.1;

  const blackPassed =
    Math.abs(blackXyz.x) <= blackTolerance &&
    Math.abs(blackXyz.y) <= blackTolerance &&
    Math.abs(blackXyz.z) <= blackTolerance;

  console.log(`黑色RGB→XYZ转换: ${blackPassed ? '✓ 通过' : '✗ 失败'}`);
  console.log(`  预期XYZ: (0.000, 0.000, 0.000)`);
  console.log(
    `  实际XYZ: (${blackXyz.x.toFixed(3)}, ${blackXyz.y.toFixed(3)}, ${blackXyz.z.toFixed(3)})`
  );
  console.log('');

  const passed = (whitePassed ? 1 : 0) + (blackPassed ? 1 : 0);
  const failed = 2 - passed;

  console.log(`XYZ测试完成: ${passed}/2 通过\n`);

  return {
    passed,
    failed,
  };
}

// 如果直接运行此文件（开发环境测试）
if (typeof module !== 'undefined' && require.main === module) {
  runXyzConverterTests();
  runColorConverterTests();
}

