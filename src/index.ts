interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Bundestag DIP MCP
 *
 * DIP = Dokumentations- und Informationssystem für Parlamentarische Vorgänge.
 *
 * Auth: ?apikey= query.  Bundestag publishes a widely-used demo key on
 * https://dip.bundestag.de/über-dip/hilfe/api which the pack uses as a
 * fallback when no key is supplied — but operators should register their
 * own key at the same URL.
 *
 * Docs: https://dip.bundestag.de/über-dip/hilfe/api
 */


const BASE = 'https://search.dip.bundestag.de/api/v1';
const PUBLIC_DEMO_KEY = 'rgsaY4U.oZRQKUHdJhF9qguHMkwCGIoLaSc3Bdgwod';

const tools: McpToolExport['tools'] = [
  {
    name: 'search_activities',
    description: 'Combined activity feed across Bundestag and Bundesrat.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Free-text — German recommended' },
        ressort: { type: 'string', description: 'Ministerium (e.g. "BMI")' },
        descriptor: { type: 'string', description: 'GND subject descriptor (e.g. "Klimaschutz")' },
        date_from: { type: 'string', description: 'YYYY-MM-DD' },
        date_to: { type: 'string', description: 'YYYY-MM-DD' },
        format: { type: 'string', description: 'json (default) | xml' },
        cursor: { type: 'string', description: 'Pagination cursor from prior page' },
        num: { type: 'number', description: '1-200 (default 50)' },
      },
    },
  },
  {
    name: 'search_drucksachen',
    description: 'Search printed documents (bills, motions, answers).',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        drucksachentyp: {
          type: 'string',
          description: 'Antrag | Gesetzentwurf | Beschlussempfehlung | Kleine Anfrage | …',
        },
        date_from: { type: 'string' },
        date_to: { type: 'string' },
        cursor: { type: 'string' },
        num: { type: 'number' },
      },
    },
  },
  {
    name: 'get_drucksache',
    description: 'Drucksache (printed document) detail by id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Drucksache id (numeric, as string)' } },
      required: ['id'],
    },
  },
  {
    name: 'search_plenarprotokolle',
    description: 'Plenary meeting transcripts.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        date_from: { type: 'string' },
        date_to: { type: 'string' },
        cursor: { type: 'string' },
        num: { type: 'number' },
      },
    },
  },
  {
    name: 'get_plenarprotokoll',
    description: 'Plenary protocol detail.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Plenarprotokoll id' } },
      required: ['id'],
    },
  },
  {
    name: 'search_persons',
    description: 'Search people referenced in DIP (members, ministers, witnesses).',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Name fragment' },
        cursor: { type: 'string' },
        num: { type: 'number' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim() || PUBLIC_DEMO_KEY;
  switch (name) {
    case 'search_activities':
      return dipQuery(apiKey, '/aktivitaet', args, ['ressort', 'descriptor']);
    case 'search_drucksachen':
      return dipQuery(apiKey, '/drucksache', args, ['drucksachentyp']);
    case 'get_drucksache':
      return dipGet(apiKey, `/drucksache/${encodeURIComponent(reqStr(args, 'id', '"123456"'))}`);
    case 'search_plenarprotokolle':
      return dipQuery(apiKey, '/plenarprotokoll', args, []);
    case 'get_plenarprotokoll':
      return dipGet(apiKey, `/plenarprotokoll/${encodeURIComponent(reqStr(args, 'id', '"123456"'))}`);
    case 'search_persons':
      return dipQuery(apiKey, '/person', args, []);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function dipQuery(
  apiKey: string,
  path: string,
  args: Record<string, unknown>,
  extras: string[],
) {
  const params = new URLSearchParams({
    apikey: apiKey,
    format: (args.format as string) ?? 'json',
  });
  params.set('f.aktualisiert.start', '1970-01-01T00:00:00.000+00:00');
  if (args.query) params.set('f.titel', String(args.query));
  if (args.date_from) params.set('f.datum.start', String(args.date_from));
  if (args.date_to) params.set('f.datum.end', String(args.date_to));
  if (args.cursor) params.set('cursor', String(args.cursor));
  if (args.num !== undefined) params.set('size', String(Math.min(200, Math.max(1, args.num as number))));
  for (const k of extras) {
    if (args[k]) params.set(`f.${k}`, String(args[k]));
  }
  return dipGet(apiKey, `${path}?${params}`, /*alreadyHasKey*/ true);
}

async function dipGet(apiKey: string, pathOrUrl: string, alreadyHasKey = false) {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${BASE}${pathOrUrl}`;
  const finalUrl = alreadyHasKey || url.includes('apikey=') ? url : `${url}${url.includes('?') ? '&' : '?'}apikey=${encodeURIComponent(apiKey)}&format=json`;
  const res = await fetch(finalUrl, {
    headers: { Accept: 'application/json' },
  });
  if (res.status === 401 || res.status === 403) throw new Error('Bundestag DIP: unauthorized — check key');
  if (res.status === 404) throw new Error('Bundestag DIP: not found');
  if (res.status === 429) throw new Error('Bundestag DIP: rate-limit (HTTP 429)');
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Bundestag DIP error: ${res.status} ${t.slice(0, 200)}`);
  }
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
