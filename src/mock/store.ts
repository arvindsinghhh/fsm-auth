import { StaticContent } from '../services/staticContentService';
import { Technician } from '../types/technician';
import { generateDummyTechnicians } from './dummyData/technicians';
import { generateDummyStaticContent } from './dummyData/staticContent';

interface Store {
    technicians: Technician[];
    staticContent: StaticContent[];
    customers: any[];
    jobs: any[];
    frontOfficeStaff: any[];
}

// Initialize store with dummy data
const store: Store = {
    technicians: generateDummyTechnicians(),
    staticContent: generateDummyStaticContent(),
    customers: [],
    jobs: [],
    frontOfficeStaff: []
};

// Generic CRUD operations
export const mockStore = {
    // Create
    create: <T extends { id?: number | string }>(collection: keyof Store, item: T): T => {
        const newItem = {
            ...item,
            id: item.id || Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        store[collection].push(newItem as any);
        return newItem;
    },

    // Read
    getAll: (collection: keyof Store) => {
        return [...store[collection]];
    },

    getById: <T>(collection: keyof Store, id: number | string): T | undefined => {
        return store[collection].find(item => item.id === id) as T;
    },

    // Update
    update: <T extends { id?: number | string }>(collection: keyof Store, id: number | string, updates: Partial<T>): T => {
        const index = store[collection].findIndex(item => item.id === id);
        if (index === -1) throw new Error('Item not found');

        const updatedItem = {
            ...store[collection][index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        store[collection][index] = updatedItem;
        return updatedItem as T;
    },

    // Delete
    delete: (collection: keyof Store, id: number | string): void => {
        const index = store[collection].findIndex(item => item.id === id);
        if (index !== -1) {
            store[collection].splice(index, 1);
        }
    },

    // Search
    search: <T>(collection: keyof Store, query: string): T[] => {
        const searchStr = query.toLowerCase();
        return store[collection].filter(item => 
            Object.values(item).some(value => 
                String(value).toLowerCase().includes(searchStr)
            )
        ) as T[];
    }
};
