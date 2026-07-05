import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as z from 'zod/v4';
import SearchEngine from './search-engine.js';
import ErrorHandler from './error-handler.js';

// MCP uses stdio transport; keep informational logs off stdout.
console.log = (...args) => console.error('[findskills]', ...args);

const searchEngine = new SearchEngine();

function textResult(data) {
  return {
    content: [{
      type: 'text',
      text: typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    }]
  };
}

function handleResult(result) {
  if (ErrorHandler.isSuccess(result)) {
    return textResult(result.data);
  }
  return textResult({ error: result.error });
}

const server = new McpServer({
  name: 'findskills',
  version: '1.0.4'
});

server.registerTool('search_skills', {
  description: 'Search OpenClaw and Agent skills across ClawHub, GitHub, and other sources.',
  inputSchema: {
    query: z.string().describe('Search keywords (Chinese or English)'),
    limit: z.number().optional().describe('Maximum number of results (default 10)'),
    sort: z.string().optional().describe('Sort order, e.g. relevance or downloads'),
    source: z.string().optional().describe('Optional source name, e.g. clawhub or github')
  }
}, async ({ query, limit = 10, sort = 'relevance', source }) => {
  const result = source
    ? await searchEngine.searchFrom(source, query, { limit, sort })
    : await searchEngine.search(query, { limit, sort });
  return handleResult(result);
});

server.registerTool('get_skill_info', {
  description: 'Get detailed information for a skill by name or slug.',
  inputSchema: {
    slug: z.string().describe('Skill name or slug')
  }
}, async ({ slug }) => handleResult(await searchEngine.getSkillDetails(slug)));

server.registerTool('get_related_skills', {
  description: 'Recommend skills related to a given skill.',
  inputSchema: {
    slug: z.string().describe('Skill name or slug'),
    limit: z.number().optional().describe('Maximum number of results (default 10)')
  }
}, async ({ slug, limit = 10 }) =>
  handleResult(await searchEngine.getRelatedSkills(slug, { limit }))
);

server.registerTool('recommend_skills', {
  description: 'Recommend skills based on user interests.',
  inputSchema: {
    interests: z.array(z.string()).describe('List of interest keywords'),
    limit: z.number().optional().describe('Maximum number of results (default 10)')
  }
}, async ({ interests, limit = 10 }) =>
  handleResult(await searchEngine.recommendForUser(interests, { limit }))
);

server.registerTool('get_popular_skills', {
  description: 'List popular skills ranked by downloads and quality.',
  inputSchema: {
    limit: z.number().optional().describe('Maximum number of results (default 10)')
  }
}, async ({ limit = 10 }) =>
  handleResult(await searchEngine.getPopularSkills({ limit }))
);

server.registerTool('check_skill_sources', {
  description: 'Check availability of configured skill sources.',
  inputSchema: {}
}, async () => handleResult(await searchEngine.checkSourcesAvailability()));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('MCP server error:', error);
  process.exit(1);
});
