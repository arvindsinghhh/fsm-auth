export interface JobType {
  id: string;
  jobTypeId: string;
  name: string;
  status: 'Active' | 'Inactive';
  description?: string;
  duration?: number;
  price?: number;
}

export interface AddJobTypeRequest {
  name: string;
  status: 'Active' | 'Inactive';
  description?: string;
  duration?: number;
  price?: number;
}

export interface EditJobTypeRequest {
  name: string;
  status: 'Active' | 'Inactive';
  description?: string;
  duration?: number;
  price?: number;
}
