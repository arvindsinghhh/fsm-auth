import { Technician } from '../types/technician';

const mockTechnicians: Technician[] = [
    {
        id: "tech_1",
        name: "John Smith",
        email: "john.smith@example.com",
        mobile: "+1 (555) 123-4567",
        status: "Active",
        profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        address: "123 Main St, New York, NY 10001",
        availability: "Available",
        assignedLeads: [],
        completedJobs: 234,
        rating: 4.8,
        totalFeedbacks: 180,
        activeJobsCount: 2
    },
    {
        id: "tech_2",
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        mobile: "+1 (555) 234-5678",
        status: "Active",
        profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
        address: "456 Oak Ave, Los Angeles, CA 90001",
        availability: "On Job",
        assignedLeads: [],
        completedJobs: 345,
        rating: 4.9,
        totalFeedbacks: 290,
        activeJobsCount: 1
    },
    {
        id: "tech_3",
        name: "Michael Chen",
        email: "m.chen@example.com",
        mobile: "+1 (555) 345-6789",
        status: "Inactive",
        profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
        address: "789 Pine St, Chicago, IL 60601",
        availability: "Off Duty",
        assignedLeads: [],
        completedJobs: 178,
        rating: 4.7,
        totalFeedbacks: 150,
        activeJobsCount: 0
    }
];

// Get fresh copy of data
export const getDummyTechnicians = () => [...mockTechnicians];

// Helper functions for managing technicians
export const addDummyTechnician = (technician: Omit<Technician, 'id'>) => {
    const newTech: Technician = {
        ...technician,
        id: `tech_${Date.now()}`,
        assignedLeads: []
    };
    mockTechnicians.push(newTech);
    return newTech;
};

export const updateDummyTechnician = (id: string, updates: Partial<Technician>) => {
    const index = mockTechnicians.findIndex(t => t.id === id);
    if (index !== -1) {
        mockTechnicians[index] = { ...mockTechnicians[index], ...updates };
        return mockTechnicians[index];
    }
    return null;
};

export const deleteDummyTechnician = (id: string) => {
    const index = mockTechnicians.findIndex(t => t.id === id);
    if (index !== -1) {
        mockTechnicians.splice(index, 1);
        return true;
    }
    return false;
};
