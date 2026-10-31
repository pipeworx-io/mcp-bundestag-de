# @pipeworx/bundestag-de

German Bundestag MCP — DIP (Documentation and Information System) API. Plenary minutes, bills, parliamentary questions, members.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1863+ live data sources. This is an independent, unofficial integration — not affiliated with, endorsed by, or published by the upstream provider.

## Tools

- `search_activities(query?, ressort?, descriptor?, date_from?, date_to?, format?, cursor?, num?)` — combined activity feed
- `search_drucksachen(query?, drucksachentyp?, date_from?, date_to?, cursor?, num?)` — Bundestag/Bundesrat printed documents (bills, motions, ...)
- `get_drucksache(id)` — printed document detail
- `search_plenarprotokolle(query?, date_from?, date_to?, cursor?, num?)` — plenary meeting transcripts
- `get_plenarprotokoll(id)` — plenary protocol detail
- `search_persons(query?, cursor?, num?)` — people referenced in DIP

## Auth

- **Platform key:** gateway env `PLATFORM_BUNDESTAG_KEY`
- **BYO:** `?_apiKey=<key>` after registering at https://dip.bundestag.de/über-dip/hilfe/api

A widely-known public demo key (`rgsaY4U.oZRQKUHdJhF9qguHMkwCGIoLaSc3Bdgwod`) works on the production API and is acceptable for read-only experimentation per Bundestag guidance.

## Data source

`https://search.dip.bundestag.de/api/v1/` — JSON, `apikey=` query param.

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "bundestag-de": {
      "url": "https://gateway.pipeworx.io/bundestag-de/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/bundestag-de/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1863+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/search_activities \
  -H 'Content-Type: application/json' \
  -d '{"query":"Klimawandel","ressort":"BMU","date_from":"2024-01-01","date_to":"2024-12-31","num":50}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/search_activities`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Run it from npm

`@pipeworx/mcp-bundestag-de` is a local stdio bridge to the Pipeworx gateway: your MCP client
starts it with `npx`, and it forwards every call to the same
`https://gateway.pipeworx.io/bundestag-de/mcp` endpoint shown above. It needs network access;
there is no offline mode.

```json
{
  "mcpServers": {
    "bundestag-de": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-bundestag-de"]
    }
  }
}
```

Without a key it calls anonymously, capped at 50 calls a day. A free account
raises that to 200 a day: get a key at https://pipeworx.io/signup and add
`"env": { "PIPEWORX_API_KEY": "<your key>" }` to the server entry.
The key is sent as a Bearer token, the same way a hosted connection sends it,
so calls are metered and billed exactly as they are there.

It lists **only** this pack's tools by default. Set `PIPEWORX_META_TOOLS=1` to
also list `ask_pipeworx` and the other gateway-wide tools.

Behind an HTTPS proxy: Node's built-in `fetch` does not read `HTTPS_PROXY` by
default. Newer Node releases honour it when `NODE_USE_ENV_PROXY=1` is set; check
your Node version's documentation.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Bundestag De data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
