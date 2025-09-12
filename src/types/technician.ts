export interface TechnicianLead {
  id: string;
  title: string;
  customerName: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  date: string;
  customerFeedback?: {
    rating: number;
    comment: string;
    date: string;
  };
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: 'Active' | 'Inactive';
  profileImage?: string;
  address: string;
  availability: 'Available' | 'On Job' | 'Off Duty';
  assignedLeads: TechnicianLead[];
  completedJobs: number;
  rating: number;
  totalFeedbacks: number;
  activeJobsCount: number;
}
