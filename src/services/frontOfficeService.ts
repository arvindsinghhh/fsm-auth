import { FrontOfficeStaff, AddFrontOfficeStaffRequest, EditFrontOfficeStaffRequest } from '../types/frontOffice';

// Dummy data for demonstration
const dummyStaff: FrontOfficeStaff[] = [
  {
    id: '1',
    employeeId: 'FO001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '+1234567890',
    status: 'Active',
    joinDate: '2023-01-15',
    activityHistory: [
      {
        id: '1',
        type: 'Lead',
        referenceId: 'L001',
        description: 'Processed new customer inquiry',
        timestamp: '2023-09-10T10:30:00Z'
      },
      {
        id: '2',
        type: 'Job',
        referenceId: 'J001',
        description: 'Scheduled technician visit',
        timestamp: '2023-09-10T11:45:00Z'
      }
    ]
  },
  {
    id: '2',
    employeeId: 'FO002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    mobile: '+1987654321',
    status: 'Active',
    joinDate: '2023-02-20',
    activityHistory: [
      {
        id: '3',
        type: 'Lead',
        referenceId: 'L002',
        description: 'Customer follow-up call',
        timestamp: '2023-09-09T14:20:00Z'
      }
    ]
  },
  {
    id: '3',
    employeeId: 'FO003',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    mobile: '+1122334455',
    status: 'Inactive',
    joinDate: '2023-03-10',
    activityHistory: []
  }
];

interface SearchParams {
  search?: string;
  status?: string;
  from?: string;
  to?: string;
}

export const fetchFrontOfficeStaff = async (params: SearchParams): Promise<{ staff: FrontOfficeStaff[] }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredStaff = [...dummyStaff];

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredStaff = filteredStaff.filter(
      staff => staff.name.toLowerCase().includes(searchLower) ||
               staff.email.toLowerCase().includes(searchLower)
    );
  }

  if (params.status) {
    filteredStaff = filteredStaff.filter(staff => staff.status === params.status);
  }

  if (params.from) {
    const fromDate = params.from;
    filteredStaff = filteredStaff.filter(staff => staff.joinDate >= fromDate);
  }

  if (params.to) {
    const toDate = params.to;
    filteredStaff = filteredStaff.filter(staff => staff.joinDate <= toDate);
  }

  return { staff: filteredStaff };
};

export const fetchStaffDetail = async (staffId: string): Promise<{ staff: FrontOfficeStaff }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const staff = dummyStaff.find(s => s.id === staffId);
  if (!staff) {
    throw new Error('Staff member not found');
  }

  return { staff };
};

export const addFrontOfficeStaff = async (data: AddFrontOfficeStaffRequest): Promise<{ staff: FrontOfficeStaff }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const newStaff: FrontOfficeStaff = {
    id: String(dummyStaff.length + 1),
    employeeId: `FO${String(dummyStaff.length + 1).padStart(3, '0')}`,
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
    activityHistory: []
  };

  dummyStaff.push(newStaff);
  return { staff: newStaff };
};

export const editFrontOfficeStaff = async (staffId: string, data: EditFrontOfficeStaffRequest): Promise<{ staff: FrontOfficeStaff }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const staffIndex = dummyStaff.findIndex(s => s.id === staffId);
  if (staffIndex === -1) {
    throw new Error('Staff member not found');
  }

  const updatedStaff = {
    ...dummyStaff[staffIndex],
    ...data
  };

  dummyStaff[staffIndex] = updatedStaff;
  return { staff: updatedStaff };
};

export const toggleStaffStatus = async (staffId: string): Promise<{ staff: FrontOfficeStaff }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const staffIndex = dummyStaff.findIndex(s => s.id === staffId);
  if (staffIndex === -1) {
    throw new Error('Staff member not found');
  }

  const newStatus: 'Active' | 'Inactive' = dummyStaff[staffIndex].status === 'Active' ? 'Inactive' : 'Active';
  const updatedStaff: FrontOfficeStaff = {
    ...dummyStaff[staffIndex],
    status: newStatus
  };

  dummyStaff[staffIndex] = updatedStaff;
  return { staff: updatedStaff };
};
