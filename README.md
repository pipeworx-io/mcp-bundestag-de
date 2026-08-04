# @pipeworx/bundestag-de

German Bundestag MCP — DIP (Documentation and Information System) API. Plenary minutes, bills, parliamentary questions, members.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Bundestag De data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
