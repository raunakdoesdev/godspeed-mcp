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
    timeless_due_at?: string;
    starts_at?: Date;
    timeless_starts_at?: string;
    duration_minutes?: number;
    label_names?: string[];
    label_ids?: string[];
    metadata?: Record<string, any>;
    completed?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateTaskParams {
    title: string;
    list_id?: string;
    location?: 'start' | 'end';
    notes?: string;
    due_at?: Date;
    timeless_due_at?: string;
    starts_at?: Date;
    timeless_starts_at?: string;
    duration_minutes?: number;
    label_names?: string[];
    label_ids?: string[];
    metadata?: Record<string, any>;
}

export interface UpdateTaskParams {
    id: string;
    title?: string;
    notes?: string;
    due_at?: Date;
    timeless_due_at?: string;
    snoozed_until?: Date;
    timeless_snoozed_until?: string;
    starts_at?: Date;
    timeless_starts_at?: string;
    duration_minutes?: number;
    is_complete?: boolean;
    is_cleared?: boolean;
    add_label_names?: string[];
    add_label_ids?: string[];
    remove_label_names?: string[];
    remove_label_ids?: string[];
    metadata?: Record<string, any>;
}

export interface TaskList {
    id: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

// Query parameters for listing tasks
export interface ListTasksParams {
    status?: 'incomplete' | 'complete';
    list_id?: string;
    updated_before?: string;
    updated_after?: string;
}

// API Response types
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    error?: string;
    lists?: Record<string, TaskList>;
    labels?: Record<string, Label>;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
}

export interface Label {
    id: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface DuplicateListParams {
    name?: string;
} 