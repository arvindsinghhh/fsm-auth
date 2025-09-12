import { mockStore } from './store';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
    // Generic GET request with pagination and search
    get: async <T>(
        collection: string,
        options?: {
            page?: number;
            limit?: number;
            search?: string;
            filters?: Record<string, any>;
        }
    ) => {
        await delay(300); // Simulate network delay

        let data = mockStore.getAll(collection as any);

        // Apply search if provided
        if (options?.search) {
            data = mockStore.search(collection as any, options.search);
        }

        // Apply filters if provided
        if (options?.filters) {
            const filters = options.filters || {};
            data = data.filter(item => 
                Object.entries(filters).every(([key, value]) => 
                    item[key] === value
                )
            );
        }

        // Apply pagination if provided
        if (options?.page !== undefined && options?.limit) {
            const start = options.page * options.limit;
            const end = start + options.limit;
            data = data.slice(start, end);
        }

        return {
            data,
            total: data.length,
            page: options?.page || 0,
            limit: options?.limit || data.length
        };
    },

    // GET by ID
    getById: async <T>(collection: string, id: number | string) => {
        await delay(200);
        return mockStore.getById<T>(collection as any, id);
    },

    // POST
    post: async <T extends { id?: string | number }>(collection: string, data: T) => {
        await delay(500);
        return mockStore.create(collection as any, data);
    },

    // PUT
    put: async <T>(collection: string, id: number | string, data: Partial<T>) => {
        await delay(400);
        return mockStore.update(collection as any, id, data);
    },

    // DELETE
    delete: async (collection: string, id: number | string) => {
        await delay(300);
        mockStore.delete(collection as any, id);
        return { success: true };
    }
};
