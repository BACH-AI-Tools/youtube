#!/usr/bin/env node

/**
 * YouTube138 MCP 服务器
 * 提供 YouTube 搜索相关功能的 MCP 工具集
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

// RapidAPI 配置
const RAPIDAPI_HOST = "youtube138.p.rapidapi.com";
const RAPIDAPI_BASE_URL = `https://${RAPIDAPI_HOST}`;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";

// 创建 MCP 服务器实例
const server = new Server(
  {
    name: "youtube138-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * 调用 YouTube138 API 的通用函数
 * 
 * @param {string} endpoint - API 端点路径
 * @param {object} params - 查询参数
 * @returns {Promise<object>} API 响应的 JSON 数据
 */
async function callYouTubeAPI(endpoint, params = {}) {
  if (!RAPIDAPI_KEY) {
    throw new Error("未设置 RAPIDAPI_KEY 环境变量。请先设置您的 RapidAPI 密钥。");
  }

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
    return response.data;
  } catch (error) {
    return {
      error: `API 请求失败: ${error.message}`,
      status_code: error.response?.status || null,
      details: error.response?.data || null,
    };
  }
}

/**
 * 列出所有可用的工具
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search",
        description: "搜索 YouTube 视频。可以按关键词搜索视频内容，返回相关视频列表。",
        inputSchema: {
          type: "object",
          properties: {
            q: {
              type: "string",
              description: "搜索关键词，例如：'编程教程'、'音乐'等",
            },
            hl: {
              type: "string",
              description: "语言代码（可选），例如：'en'（英语）、'zh'（中文），默认为 'en'",
              default: "en",
            },
            gl: {
              type: "string",
              description: "国家/地区代码（可选），例如：'US'、'CN'，默认为 'US'",
              default: "US",
            },
          },
          required: ["q"],
        },
      },
      {
        name: "auto_complete",
        description: "YouTube 搜索自动完成建议。根据输入的关键词获取搜索建议列表。",
        inputSchema: {
          type: "object",
          properties: {
            q: {
              type: "string",
              description: "搜索关键词前缀，例如：'pyth'、'java'",
            },
            hl: {
              type: "string",
              description: "语言代码（可选），例如：'en'（英语）、'zh'（中文），默认为 'en'",
              default: "en",
            },
            gl: {
              type: "string",
              description: "国家/地区代码（可选），例如：'US'、'CN'，默认为 'US'",
              default: "US",
            },
          },
          required: ["q"],
        },
      },
      {
        name: "home",
        description: "获取 YouTube 首页推荐内容。返回 YouTube 首页的推荐视频列表。",
        inputSchema: {
          type: "object",
          properties: {
            hl: {
              type: "string",
              description: "语言代码（可选），例如：'en'（英语）、'zh'（中文），默认为 'en'",
              default: "en",
            },
            gl: {
              type: "string",
              description: "国家/地区代码（可选），例如：'US'、'CN'，默认为 'US'",
              default: "US",
            },
          },
          required: [],
        },
      },
    ],
  };
});

/**
 * 处理工具调用请求
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error("缺少必需参数");
  }

  let endpoint;
  let params = {};

  // 根据工具名称映射到 API 端点
  switch (name) {
    case "search":
      if (!args.q) {
        throw new Error("缺少必需参数: q");
      }
      endpoint = "/search/";
      params = {
        q: args.q,
        hl: args.hl || "en",
        gl: args.gl || "US",
      };
      break;

    case "auto_complete":
      if (!args.q) {
        throw new Error("缺少必需参数: q");
      }
      endpoint = "/auto-complete/";
      params = {
        q: args.q,
        hl: args.hl || "en",
        gl: args.gl || "US",
      };
      break;

    case "home":
      endpoint = "/home/";
      params = {
        hl: args.hl || "en",
        gl: args.gl || "US",
      };
      break;

    default:
      throw new Error(`未知的工具: ${name}`);
  }

  // 调用 API
  const result = await callYouTubeAPI(endpoint, params);

  // 返回格式化的结果
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
});

/**
 * 启动服务器
 */
async function main() {
  // 检查 API 密钥
  if (!RAPIDAPI_KEY) {
    console.error("警告: 未设置 RAPIDAPI_KEY 环境变量");
    console.error("请使用以下命令设置:");
    console.error("  Windows (PowerShell): $env:RAPIDAPI_KEY='your-api-key'");
    console.error("  Windows (CMD): set RAPIDAPI_KEY=your-api-key");
    console.error("  Linux/Mac: export RAPIDAPI_KEY='your-api-key'");
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("YouTube138 MCP 服务器已启动");
}

main().catch((error) => {
  console.error("服务器启动失败:", error);
  process.exit(1);
});

