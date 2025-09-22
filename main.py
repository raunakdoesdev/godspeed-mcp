#!/usr/bin/env python3
"""
Godspeed MCP Server using FastMCP

A Model Context Protocol server for the Godspeed Task Management API.
"""

import json
import os
from typing import Any, Dict, Optional

import httpx
from fastmcp import FastMCP


class GodspeedAPI:
    """Client for the Godspeed API"""

    def __init__(self):
        self.base_url = "https://api.godspeedapp.com"
        self.token: Optional[str] = os.environ["GODSPEED_TOKEN"]
        self.inbox_list_id: Optional[str] = os.environ["GODSPEED_LIST_ID"]
        self.client = httpx.AsyncClient()

    def set_auth_token(self, token: str):
        """Set the authentication token"""
        self.token = token
        self.client.headers.update({"Authorization": f"Bearer {token}"})

    async def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Make an authenticated request to the Godspeed API"""
        if not self.token:
            raise ValueError("No authentication token set")

        headers = kwargs.pop("headers", {})
        headers["Authorization"] = f"Bearer {self.token}"

        response = await self.client.request(
            method, f"{self.base_url}{endpoint}", headers=headers, **kwargs
        )

        if response.status_code == 429:
            raise Exception("Rate limit exceeded. Please try again later.")

        response.raise_for_status()
        return response.json()

    def _simplify_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Simplify task to only include id, title, and due_date"""
        return {
            "id": task.get("id"),
            "title": task.get("title"),
            "due_date": task.get("due_at"),
        }

    async def list_tasks(self) -> Dict[str, Any]:
        """List all tasks in the inbox"""
        result = await self._request(
            "GET",
            "/tasks",
            params={"list_id": self.inbox_list_id, "status": "incomplete"},
        )

        # Simplify the response to only include essential fields
        if "tasks" in result and isinstance(result["tasks"], list):
            simplified_tasks = [self._simplify_task(task) for task in result["tasks"]]
            return {"tasks": simplified_tasks}

        return result

    async def create_task(self, title: str) -> Dict[str, Any]:
        """Create a new task with just a title"""
        task_data = {"title": title, "list_id": self.inbox_list_id}
        result = await self._request("POST", "/tasks", json=task_data)

        if "data" in result:
            return {"task": self._simplify_task(result["data"])}

        return result

    async def update_task(
        self,
        task_id: str,
        title: Optional[str] = None,
        is_complete: Optional[bool] = None,
    ) -> Dict[str, Any]:
        """Update a task title or completion status"""
        update_data = {}
        if title is not None:
            update_data["title"] = title
        if is_complete is not None:
            update_data["is_complete"] = is_complete
        result = await self._request("PATCH", f"/tasks/{task_id}", json=update_data)

        # Simplify the response for updated task
        if "data" in result:
            return {"task": self._simplify_task(result["data"])}

        return result

    async def delete_task(self, task_id: str) -> Dict[str, Any]:
        """Delete a task"""
        return await self._request("DELETE", f"/tasks/{task_id}")


mcp = FastMCP(
    "Todo Management MCP",
    instructions="Use this to manage the user's task list. You can list tasks, create tasks, update tasks, and delete tasks.",
)

api_client = GodspeedAPI()


@mcp.tool()
async def list_tasks() -> str:
    """
    List all tasks in your inbox.

    Returns all tasks from your inbox list.
    """
    try:
        result = await api_client.list_tasks()
        return json.dumps(result, indent=2)
    except Exception as e:
        return f"Error: {str(e)}"


@mcp.tool()
async def create_task(title: str) -> str:
    """
    Create a new task in your inbox.

    Args:
        title: The title of the task (required)
    """
    try:
        result = await api_client.create_task(title)
        return json.dumps(result, indent=2)
    except Exception as e:
        return f"Error: {str(e)}"


@mcp.tool()
async def update_task(
    task_id: str,
    title: Optional[str] = None,
    is_complete: Optional[bool] = None,
) -> str:
    """
    Update a task's title or completion status.

    Args:
        task_id: The ID of the task to update (required)
        title: New title for the task (optional)
        is_complete: Mark task as complete (true) or incomplete (false) (optional)
    """
    try:
        result = await api_client.update_task(task_id, title, is_complete)
        return json.dumps(result, indent=2)
    except Exception as e:
        return f"Error: {str(e)}"


@mcp.tool()
async def delete_task(task_id: str) -> str:
    """
    Delete a task.

    Args:
        task_id: The ID of the task to delete
    """
    try:
        result = await api_client.delete_task(task_id)
        return json.dumps(result, indent=2)
    except Exception as e:
        return f"Error: {str(e)}"


if __name__ == "__main__":
    mcp.run(transport="sse", host="0.0.0.0", port=8000)
