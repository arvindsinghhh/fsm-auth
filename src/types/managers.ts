export interface Technician {
  id: string;
  name: string;
  email: string;
  mobile: string;
  joinDate: string;
  status: 'active' | 'inactive';
  totalLeads: number;
  rating: number;
}

export interface FrontOfficeStaff {
  id: string;
  name: string;
  email: string;
  mobile: string;
  joinDate: string;
  status: 'active' | 'inactive';
  jobsHandled: number;
  performance: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  totalJobs: number;
  joinDate: string;
}

export interface JobType {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  totalJobs: number;
}

export interface JobTag {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  usageCount: number;
}

export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  technicianId: string;
  technicianName: string;
  type: string;
  tags: string[];
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  summary: string;
  location: string;
}

export interface Transaction {
  id: string;
  jobId: string;
  amount: number;
  type: 'payment' | 'refund';
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  status: 'active' | 'inactive';
  lastUsed: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  status: 'read' | 'unread';
  createdAt: string;
}

export interface StaticContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  lastUpdated: string;
  status: 'published' | 'draft';
}

export interface ReportData {
  type: 'revenue' | 'jobs' | 'technicians' | 'customers';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  data: any[];
}
