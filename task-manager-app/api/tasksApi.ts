// Tasks API Service
import { API_BASE_URL, API_ENDPOINTS } from './config';
import { getAccessToken, refreshAccessToken } from './authApi';

// ============= TYPES =============
export interface Task {
  id: number;
  title: string;
  notes?: string;
  due_date: string;
  category: 'Work' | 'Personal';
  completed: boolean;
  user: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  notes?: string;
  due_date: string;
  category: 'Work' | 'Personal';
  completed?: boolean;
}

export interface UpdateTaskData {
  title?: string;
  notes?: string;
  due_date?: string;
  category?: 'Work' | 'Personal';
  completed?: boolean;
}

// ============= HELPER FUNCTIONS =============
const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const accessToken = await getAccessToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry with new token
      return fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`,
          ...options.headers,
        },
      });
    }
  }

  return response;
};

// ============= API CALLS =============

/**
 * Get all tasks for authenticated user
 */
export const getTasks = async (
  category?: 'Work' | 'Personal',
  completed?: boolean
): Promise<Task[]> => {
  try {
    let url = `${API_BASE_URL}${API_ENDPOINTS.TASKS}`;
    const params = new URLSearchParams();

    if (category) {
      params.append('category', category);
    }
    if (completed !== undefined) {
      params.append('completed', completed.toString());
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await makeAuthenticatedRequest(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    return data;
  } catch (error) {
    console.error('Get tasks error:', error);
    throw error;
  }
};

/**
 * Get a single task by ID
 */
export const getTask = async (id: number): Promise<Task> => {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.TASK_DETAIL(id)}`;
    const response = await makeAuthenticatedRequest(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }

    return data;
  } catch (error) {
    console.error('Get task error:', error);
    throw error;
  }
};

/**
 * Create a new task
 */
export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.TASKS}`;
    const response = await makeAuthenticatedRequest(url, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Create task error:', error);
    throw error;
  }
};

/**
 * Update a task
 */
export const updateTask = async (
  id: number,
  taskData: UpdateTaskData
): Promise<Task> => {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.TASK_DETAIL(id)}`;
    const response = await makeAuthenticatedRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Update task error:', error);
    throw error;
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (id: number): Promise<void> => {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.TASK_DETAIL(id)}`;
    const response = await makeAuthenticatedRequest(url, {
      method: 'DELETE',
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to delete task');
    }
  } catch (error) {
    console.error('Delete task error:', error);
    throw error;
  }
};

/**
 * Toggle task completion status
 */
export const toggleTaskComplete = async (id: number): Promise<Task> => {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.TASK_TOGGLE(id)}`;
    const response = await makeAuthenticatedRequest(url, {
      method: 'POST',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to toggle task');
    }

    return data;
  } catch (error) {
    console.error('Toggle task error:', error);
    throw error;
  }
};
