import { mockService } from '../service';
import { Technician } from '../../types/technician';

type MockTechnician = Omit<Technician, 'id'> & { id: string | number | undefined };

export const technicianService = {
    listTechnicians: async (params: any) => {
        const response = await mockService.get<MockTechnician>('technicians', {
            page: params.pageNumber,
            limit: params.pageSize,
            search: params.searchText,
        });

        return {
            technicians: response.data as Technician[],
            total: response.total,
            page: response.page,
            pageSize: response.limit,
        };
    },

    getTechnicianById: (id: string) => {
        return mockService.getById<MockTechnician>('technicians', id);
    },

    addTechnician: async (data: Partial<Technician>) => {
        // Add default values for required fields that might not be provided in the form
        const newTechnician: MockTechnician = {
            id: undefined, // Will be set by the mock store
            name: data.name || '',
            email: data.email || '',
            mobile: data.mobile || '',
            status: data.status || 'Active',
            address: data.address || '',
            availability: 'Available', // Default value
            assignedLeads: [], // Start with no leads
            completedJobs: 0, // Start with no completed jobs
            rating: 0, // Start with no rating
            totalFeedbacks: 0, // Start with no feedbacks
            activeJobsCount: 0, // Start with no active jobs
            profileImage: data.profileImage || undefined
        };

        return mockService.post<MockTechnician>('technicians', newTechnician);
    },

    updateTechnician: (id: string, data: Partial<Technician>) => {
        const mockData = { ...data, id } as Partial<MockTechnician>;
        return mockService.put<MockTechnician>('technicians', id, mockData);
    },

    deleteTechnician: (id: string) => {
        return mockService.delete('technicians', id);
    },

    blockTechnician: async (id: string) => {
        return mockService.put<MockTechnician>('technicians', id, { status: 'Inactive' });
    },

    unblockTechnician: async (id: string) => {
        return mockService.put<MockTechnician>('technicians', id, { status: 'Active' });
    }
};
