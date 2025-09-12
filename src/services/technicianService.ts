import axios from 'axios';
import { TECHNICIAN_API } from '../apis/technicianApi';
import { Technician } from '../types/technician';

export const fetchTechnicians = async (params = {}) => {
  try {
    const response = await axios.get(TECHNICIAN_API.LIST, { params });
    return response.data;
  } catch (err) {
    // Use mock service if API fails
    const { technicianService } = await import('../mock/services/technicianService');
    return technicianService.listTechnicians(params);
  }
};

export const fetchTechnicianDetail = async (id: string) => {
  try {
    const response = await axios.get(TECHNICIAN_API.DETAIL(id));
    return response.data;
  } catch (err) {
    // Use mock service if API fails
    const { technicianService } = await import('../mock/services/technicianService');
    const technician = await technicianService.getTechnicianById(id);
    return { technician };
  }
};

export const addTechnician = async (data: Partial<Technician>) => {
  try {
    const response = await axios.post(TECHNICIAN_API.ADD, data);
    return response.data;
  } catch (err) {
    // Use mock service if API fails
    const { technicianService } = await import('../mock/services/technicianService');
    return technicianService.addTechnician(data);
  }
};

export const editTechnician = async (id: string, data: Partial<Technician>) => {
  try {
    const response = await axios.put(TECHNICIAN_API.EDIT(id), data);
    return response.data;
  } catch (err) {
    // Use mock service if API fails
    const { technicianService } = await import('../mock/services/technicianService');
    return technicianService.updateTechnician(id, data);
  }
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
