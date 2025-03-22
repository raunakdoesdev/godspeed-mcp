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

## Setup

You need to set the GODSPEED_TOKEN environment variable:

```bash
export GODSPEED_TOKEN="your-godspeed-api-token"
```

For Windows:

```cmd
set GODSPEED_TOKEN=your-godspeed-api-token
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

## Usage in AI Assistants

You can integrate Godspeed tasks with AI assistants that support MCP. The connector enables assistants to:

- Manage your to-do list
- Create and organize tasks
- Track completion status
- Set reminders and due dates

## License

MIT
