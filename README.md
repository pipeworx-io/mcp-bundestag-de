# @pipeworx/bundestag-de

German Bundestag MCP — DIP (Documentation and Information System) API. Plenary minutes, bills, parliamentary questions, members.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

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

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

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
