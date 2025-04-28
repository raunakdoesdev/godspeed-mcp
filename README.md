[![MseeP.ai Security Assessment Badge](https://mseep.net/mseep-audited.png)](https://mseep.ai/app/alinagy-godspeed-mcp)

# Godspeed MCP

A Model Context Protocol connector for the Godspeed Task Management API.

## Installation

You can use this tool without installation via npx:

```bash
npx godspeed-mcp
```

Or install it globally:

```bash
npm install -g godspeed-mcp
```

## Configuration

### Authentication Token

The Godspeed API token can be provided in two ways:

1. Environment variable: `GODSPEED_TOKEN`
2. Command line argument: `--token=YOUR_TOKEN` or `-t YOUR_TOKEN`

### Empty List ID (Optional)

For creating new task lists, you can configure an empty list ID to use as a template:

1. Environment variable: `GODSPEED_EMPTY_LIST_ID`
2. Command line argument: `--empty-list-id=YOUR_LIST_ID` or `-e YOUR_LIST_ID`

If not provided, you'll need to specify the empty list ID when creating new lists.

## Cursor MCP Configuration

For Windows, create a file at `%USERPROFILE%\.cursor\mcp.json` with the following structure:

```json
{
  "mcpServers": {
    "godspeed-mcp": {
      "command": "cmd /c",
      "args": [
        "godspeed-mcp",
        "--token=your-godspeed-api-token",
        "--empty-list-id=your-empty-list-id" // Optional
      ]
    }
  }
}
```

For Mac/Linux, create a file at `~/.cursor/mcp.json` with this structure:

```json
{
  "mcpServers": {
    "godspeed-mcp": {
      "command": "npx",
      "args": ["godspeed-mcp"],
      "env": {
        "GODSPEED_TOKEN": "your-godspeed-api-token",
        "GODSPEED_EMPTY_LIST_ID": "your-empty-list-id" // Optional
      }
    }
  }
}
```

## Features

This MCP connector provides the following task management tools:

- List all tasks
- Get task details
- Create new tasks (single or bulk up to 60 tasks)
- Update existing tasks
- Delete tasks
- Complete/uncomplete tasks
- Get task lists
- Create new task lists (by duplicating a template)
- Duplicate existing lists

## License

MIT
