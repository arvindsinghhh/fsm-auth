// API endpoints for Technicians Management (replace with your actual backend URLs)
export const TECHNICIAN_API = {
  LIST: '/api/technicians',
  DETAIL: (id) => `/api/technicians/${id}`,
  ADD: '/api/technicians',
  EDIT: (id) => `/api/technicians/${id}`,
  BLOCK: (id) => `/api/technicians/${id}/block`,
  UNBLOCK: (id) => `/api/technicians/${id}/unblock`,
  LEAD_ACTIONS: (leadId) => `/api/leads/${leadId}/actions`,
};
