/**
 * Agtron值计算测试
 * 验证Lab值到Agtron值转换与UCCC标准的匹配度
 */

import { calculateAgtron, calculateAgtronFromLabs } from './agtron-calculator';
import { Lab } from './color-converter';

/**
 * UCCC标准数据点测试用例（从docs/UCCC.md提取）
 */
const ucccTestCases = [
  {
    name: '白色烘焙 (Agtron 100)',
    lStar: 58.2,
    expectedAgtron: 100,
    expectedRoastLevel: '白色烘焙',
    tolerance: 2,
  },
  {
    name: '超浅烘 (Agtron 95)',
    lStar: 50.8,
    expectedAgtron: 96,
    expectedRoastLevel: '超浅烘',
    tolerance: 2,
  },
  {
    name: '浅烘 - 肉桂 (Agtron 85)',
    lStar: 33.9,
    expectedAgtron: 85,
    expectedRoastLevel: '浅烘',
    tolerance: 2,
  },
  {
    name: '中烘 (Agtron 75)',
    lStar: 23.4,
    expectedAgtron: 75,
    expectedRoastLevel: '中烘',
    tolerance: 2,
  },
  {
    name: '深烘 - 城市 (Agtron 55)',
    lStar: 18.6,
    expectedAgtron: 55,
    expectedRoastLevel: '深烘',
    tolerance: 2,
  },
  {
    name: '深烘 - 法式 (Agtron 35)',
    lStar: 14.0,
    expectedAgtron: 35,
    expectedRoastLevel: '深烘',
    tolerance: 2,
  },
];

/**
 * 插值测试用例（测试在标准点之间的插值准确性）
 */
const interpolationTestCases = [
  {
    name: '中间值 - L*=27 (应该在80-85之间)',
    lStar: 27.0,
    expectedMinAgtron: 80,
    expectedMaxAgtron: 85,
  },
  {
    name: '中间值 - L*=20 (应该在65-75之间)',
    lStar: 20.0,
    expectedMinAgtron: 65,
    expectedMaxAgtron: 75,
  },
  {
    name: '中间值 - L*=45 (应该在92-95之间)',
    lStar: 45.0,
    expectedMinAgtron: 92,
    expectedMaxAgtron: 96,
  },
];

/**
 * 边界测试用例
 */
const boundaryTestCases = [
  {
    name: '超出上界 (L*=65)',
    lStar: 65.0,
    expectedAgtron: 100,
    expectedRoastLevel: '白色烘焙',
  },
  {
    name: '超出下界 (L*=10)',
    lStar: 10.0,
    expectedAgtron: 25,
    expectedRoastLevel: '超深烘',
  },
  {
    name: '接近下界 (L*=14.5)',
    lStar: 14.5,
    expectedMinAgtron: 30,
    expectedMaxAgtron: 40,
  },
];

/**
 * 运行UCCC标准点测试
 */
export function runUCCCStandardTests(): {
  passed: number;
  failed: number;
  results: Array<{
    name: string;
    passed: boolean;
    actualAgtron: number;
    expectedAgtron: number;
    actualRoastLevel: string;
    expectedRoastLevel: string;
  }>;
} {
  const results = [];
  let passed = 0;
  let failed = 0;

  console.log('开始UCCC标准数据点测试...\n');

  for (const testCase of ucccTestCases) {
    const result = calculateAgtron(testCase.lStar);
    const agtronMatch =
      Math.abs(result.agtron - testCase.expectedAgtron) <= testCase.tolerance;
    const roastLevelMatch = result.roastLevel === testCase.expectedRoastLevel;
    const isPassed = agtronMatch;

    results.push({
      name: testCase.name,
      passed: isPassed,
      actualAgtron: result.agtron,
      expectedAgtron: testCase.expectedAgtron,
      actualRoastLevel: result.roastLevel,
      expectedRoastLevel: testCase.expectedRoastLevel,
    });

    if (isPassed) {
      passed++;
      console.log(`✓ ${testCase.name} - 通过`);
    } else {
      failed++;
      console.log(`✗ ${testCase.name} - 失败`);
    }

    console.log(`  输入L*: ${testCase.lStar.toFixed(2)}`);
    console.log(
      `  预期: Agtron=${testCase.expectedAgtron}, 烘焙度=${testCase.expectedRoastLevel}`
    );
    console.log(
      `  实际: Agtron=${result.agtron}, 烘焙度=${result.roastLevel}`
    );
    console.log(
      `  Agtron差异: ${Math.abs(result.agtron - testCase.expectedAgtron).toFixed(2)}`
    );
    console.log('');
  }

  console.log(`UCCC标准测试完成: ${passed}/${ucccTestCases.length} 通过\n`);

  return {
    passed,
    failed,
    results,
  };
}

/**
 * 运行插值测试
 */
export function runInterpolationTests(): {
  passed: number;
  failed: number;
} {
  let passed = 0;
  let failed = 0;

  console.log('开始插值准确性测试...\n');

  for (const testCase of interpolationTestCases) {
    const result = calculateAgtron(testCase.lStar);
    const isPassed =
      result.agtron >= testCase.expectedMinAgtron &&
      result.agtron <= testCase.expectedMaxAgtron;

    if (isPassed) {
      passed++;
      console.log(`✓ ${testCase.name} - 通过`);
    } else {
      failed++;
      console.log(`✗ ${testCase.name} - 失败`);
    }

    console.log(`  输入L*: ${testCase.lStar.toFixed(2)}`);
    console.log(
      `  预期范围: Agtron ${testCase.expectedMinAgtron}-${testCase.expectedMaxAgtron}`
    );
    console.log(`  实际: Agtron ${result.agtron}, 烘焙度=${result.roastLevel}`);
    console.log('');
  }

  console.log(`插值测试完成: ${passed}/${interpolationTestCases.length} 通过\n`);

  return {
    passed,
    failed,
  };
}

/**
 * 运行边界测试
 */
export function runBoundaryTests(): {
  passed: number;
  failed: number;
} {
  let passed = 0;
  let failed = 0;

  console.log('开始边界条件测试...\n');

  for (const testCase of boundaryTestCases) {
    const result = calculateAgtron(testCase.lStar);

    let isPassed = false;
    if ('expectedAgtron' in testCase) {
      isPassed = result.agtron === testCase.expectedAgtron;
    } else if ('expectedMinAgtron' in testCase && 'expectedMaxAgtron' in testCase) {
      isPassed =
        result.agtron >= testCase.expectedMinAgtron &&
        result.agtron <= testCase.expectedMaxAgtron;
    }

    if (isPassed) {
      passed++;
      console.log(`✓ ${testCase.name} - 通过`);
    } else {
      failed++;
      console.log(`✗ ${testCase.name} - 失败`);
    }

    console.log(`  输入L*: ${testCase.lStar.toFixed(2)}`);
    if ('expectedAgtron' in testCase) {
      console.log(`  预期: Agtron=${testCase.expectedAgtron}`);
    } else if ('expectedMinAgtron' in testCase && 'expectedMaxAgtron' in testCase) {
      console.log(
        `  预期范围: Agtron ${testCase.expectedMinAgtron}-${testCase.expectedMaxAgtron}`
      );
    }
    console.log(`  实际: Agtron=${result.agtron}, 烘焙度=${result.roastLevel}`);
    console.log('');
  }

  console.log(`边界测试完成: ${passed}/${boundaryTestCases.length} 通过\n`);

  return {
    passed,
    failed,
  };
}

/**
 * 运行多点采样平均值测试
 */
export function runMultiSampleTests(): {
  passed: number;
  failed: number;
} {
  console.log('开始多点采样平均值测试...\n');

  // 测试用例1: 5个L*值接近的采样点（模拟均匀烘焙）
  const uniformSamples: Lab[] = [
    { l: 23.0, a: 10, b: 15 },
    { l: 23.5, a: 11, b: 16 },
    { l: 23.2, a: 10.5, b: 15.5 },
    { l: 23.8, a: 11.5, b: 16.5 },
    { l: 23.4, a: 10.8, b: 15.8 },
  ];
  const avgLStar1 = uniformSamples.reduce((sum, lab) => sum + lab.l, 0) / 5;
  const result1 = calculateAgtronFromLabs(uniformSamples);
  const expected1 = calculateAgtron(avgLStar1);
  const test1Passed = Math.abs(result1.agtron - expected1.agtron) <= 1;

  console.log(
    `${test1Passed ? '✓' : '✗'} 测试1: 均匀烘焙（5个接近的L*值）`
  );
  console.log(`  L*值: ${uniformSamples.map((s) => s.l.toFixed(2)).join(', ')}`);
  console.log(`  平均L*: ${avgLStar1.toFixed(2)}`);
  console.log(`  计算Agtron: ${result1.agtron}`);
  console.log(`  预期Agtron: ${expected1.agtron}`);
  console.log('');

  // 测试用例2: 5个L*值有差异的采样点（模拟不均匀烘焙）
  const varyingSamples: Lab[] = [
    { l: 20.0, a: 10, b: 15 },
    { l: 25.0, a: 11, b: 16 },
    { l: 22.0, a: 10.5, b: 15.5 },
    { l: 24.0, a: 11.5, b: 16.5 },
    { l: 23.0, a: 10.8, b: 15.8 },
  ];
  const avgLStar2 = varyingSamples.reduce((sum, lab) => sum + lab.l, 0) / 5;
  const result2 = calculateAgtronFromLabs(varyingSamples);
  const expected2 = calculateAgtron(avgLStar2);
  const test2Passed = Math.abs(result2.agtron - expected2.agtron) <= 1;

  console.log(
    `${test2Passed ? '✓' : '✗'} 测试2: 不均匀烘焙（5个不同的L*值）`
  );
  console.log(`  L*值: ${varyingSamples.map((s) => s.l.toFixed(2)).join(', ')}`);
  console.log(`  平均L*: ${avgLStar2.toFixed(2)}`);
  console.log(`  计算Agtron: ${result2.agtron}`);
  console.log(`  预期Agtron: ${expected2.agtron}`);
  console.log('');

  // 测试用例3: 边界情况 - 极端差异
  const extremeSamples: Lab[] = [
    { l: 10.0, a: 5, b: 10 }, // 极深烘
    { l: 60.0, a: 0, b: 5 }, // 极浅烘
    { l: 25.0, a: 10, b: 15 },
    { l: 25.0, a: 10, b: 15 },
    { l: 25.0, a: 10, b: 15 },
  ];
  const avgLStar3 = extremeSamples.reduce((sum, lab) => sum + lab.l, 0) / 5;
  const result3 = calculateAgtronFromLabs(extremeSamples);
  const expected3 = calculateAgtron(avgLStar3);
  const test3Passed = Math.abs(result3.agtron - expected3.agtron) <= 2;

  console.log(
    `${test3Passed ? '✓' : '✗'} 测试3: 极端差异（包含极浅和极深烘）`
  );
  console.log(`  L*值: ${extremeSamples.map((s) => s.l.toFixed(2)).join(', ')}`);
  console.log(`  平均L*: ${avgLStar3.toFixed(2)}`);
  console.log(`  计算Agtron: ${result3.agtron}`);
  console.log(`  预期Agtron: ${expected3.agtron}`);
  console.log('');

  const passed =
    (test1Passed ? 1 : 0) + (test2Passed ? 1 : 0) + (test3Passed ? 1 : 0);
  const failed = 3 - passed;

  console.log(`多点采样测试完成: ${passed}/3 通过\n`);

  return {
    passed,
    failed,
  };
}

/**
 * 运行所有Agtron测试
 */
export function runAllAgtronTests(): void {
  console.log('==========================================');
  console.log('Agtron值计算测试套件');
  console.log('==========================================\n');

  const uccResults = runUCCCStandardTests();
  const interpResults = runInterpolationTests();
  const boundaryResults = runBoundaryTests();
  const multiSampleResults = runMultiSampleTests();

  const totalPassed =
    uccResults.passed +
    interpResults.passed +
    boundaryResults.passed +
    multiSampleResults.passed;
  const totalTests =
    uccResults.passed +
    uccResults.failed +
    interpResults.passed +
    interpResults.failed +
    boundaryResults.passed +
    boundaryResults.failed +
    multiSampleResults.passed +
    multiSampleResults.failed;

  console.log('==========================================');
  console.log(`总结: ${totalPassed}/${totalTests} 测试通过`);
  console.log('==========================================');
}

// 如果直接运行此文件（开发环境测试）
if (typeof module !== 'undefined' && require.main === module) {
  runAllAgtronTests();
}

