# YouTube138 MCP 服务器

这是一个基于 Model Context Protocol (MCP) 的 YouTube138 API 服务器，提供了 3 个 YouTube 相关的工具。

## 功能特性

本 MCP 服务器提供以下 3 个工具：

1. **search** - 搜索 YouTube 视频，可以按关键词搜索视频内容
2. **auto_complete** - YouTube 搜索自动完成建议，根据输入获取搜索建议
3. **home** - 获取 YouTube 首页推荐内容

## 前置要求

- Node.js 18 或更高版本
- RapidAPI 账户和 API 密钥

## 安装步骤

### 1. 克隆或下载本项目

```bash
cd youtube
```

### 2. 安装依赖包

```bash
npm install
```

### 3. 设置 RapidAPI 密钥

首先，你需要在 [RapidAPI](https://rapidapi.com/Glavier/api/youtube138/) 上订阅 YouTube138 API 并获取你的 API 密钥。

然后设置环境变量：

**Linux/Mac:**
```bash
export RAPIDAPI_KEY='你的API密钥'
```

**Windows (PowerShell):**
```powershell
$env:RAPIDAPI_KEY='你的API密钥'
```

**Windows (CMD):**
```cmd
set RAPIDAPI_KEY=你的API密钥
```

## 使用方法

### 1. 直接运行服务器

```bash
npm start
```

### 2. 配置到 Claude Desktop

在 Claude Desktop 的配置文件中添加此服务器：

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**Mac/Linux:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "youtube138": {
      "command": "node",
      "args": ["E:\\mcp\\youtube\\index.js"],
      "env": {
        "RAPIDAPI_KEY": "你的API密钥"
      }
    }
  }
}
```

### 3. 配置到 Cherry Studio

在 Cherry Studio 中配置此服务器：

**方法1：通过界面配置**
1. 打开 Cherry Studio
2. 进入 `设置` → `模型上下文协议（MCP）`
3. 点击 `添加服务器`
4. 填写以下信息：
   - **名称**: youtube138
   - **命令**: `node`
   - **参数**: `E:\mcp\youtube\index.js`
   - **环境变量**: 
     - 键: `RAPIDAPI_KEY`
     - 值: `你的API密钥`

**方法2：直接编辑配置文件**

找到 Cherry Studio 的配置文件（通常在用户数据目录），添加以下配置：

```json
{
  "mcpServers": {
    "youtube138": {
      "command": "node",
      "args": [
        "E:\\mcp\\youtube\\index.js"
      ],
      "env": {
        "RAPIDAPI_KEY": "你的API密钥"
      },
      "disabled": false
    }
  }
}
```

**注意**：
- 请将 `E:\\mcp\\youtube\\index.js` 替换为你的实际项目路径
- 请将 `你的API密钥` 替换为你的实际 RapidAPI 密钥
- 配置完成后重启 Cherry Studio

### 4. 使用示例

配置完成后，重启客户端（Claude Desktop 或 Cherry Studio），你就可以使用以下命令：

- "搜索编程教程相关的 YouTube 视频"
- "帮我搜索关于人工智能的视频"
- "获取 YouTube 首页推荐内容"
- "查看当前 YouTube 热门视频"
- "搜索 'python' 的自动完成建议"

## API 参考

### 1. search - 搜索视频

搜索 YouTube 视频内容。

**参数：**
- `q` (必需): 搜索关键词，例如："编程教程"、"音乐"
- `hl` (可选): 语言代码，例如："en"（英语）、"zh"（中文），默认为 "en"
- `gl` (可选): 国家/地区代码，例如："US"、"CN"，默认为 "US"

**示例 cURL 命令：**
```bash
curl --request GET \
  --url 'https://youtube138.p.rapidapi.com/search/?q=despacito&hl=en&gl=US' \
  --header 'x-rapidapi-host: youtube138.p.rapidapi.com' \
  --header 'x-rapidapi-key: 你的API密钥'
```

### 2. auto_complete - 搜索自动完成

获取 YouTube 搜索的自动完成建议。

**参数：**
- `q` (必需): 搜索关键词前缀，例如："pyth"、"java"
- `hl` (可选): 语言代码，默认为 "en"
- `gl` (可选): 国家/地区代码，默认为 "US"

**示例 cURL 命令：**
```bash
curl --request GET \
  --url 'https://youtube138.p.rapidapi.com/auto-complete/?q=desp&hl=en&gl=US' \
  --header 'x-rapidapi-host: youtube138.p.rapidapi.com' \
  --header 'x-rapidapi-key: 你的API密钥'
```

### 3. home - 首页推荐

获取 YouTube 首页推荐内容。

**参数：**
- `hl` (可选): 语言代码，默认为 "en"
- `gl` (可选): 国家/地区代码，默认为 "US"

**示例 cURL 命令：**
```bash
curl --request GET \
  --url 'https://youtube138.p.rapidapi.com/home/?hl=en&gl=US' \
  --header 'x-rapidapi-host: youtube138.p.rapidapi.com' \
  --header 'x-rapidapi-key: 你的API密钥'
```


## 测试

项目包含测试脚本，用于测试所有接口功能：

```bash
npm test
```

测试脚本会依次测试：
1. Search（搜索）接口
2. Auto Complete（自动完成）接口
3. Home（首页）接口

## 故障排查

### 问题：API 调用失败

**解决方案:**
1. 确认你已经在 RapidAPI 上订阅了 YouTube138 API
2. 检查 RAPIDAPI_KEY 环境变量是否正确设置
3. 确认你的 RapidAPI 订阅仍然有效且未超出配额限制

### 问题：Claude 无法识别工具

**解决方案:**
1. 确认 claude_desktop_config.json 配置文件格式正确
2. 重启 Claude Desktop 应用
3. 检查 index.js 的路径是否正确
4. 确保已安装 Node.js 18 或更高版本

### 问题：npm install 失败

**解决方案:**
1. 确保 Node.js 版本为 18 或更高版本
2. 尝试清除 npm 缓存：`npm cache clean --force`
3. 删除 node_modules 文件夹和 package-lock.json，然后重新运行 `npm install`

## 技术架构

本项目基于以下技术：

- **MCP (Model Context Protocol)**: Anthropic 开发的协议，用于 AI 助手与外部工具的集成
- **Node.js**: JavaScript 运行时环境
- **axios**: HTTP 客户端库
- **RapidAPI**: YouTube138 API 的托管平台

## 项目结构

```
youtube/
├── index.js          # MCP 服务器主文件
├── package.json      # 项目配置和依赖
├── test.js          # 接口测试脚本
└── README.md        # 项目文档
```

## 许可证

本项目仅供学习和研究使用。使用 YouTube138 API 时，请遵守 YouTube 的服务条款和 RapidAPI 的使用政策。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 相关链接

- [YouTube138 API 文档](https://rapidapi.com/Glavier/api/youtube138/)
- [MCP 官方文档](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/desktop)
- [Node.js 官网](https://nodejs.org/)

