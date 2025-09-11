export interface Technician {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: 'Active' | 'Inactive';
  assignedLeads: number;
  joinDate: string;
  profileImage?: string;
  address?: string;
  availability?: string;
  completedJobs?: number;
}

export interface Lead {
  id: string;
  status: string;
  customerFeedback?: string;
  actions?: string[];
}
