#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { GodspeedAPI } from "./godspeed.js";

// Parse command line arguments
let tokenArg: string | undefined;
for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--token' || process.argv[i] === '-t') {
        tokenArg = process.argv[i + 1];
        break;
    } else if (process.argv[i].startsWith('--token=')) {
        tokenArg = process.argv[i].substring(8);
        break;
    }
}

// Get token from environment variable or command line argument
const token = tokenArg || process.env.GODSPEED_TOKEN;

if (!token) {
    console.error('Error: GODSPEED_TOKEN environment variable or --token argument is required');
    console.error('Usage: godspeed-mcp --token=YOUR_TOKEN or -t YOUR_TOKEN');
    process.exit(1);
}

const server = new McpServer({
    name: "godspeed-mcp",
    version: "1.0.0",
});

// Initialize Godspeed API client
const godspeedApi = new GodspeedAPI();
godspeedApi.setAuthToken(token);

// Add tools for Godspeed API operations
server.tool(
    "listTasks",
    {
        status: z.enum(["incomplete", "complete"]).optional(),
        list_id: z.string().optional(),
        updated_before: z.string().optional(),
        updated_after: z.string().optional()
    },
    async (params) => {
        try {
            const result = await godspeedApi.listTasks(params);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }]
            };
        }
    }
);

server.tool(
    "getTask",
    {
        id: z.string()
    },
    async ({ id }) => {
        try {
            const result = await godspeedApi.getTask(id);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }]
            };
        }
    }
);

server.tool(
    "createTask",
    {
        title: z.string(),
        list_id: z.string().optional(),
        location: z.enum(["start", "end"]).optional(),
        notes: z.string().optional(),
        due_at: z.date().optional(),
        timeless_due_at: z.string().optional(),
        starts_at: z.date().optional(),
        timeless_starts_at: z.string().optional(),
        duration_minutes: z.number().int().nonnegative().optional(),
        label_names: z.array(z.string()).optional(),
        label_ids: z.array(z.string()).optional(),
        metadata: z.record(z.any()).optional()
    },
    async (params) => {
        try {
            const result = await godspeedApi.createTask(params);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }]
            };
        }
    }
);

server.tool(
    "updateTask",
    {
        id: z.string(),
        title: z.string().optional(),
        notes: z.string().optional(),
        due_at: z.date().optional(),
        timeless_due_at: z.string().optional(),
        snoozed_until: z.date().optional(),
        timeless_snoozed_until: z.string().optional(),
        starts_at: z.date().optional(),
        timeless_starts_at: z.string().optional(),
        duration_minutes: z.number().int().nonnegative().optional(),
        is_complete: z.boolean().optional(),
        is_cleared: z.boolean().optional(),
        add_label_names: z.array(z.string()).optional(),
        add_label_ids: z.array(z.string()).optional(),
        remove_label_names: z.array(z.string()).optional(),
        remove_label_ids: z.array(z.string()).optional(),
        metadata: z.record(z.any()).optional()
    },
    async (params) => {
        try {
            const result = await godspeedApi.updateTask(params);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }]
            };
        }
    }
);

server.tool(
    "deleteTask",
    {
        id: z.string()
    },
    async ({ id }) => {
        try {
            const result = await godspeedApi.deleteTask(id);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }]
            };
        }
    }
);

server.tool(
    "completeTask",
    {
        id: z.string()
    },
    async ({ id }) => {
        try {
            const result = await godspeedApi.completeTask(id);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }]
            };
        }
    }
);

server.tool(
    "uncompleteTask",
    {
        id: z.string()
    },
    async ({ id }) => {
        try {
            const result = await godspeedApi.uncompleteTask(id);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }]
            };
        }
    }
);

server.tool(
    "getTaskLists",
    {
        random_string: z.string()
    },
    async () => {
        try {
            const result = await godspeedApi.getTaskLists();
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }]
            };
        }
    }
);

server.tool(
    "duplicateList",
    {
        list_id: z.string(),
        name: z.string().optional()
    },
    async (params) => {
        try {
            const { list_id, name } = params;
            const result = await godspeedApi.duplicateList(list_id, name ? { name } : undefined);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }]
            };
        }
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch(console.error);
