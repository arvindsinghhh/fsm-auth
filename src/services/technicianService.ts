import axios from 'axios';
import { TECHNICIAN_API } from '../apis/technicianApi';
import { Technician } from '../types/technician';

export const fetchTechnicians = async (params = {}) => {
  try {
    const response = await axios.get(TECHNICIAN_API.LIST, { params });
    return response.data;
  } catch (err) {
    // Return dummy data if API fails
    return {
      technicians: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          mobile: '1234567890',
          status: 'Active',
          assignedLeads: 5,
          joinDate: '2023-01-01',
          profileImage: '',
          address: '123 Main St',
          availability: 'Available',
          completedJobs: 10,
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          mobile: '9876543210',
          status: 'Inactive',
          assignedLeads: 2,
          joinDate: '2023-02-15',
          profileImage: '',
          address: '456 Elm St',
          availability: 'Unavailable',
          completedJobs: 7,
        }
      ]
    };
  }
};

export const fetchTechnicianDetail = async (id: string) => {
  const response = await axios.get(TECHNICIAN_API.DETAIL(id));
  return response.data;
};

export const addTechnician = async (data: Partial<Technician>) => {
  const response = await axios.post(TECHNICIAN_API.ADD, data);
  return response.data;
};

export const editTechnician = async (id: string, data: Partial<Technician>) => {
  const response = await axios.put(TECHNICIAN_API.EDIT(id), data);
  return response.data;
};

export const blockTechnician = async (id: string) => {
  const response = await axios.post(TECHNICIAN_API.BLOCK(id));
  return response.data;
};

export const unblockTechnician = async (id: string) => {
  const response = await axios.post(TECHNICIAN_API.UNBLOCK(id));
  return response.data;
};

export const fetchLeadActions = async (leadId: string) => {
  const response = await axios.get(TECHNICIAN_API.LEAD_ACTIONS(leadId));
  return response.data;
};
