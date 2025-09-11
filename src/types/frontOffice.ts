export interface FrontOfficeStaff {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  mobile: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  address?: string;
  activityHistory?: StaffActivity[];
}

export interface StaffActivity {
  id: string;
  type: 'Lead' | 'Job';
  referenceId: string;
  description: string;
  timestamp: string;
}

export interface AddFrontOfficeStaffRequest {
  name: string;
  email: string;
  mobile: string;
  address?: string;
}

export interface EditFrontOfficeStaffRequest extends AddFrontOfficeStaffRequest {
  status: 'Active' | 'Inactive';
}
