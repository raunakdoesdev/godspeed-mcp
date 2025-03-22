/**
 * Types for the Godspeed API
 */

// Task related types
export interface Task {
    id?: string;
    title: string;
    list_id: string;
    location?: string;
    notes?: string;
    due_at?: Date;
    label_names?: string[];
    completed?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateTaskParams {
    title: string;
    list_id: string;
    location?: string;
    notes?: string;
    due_at?: Date;
    label_names?: string[];
}

export interface UpdateTaskParams {
    id: string;
    title?: string;
    list_id?: string;
    location?: string;
    notes?: string;
    due_at?: Date;
    label_names?: string[];
    completed?: boolean;
}

export interface TaskList {
    id: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

// Query parameters for listing tasks
export interface ListTasksParams {
    page?: number;
    page_size?: number;
    list_id?: string;
    completed?: boolean;
}

// API Response types
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
} 