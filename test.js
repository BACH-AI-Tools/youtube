#!/usr/bin/env node

/**
 * YouTube138 API 接口测试脚本
 * 测试所有 4 个 API 接口的功能
 */

import axios from "axios";

// RapidAPI 配置
const RAPIDAPI_HOST = "youtube138.p.rapidapi.com";
const RAPIDAPI_BASE_URL = `https://${RAPIDAPI_HOST}`;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";

// 颜色代码用于终端输出
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
};

/**
 * 调用 YouTube138 API
 */
async function callAPI(endpoint, params = {}) {
  const headers = {
    "X-RapidAPI-Host": RAPIDAPI_HOST,
    "X-RapidAPI-Key": RAPIDAPI_KEY,
  };

  const url = `${RAPIDAPI_BASE_URL}${endpoint}`;

  try {
    const response = await axios.get(url, {
      headers,
      params,
      timeout: 30000,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      details: error.response?.data,
    };
  }
}

/**
 * 打印测试结果
 */
function printResult(testName, result) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`${colors.blue}测试: ${testName}${colors.reset}`);
  console.log(`${"=".repeat(80)}`);

  if (result.success) {
    console.log(`${colors.green}✓ 测试通过${colors.reset}`);
    console.log("\n响应数据:");
    console.log(JSON.stringify(result.data, null, 2).substring(0, 1000));
    if (JSON.stringify(result.data).length > 1000) {
      console.log(`\n... (数据过长，仅显示前 1000 个字符)`);
    }
  } else {
    console.log(`${colors.red}✗ 测试失败${colors.reset}`);
    console.log(`错误信息: ${result.error}`);
    if (result.status) {
      console.log(`HTTP 状态码: ${result.status}`);
    }
    if (result.details) {
      console.log("详细信息:", JSON.stringify(result.details, null, 2));
    }
  }
}

/**
 * 测试 1: Search（搜索）接口
 */
async function testSearch() {
  const result = await callAPI("/search/", {
    q: "despacito",
    hl: "en",
    gl: "US",
  });
  printResult("Search（搜索）- 搜索关键词: despacito", result);
  return result.success;
}

/**
 * 测试 2: Auto Complete（自动完成）接口
 */
async function testAutoComplete() {
  const result = await callAPI("/auto-complete/", {
    q: "desp",
    hl: "en",
    gl: "US",
  });
  printResult("Auto Complete（自动完成）- 关键词前缀: desp", result);
  return result.success;
}

/**
 * 测试 3: Home（首页）接口
 */
async function testHome() {
  const result = await callAPI("/home/", {
    hl: "en",
    gl: "US",
  });
  printResult("Home（首页推荐）", result);
  return result.success;
}


/**
 * 主测试函数
 */
async function runTests() {
  console.log(`${colors.yellow}YouTube138 API 接口测试${colors.reset}`);
  console.log(`${"=".repeat(80)}\n`);

  // 检查 API 密钥
  if (!RAPIDAPI_KEY) {
    console.log(
      `${colors.red}错误: 未设置 RAPIDAPI_KEY 环境变量${colors.reset}`
    );
    console.log("\n请先设置 API 密钥:");
    console.log("  Windows (PowerShell): $env:RAPIDAPI_KEY='your-api-key'");
    console.log("  Windows (CMD): set RAPIDAPI_KEY=your-api-key");
    console.log("  Linux/Mac: export RAPIDAPI_KEY='your-api-key'");
    process.exit(1);
  }

  console.log(`使用的 API 密钥: ${RAPIDAPI_KEY.substring(0, 10)}...`);
  console.log(`API 主机: ${RAPIDAPI_HOST}\n`);

  // 运行所有测试
  const results = {
    search: false,
    autoComplete: false,
    home: false,
  };

  try {
    console.log(`${colors.blue}开始测试...${colors.reset}\n`);

    // 测试 1: Search
    results.search = await testSearch();
    await sleep(1000); // 避免请求过快

    // 测试 2: Auto Complete
    results.autoComplete = await testAutoComplete();
    await sleep(1000);

    // 测试 3: Home
    results.home = await testHome();

    // 打印测试摘要
    console.log(`\n${"=".repeat(80)}`);
    console.log(`${colors.yellow}测试摘要${colors.reset}`);
    console.log(`${"=".repeat(80)}`);

    const passedCount = Object.values(results).filter((r) => r).length;
    const totalCount = Object.keys(results).length;

    console.log(`\n总测试数: ${totalCount}`);
    console.log(
      `${colors.green}通过: ${passedCount}${colors.reset}`
    );
    console.log(
      `${colors.red}失败: ${totalCount - passedCount}${colors.reset}`
    );

    console.log("\n详细结果:");
    console.log(
      `  1. Search（搜索）:          ${results.search ? colors.green + "✓ 通过" : colors.red + "✗ 失败"}${colors.reset}`
    );
    console.log(
      `  2. Auto Complete（自动完成）: ${results.autoComplete ? colors.green + "✓ 通过" : colors.red + "✗ 失败"}${colors.reset}`
    );
    console.log(
      `  3. Home（首页）:            ${results.home ? colors.green + "✓ 通过" : colors.red + "✗ 失败"}${colors.reset}`
    );

    console.log(`\n${"=".repeat(80)}\n`);

    if (passedCount === totalCount) {
      console.log(
        `${colors.green}所有测试通过！✓${colors.reset}\n`
      );
      process.exit(0);
    } else {
      console.log(
        `${colors.red}部分测试失败，请检查错误信息${colors.reset}\n`
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n${colors.red}测试过程中发生错误:${colors.reset}`, error);
    process.exit(1);
  }
}

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 运行测试
runTests();

