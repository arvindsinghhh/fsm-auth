import { getDummyTechnicians } from './dummyTechnicians';
import { Technician } from '../types/technician';

// In-memory storage
let technicians = getDummyTechnicians();

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockTechnicianService = {
    // Get all technicians
    getTechnicians: async (): Promise<Technician[]> => {
        await delay(500); // Simulate network delay
        return [...technicians];
    },

    // Get technician by ID
    getTechnicianById: async (id: string): Promise<Technician | undefined> => {
        await delay(300);
        return technicians.find(t => t.id === id);
    },

    // Create new technician
    createTechnician: async (data: Omit<Technician, 'id'>): Promise<Technician> => {
        await delay(500);
        const newTechnician = {
            ...data,
            id: String(Date.now()), // Generate a unique ID
        };
        technicians.push(newTechnician);
        return newTechnician;
    },

    // Update technician
    updateTechnician: async (id: string, data: Partial<Technician>): Promise<Technician> => {
        await delay(400);
        const index = technicians.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Technician not found');
        
        technicians[index] = {
            ...technicians[index],
            ...data
        };
        return technicians[index];
    },

    // Delete technician
    deleteTechnician: async (id: string): Promise<void> => {
        await delay(300);
        technicians = technicians.filter(t => t.id !== id);
    },

    // Search technicians
    searchTechnicians: async (query: string): Promise<Technician[]> => {
        await delay(300);
        const searchStr = query.toLowerCase();
        return technicians.filter(tech => 
            tech.name.toLowerCase().includes(searchStr) ||
            tech.email.toLowerCase().includes(searchStr) ||
            tech.address.toLowerCase().includes(searchStr)
        );
    }
};
