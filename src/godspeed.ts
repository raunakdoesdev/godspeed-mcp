/**
 * Godspeed API Helper Functions
 * Based on the documentation from https://godspeedapp.com/guides/api
 */

import {
    AuthCredentials,
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
    private username: string;
    private password: string;
    private authToken: string | undefined;

    /**
     * Initialize the API client with authentication credentials
     */
    constructor(credentials: AuthCredentials) {
        this.username = credentials.username;
        this.password = credentials.password;
    }

    /**
     * Set the authentication token directly
     * @param token The authentication token to use for API requests
     */
    setAuthToken(token: string): void {
        this.authToken = token;
    }

    /**
     * Authenticate with the Godspeed API
     * @returns The authentication token
     */
    async authenticate(): Promise<string> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.username,
                    password: this.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            this.authToken = data.token;

            if (!this.authToken) {
                throw new Error('Authentication token is missing from response');
            }

            return this.authToken;
        } catch (error) {
            throw new Error(`Authentication error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get the authentication headers for API requests
     */
    private async getAuthHeaders(): Promise<HeadersInit> {
        if (!this.authToken) {
            await this.authenticate();
        }

        // At this point, this.authToken should be defined from authenticate()
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
            const headers = await this.getAuthHeaders();

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
            const headers = await this.getAuthHeaders();
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
            const headers = await this.getAuthHeaders();

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
            const headers = await this.getAuthHeaders();

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
            const headers = await this.getAuthHeaders();

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
            const headers = await this.getAuthHeaders();

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
     * Mark a task as completed
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
 * @param username API username
 * @param password API password
 * @returns GodspeedAPI instance
 */
export function createGodspeedClient(username: string, password: string): GodspeedAPI {
    return new GodspeedAPI({ username, password });
}

// Export individual functions for easier usage

/**
 * Create a new task
 * @param credentials API credentials
 * @param params Parameters for creating a task
 * @returns The created task
 */
export async function createTask(credentials: AuthCredentials, params: CreateTaskParams): Promise<ApiResponse<Task>> {
    const api = new GodspeedAPI(credentials);
    return api.createTask(params);
}

/**
 * Update an existing task
 * @param credentials API credentials
 * @param params Parameters for updating a task
 * @returns The updated task
 */
export async function updateTask(credentials: AuthCredentials, params: UpdateTaskParams): Promise<ApiResponse<Task>> {
    const api = new GodspeedAPI(credentials);
    return api.updateTask(params);
}

/**
 * Get a task by ID
 * @param credentials API credentials
 * @param id The task ID
 * @returns The task
 */
export async function getTask(credentials: AuthCredentials, id: string): Promise<ApiResponse<Task>> {
    const api = new GodspeedAPI(credentials);
    return api.getTask(id);
}

/**
 * Delete a task by ID
 * @param credentials API credentials
 * @param id The task ID
 * @returns Success response
 */
export async function deleteTask(credentials: AuthCredentials, id: string): Promise<ApiResponse<null>> {
    const api = new GodspeedAPI(credentials);
    return api.deleteTask(id);
}

/**
 * List tasks with pagination and optional filters
 * @param credentials API credentials
 * @param params Query parameters for filtering tasks
 * @returns Paginated list of tasks
 */
export async function listTasks(credentials: AuthCredentials, params?: ListTasksParams): Promise<PaginatedResponse<Task>> {
    const api = new GodspeedAPI(credentials);
    return api.listTasks(params);
}

/**
 * Get all task lists
 * @param credentials API credentials
 * @returns Array of task lists
 */
export async function getTaskLists(credentials: AuthCredentials): Promise<ApiResponse<TaskList[]>> {
    const api = new GodspeedAPI(credentials);
    return api.getTaskLists();
}

/**
 * Mark a task as completed
 * @param credentials API credentials
 * @param id The task ID
 * @returns The updated task
 */
export async function completeTask(credentials: AuthCredentials, id: string): Promise<ApiResponse<Task>> {
    const api = new GodspeedAPI(credentials);
    return api.completeTask(id);
}

/**
 * Mark a task as incomplete
 * @param credentials API credentials
 * @param id The task ID
 * @returns The updated task
 */
export async function uncompleteTask(credentials: AuthCredentials, id: string): Promise<ApiResponse<Task>> {
    const api = new GodspeedAPI(credentials);
    return api.uncompleteTask(id);
}
