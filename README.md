# Markd MCP Server

An official [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that brings Markd straight into your AI coding workflow.

## 🚀 Why this exists: stop burning context tokens

Ask an AI like Claude or GPT-4 to read a webpage, and it usually ends up chewing through raw HTML. That raw HTML can easily run 25,000 to 30,000 tokens once you count inline styles, tracking scripts, and bloated DOM markup.

Markd fixes that. It spins up a headless Chrome browser (via Puppeteer) in the background, fully renders the page (JavaScript included), and pulls out just the real content using Mozilla Readability and Turndown.

That same article, converted to clean Markdown, comes out to around 2,000 to 2,500 tokens. That's roughly a 90% drop in token usage every time your AI pulls something off the web. Faster responses, cheaper API bills, and a lot less noise clogging up the context window.

## 🛠️ What it gives your AI

One tool, does the job well:

- **`extract_markdown`**
  - Input: `{ url: "string" }`
  - What it does: fetches the URL, renders it fully, and hands back the main article as clean Markdown.

## 💻 Running it locally

Haven't published to NPM yet? No problem, just run it from source.

### 1. Install

```bash
git clone https://github.com/mayankfulwariya/markd-mcp.git
cd markd-mcp
npm install
npx puppeteer browsers install chrome
```

### 2. Point your AI client at it

**Claude Code**

Add this to your `claude.json`, or use the `claude mcp add` command:

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

**Claude Desktop**

Same snippet, different file:

- Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Just swap in the real path to wherever you cloned the repo.

## 🌍 Running it via NPM

Once it's published, skip the clone entirely:

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

## Under the hood

- **Puppeteer** – renders JS-heavy sites (React, Next.js docs, that kind of thing) fully before anything gets extracted.
- **Mozilla Readability** – the same engine behind Firefox's Reader View. Strips out sidebars, headers, footers, ads, all the junk.
- **Turndown** – turns the clean HTML into proper Markdown.
