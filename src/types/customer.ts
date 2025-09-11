export interface CustomerJob {
  id: string;
  type: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  description: string;
  createdAt: string;
  location: string;
}

export interface Customer {
  id: string;
  customerId: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  status: 'Active' | 'Inactive';
  registeredOn: string;
  jobs: CustomerJob[];
}

export interface AddCustomerRequest {
  name: string;
  email: string;
  mobile: string;
  address: string;
}

export interface EditCustomerRequest extends AddCustomerRequest {
  status: 'Active' | 'Inactive';
}

export interface CustomerFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  location?: string;
  jobType?: string;
  status?: string;
}
