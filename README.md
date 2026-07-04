# Markd MCP Server

An official [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that brings the power of **Markd** natively into your AI coding workflows. 

## 🚀 The Mission: Stop Wasting Context Tokens
When you ask an AI (like Claude or GPT-4) to read a webpage, it often tries to process raw HTML. A standard webpage's raw HTML can consume upwards of **25,000 to 30,000 tokens** due to massive inline styling, tracking scripts, and bloated DOM structures.

**Markd** acts as a filter. It quietly spins up a headless Chrome browser (Puppeteer) in the background to perfectly render any JavaScript-heavy page, and then extracts *only* the pure, semantic content using Mozilla Readability and Turndown.

The exact same article, extracted as clean Markdown, costs around **2,000 to 2,500 tokens**. By using this tool, you instantly achieve a **~90% reduction in token usage** when your AI researches the web—resulting in faster responses, cheaper API costs, and significantly less context degradation.

---

## 🛠️ Provided Tools

This server exposes a single, powerful tool to your AI:

- `extract_markdown`
  - **Input:** `{ url: "string" }`
  - **Description:** Fetches a URL, renders it fully, and returns the main article content as a clean Markdown string.

---

## 💻 How to Use (Local Setup)

If you haven't published this to NPM yet, you can run it directly from the source code.

### 1. Installation
Clone the repository and install the dependencies (including Puppeteer's Chrome binary):
```bash
git clone https://github.com/mayankfulwariya/markd-mcp.git
cd markd-mcp
npm install
npx puppeteer browsers install chrome
```

### 2. Configure Your AI Client

#### For Claude Code
Add the following to your `claude.json` configuration file, or use the `claude mcp add` command:

```json
{
  "mcpServers": {
    "markd-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/markd-mcp/src/index.js"]
    }
  }
}
```

#### For Claude Desktop
Add the same JSON snippet to your `claude_desktop_config.json` file:
- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

*(Make sure to replace `/absolute/path/to/...` with the actual path to where you cloned the folder!)*

---

## 🌍 How to Use (NPM Package)
*(If published to NPM)*

You can configure Claude to run it directly without cloning the repo:

```json
{
  "mcpServers": {
    "markd-mcp": {
      "command": "npx",
      "args": ["-y", "markd-mcp"]
    }
  }
}
```

---

## Under the Hood
- **Puppeteer:** Ensures modern JS-heavy sites (like React/Next.js documentation pages) are fully rendered before extraction.
- **Mozilla Readability:** The same engine that powers Firefox's Reader View, used to strip away sidebars, headers, footers, and ads.
- **Turndown:** Converts the semantic HTML perfectly into Markdown.
