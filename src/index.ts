import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { GodspeedAPI } from "./godspeed.js";

// Get token from environment variable
const token = process.env.GODSPEED_TOKEN;

if (!token) {
    console.error('Error: GODSPEED_TOKEN environment variable is required');
    process.exit(1);
}

const server = new McpServer({
    name: "godspeed-mcp",
    version: "1.0.0",
});

// Initialize Godspeed API client
const godspeedApi = new GodspeedAPI({ username: "", password: "" });
godspeedApi.setAuthToken(token);

// Add tools for Godspeed API operations
server.tool(
    "listTasks",
    {
        page: z.number().optional(),
        page_size: z.number().optional(),
        list_id: z.string().optional(),
        completed: z.boolean().optional()
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
        list_id: z.string(),
        location: z.string().optional(),
        notes: z.string().optional(),
        due_at: z.date().optional(),
        label_names: z.array(z.string()).optional()
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
        list_id: z.string().optional(),
        location: z.string().optional(),
        notes: z.string().optional(),
        due_at: z.date().optional(),
        label_names: z.array(z.string()).optional(),
        completed: z.boolean().optional()
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
    {},
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

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch(console.error);
