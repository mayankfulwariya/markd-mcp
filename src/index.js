#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";

// Initialize the MCP server
const server = new Server(
  {
    name: "markd-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define the extraction tool
server.setRequestHandler({ method: "tools/list" }, async () => ({
  tools: [
    {
      name: "extract_markdown",
      description: "Fetches a URL, extracts the main article content, and converts it to clean, structured Markdown. Use this to save AI context tokens when reading web pages.",
      inputSchema: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The full URL of the webpage to extract (e.g., https://example.com/article)",
          },
        },
        required: ["url"],
      },
    },
  ],
}));

// Handle tool execution
server.setRequestHandler({ method: "tools/call" }, async (request) => {
  if (request.params.name === "extract_markdown") {
    const { url } = request.params.arguments;
    
    if (!url) {
      throw new Error("URL is required");
    }

    let browser;
    try {
      // 1. Fetch page using Puppeteer to ensure JS is executed
      browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      
      // Navigate and wait for network idle to ensure content is loaded
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      
      // Get the fully rendered HTML
      const html = await page.content();
      
      // 2. Parse the HTML using JSDOM
      const dom = new JSDOM(html, { url });
      
      // 3. Extract main content using Mozilla Readability
      const reader = new Readability(dom.window.document);
      const article = reader.parse();
      
      if (!article) {
        throw new Error("Could not extract article content from the provided URL.");
      }
      
      // 4. Convert semantic HTML to Markdown
      const turndownService = new TurndownService({
        headingStyle: "atx",
        codeBlockStyle: "fenced"
      });
      const markdown = turndownService.turndown(article.content);
      
      // Prepend title and author if available
      let finalMarkdown = `# ${article.title}\n\n`;
      if (article.byline) finalMarkdown += `**By:** ${article.byline}\n\n`;
      finalMarkdown += markdown;

      return {
        content: [{ type: "text", text: finalMarkdown }],
      };
    } catch (error) {
      console.error(`Error processing URL ${url}:`, error);
      return {
        content: [{ type: "text", text: `Error extracting markdown: ${error.message}` }],
        isError: true,
      };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  throw new Error("Tool not found");
});

// Start the server
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Markd MCP Server is running and listening on stdio");
}

run().catch((error) => {
  console.error("Fatal error starting server:", error);
  process.exit(1);
});
