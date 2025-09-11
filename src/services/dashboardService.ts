import axios from 'axios';
import { API_ENDPOINTS } from '../apis/api';

export interface DashboardStats {
  totalTechnicians: number;
  totalFrontOfficeStaff: number;
  totalCustomers: number;
  totalActiveJobs: number;
  totalJobs: number;
  totalRevenue: number;
  totalPendingAmount: number;
  jobsByType: Array<{
    type: string;
    count: number;
  }>;
  jobsByLocation: Array<{
    location: string;
    count: number;
  }>;
  popularLocations: Array<{
    location: string;
    count: number;
  }>;
  popularJobTypes: Array<{
    type: string;
    count: number;
  }>;
}

export interface DashboardFilters {
  fromDate?: string;
  toDate?: string;
}

export const fetchDashboardStats = async (filters?: DashboardFilters): Promise<DashboardStats> => {
  const response = await axios.get(`${process.env.REACT_APP_ADMIN_SERVICE_BASE_URL}/dashboard/stats`, { params: filters });
  return response.data;
};
