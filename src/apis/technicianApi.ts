const BASE_URL = process.env.REACT_APP_ADMIN_SERVICE_BASE_URL || 'http://localhost:5000';

export const TECHNICIAN_API = {
  LIST: `${BASE_URL}/technicians`,
  DETAIL: (id: string) => `${BASE_URL}/technicians/${id}`,
  ADD: `${BASE_URL}/technicians`,
  EDIT: (id: string) => `${BASE_URL}/technicians/${id}`,
  BLOCK: (id: string) => `${BASE_URL}/technicians/${id}/block`,
  UNBLOCK: (id: string) => `${BASE_URL}/technicians/${id}/unblock`,
  LEAD_ACTIONS: (leadId: string) => `${BASE_URL}/leads/${leadId}/actions`,
};
