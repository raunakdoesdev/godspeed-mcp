/**
 * Godspeed API Helper Functions
 * Based on the documentation from https://godspeedapp.com/guides/api
 */

import {
    Task,
    CreateTaskParams,
    UpdateTaskParams,
    ListTasksParams,
    ApiResponse,
    PaginatedResponse,
    TaskList,
    DuplicateListParams
} from './types.js';

const API_BASE_URL = 'https://api.godspeedapp.com';

/**
 * API class for interacting with the Godspeed API
 */
export class GodspeedAPI {
    private authToken: string | undefined;

    /**
     * Initialize the API client
     */
    constructor() {
        // Token-only authentication
    }

    /**
     * Set the authentication token
     * @param token The authentication token to use for API requests
     */
    setAuthToken(token: string): void {
        this.authToken = token;
    }

    /**
     * Get the authentication headers for API requests
     */
    private getAuthHeaders(): HeadersInit {
        if (!this.authToken) {
            throw new Error('Authentication token is required. Use setAuthToken() method to set it.');
        }

        return {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json',
        };
    }

    /**
     * Create a new task
     * @param params Parameters for creating a task
     * @returns The created task
     */
    async createTask(params: CreateTaskParams): Promise<ApiResponse<Task>> {
        try {
            const headers = this.getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers,
                body: JSON.stringify(params),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create task');
            }

            return data;
        } catch (error) {
            throw new Error(`Create task error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Update an existing task
     * @param params Parameters for updating a task
     * @returns The updated task
     */
    async updateTask(params: UpdateTaskParams): Promise<ApiResponse<Task>> {
        try {
            const headers = this.getAuthHeaders();

            // Validate required parameters
            if (!params.id) {
                throw new Error('Task ID is required');
            }

            // Validate conflicting date parameters
            if (params.due_at && params.timeless_due_at) {
                throw new Error('Cannot specify both due_at and timeless_due_at');
            }

            if (params.snoozed_until && params.timeless_snoozed_until) {
                throw new Error('Cannot specify both snoozed_until and timeless_snoozed_until');
            }

            if (params.starts_at && params.timeless_starts_at) {
                throw new Error('Cannot specify both starts_at and timeless_starts_at');
            }

            // Validate timeless date formats if provided
            if (params.timeless_due_at && !/^\d{4}-\d{2}-\d{2}$/.test(params.timeless_due_at)) {
                throw new Error('timeless_due_at must be formatted as YYYY-MM-DD');
            }

            if (params.timeless_snoozed_until && !/^\d{4}-\d{2}-\d{2}$/.test(params.timeless_snoozed_until)) {
                throw new Error('timeless_snoozed_until must be formatted as YYYY-MM-DD');
            }

            if (params.timeless_starts_at && !/^\d{4}-\d{2}-\d{2}$/.test(params.timeless_starts_at)) {
                throw new Error('timeless_starts_at must be formatted as YYYY-MM-DD');
            }

            // Validate duration_minutes if provided
            if (params.duration_minutes !== undefined && (!Number.isInteger(params.duration_minutes) || params.duration_minutes < 0)) {
                throw new Error('duration_minutes must be a positive integer');
            }

            const { id, ...updateData } = params;

            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update task');
            }

            return data;
        } catch (error) {
            throw new Error(`Update task error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get a task by ID
     * @param id The task ID
     * @returns The task
     */
    async getTask(id: string): Promise<ApiResponse<Task>> {
        try {
            if (!id) {
                throw new Error('Task ID is required');
            }

            const headers = this.getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'GET',
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get task');
            }

            return data;
        } catch (error) {
            throw new Error(`Get task error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Delete a task by ID
     * @param id The task ID
     * @returns Success response
     */
    async deleteTask(id: string): Promise<ApiResponse<null>> {
        try {
            // Validate required parameters
            if (!id) {
                throw new Error('Task ID is required');
            }

            const headers = this.getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete task');
            }

            return data;
        } catch (error) {
            throw new Error(`Delete task error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * List tasks with optional filters
     * @param params Query parameters for filtering tasks
     * @returns List of tasks (up to 250)
     */
    async listTasks(params?: ListTasksParams): Promise<ApiResponse<Task[]>> {
        try {
            const headers = this.getAuthHeaders();

            // Build query string from params
            const queryParams = params
                ? Object.entries(params)
                    .filter(([_, value]) => value !== undefined)
                    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
                    .join('&')
                : '';

            const url = `${API_BASE_URL}/tasks${queryParams ? `?${queryParams}` : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to list tasks');
            }

            return data;
        } catch (error) {
            throw new Error(`List tasks error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get all task lists
     * @returns Array of task lists
     */
    async getTaskLists(): Promise<ApiResponse<TaskList[]>> {
        try {
            const headers = this.getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/lists`, {
                method: 'GET',
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get task lists');
            }

            return data;
        } catch (error) {
            throw new Error(`Get task lists error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Mark a task as complete
     * @param id The task ID
     * @returns The updated task
     */
    async completeTask(id: string): Promise<ApiResponse<Task>> {
        return this.updateTask({ id, is_complete: true });
    }

    /**
     * Mark a task as incomplete
     * @param id The task ID
     * @returns The updated task
     */
    async uncompleteTask(id: string): Promise<ApiResponse<Task>> {
        return this.updateTask({ id, is_complete: false });
    }

    /**
     * Duplicate a list and all its tasks
     * @param listId The ID of the list to duplicate
     * @param params Optional parameters for the duplicated list
     * @returns The newly created list
     */
    async duplicateList(listId: string, params?: DuplicateListParams): Promise<ApiResponse<TaskList>> {
        try {
            if (!listId) {
                throw new Error('List ID is required');
            }

            const headers = this.getAuthHeaders();

            const response = await fetch(`${API_BASE_URL}/lists/${listId}/duplicate`, {
                method: 'POST',
                headers,
                body: JSON.stringify(params || {}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to duplicate list');
            }

            return data;
        } catch (error) {
            throw new Error(`Duplicate list error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Create a Godspeed API client
 * @returns GodspeedAPI instance
 */
export function createGodspeedClient(): GodspeedAPI {
    return new GodspeedAPI();
}
