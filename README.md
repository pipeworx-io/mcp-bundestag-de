# mcp-bundestag-de

Bundestag DIP MCP

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_activities` | Combined activity feed across Bundestag and Bundesrat. |
| `search_drucksachen` | Search printed documents (bills, motions, answers). |
| `get_drucksache` | Drucksache (printed document) detail by id. |
| `search_plenarprotokolle` | Plenary meeting transcripts. |
| `get_plenarprotokoll` | Plenary protocol detail. |
| `search_persons` | Search people referenced in DIP (members, ministers, witnesses). |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
