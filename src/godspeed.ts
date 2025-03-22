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
    TaskList
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
     * List tasks with pagination and optional filters
     * @param params Query parameters for filtering tasks
     * @returns Paginated list of tasks
     */
    async listTasks(params?: ListTasksParams): Promise<PaginatedResponse<Task>> {
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
        return this.updateTask({ id, completed: true });
    }

    /**
     * Mark a task as incomplete
     * @param id The task ID
     * @returns The updated task
     */
    async uncompleteTask(id: string): Promise<ApiResponse<Task>> {
        return this.updateTask({ id, completed: false });
    }
}

/**
 * Create a Godspeed API client
 * @returns GodspeedAPI instance
 */
export function createGodspeedClient(): GodspeedAPI {
    return new GodspeedAPI();
}
