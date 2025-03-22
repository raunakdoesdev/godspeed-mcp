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

## Cursor MCP Configuration

For Windows, create a file at `%USERPROFILE%\.cursor\mcp.json` with the following structure:

```json
{
    "mcpServers": {
        "godspeed-mcp": {
            "command": "cmd /c",
            "args": [
                "godspeed-mcp",
                "--token=your-godspeed-api-token"
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
            "args": [
                "godspeed-mcp"
            ],
            "env": {
                "GODSPEED_TOKEN": "your-godspeed-api-token"
            }
        }
    }
}
```

## Features

This MCP connector provides the following task management tools:

- List all tasks
- Get task details
- Create new tasks
- Update existing tasks
- Delete tasks
- Complete/uncomplete tasks
- Get task lists

## License

MIT
