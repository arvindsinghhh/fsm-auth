import { Customer, AddCustomerRequest, EditCustomerRequest, CustomerFilters } from '../types/customer';

// Dummy data
const dummyCustomers: Customer[] = [
  {
    id: '1',
    customerId: 'CUST001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    mobile: '+1234567890',
    address: '123 Main St, City, Country',
    status: 'Active',
    registeredOn: '2023-01-15',
    jobs: [
      {
        id: 'J001',
        type: 'Maintenance',
        status: 'Completed',
        description: 'Regular AC maintenance',
        createdAt: '2023-08-15T10:00:00Z',
        location: 'Main Office'
      },
      {
        id: 'J002',
        type: 'Repair',
        status: 'In Progress',
        description: 'Fix cooling system',
        createdAt: '2023-09-01T14:30:00Z',
        location: 'Branch Office'
      }
    ]
  },
  {
    id: '2',
    customerId: 'CUST002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    mobile: '+1987654321',
    address: '456 Oak Road, Town, Country',
    status: 'Active',
    registeredOn: '2023-02-20',
    jobs: [
      {
        id: 'J003',
        type: 'Installation',
        status: 'Pending',
        description: 'New AC installation',
        createdAt: '2023-09-10T09:00:00Z',
        location: 'Residence'
      }
    ]
  }
];

export const fetchCustomers = async (filters: CustomerFilters): Promise<{ customers: Customer[] }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredCustomers = [...dummyCustomers];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredCustomers = filteredCustomers.filter(
      customer => customer.name.toLowerCase().includes(searchLower) ||
                  customer.email.toLowerCase().includes(searchLower)
    );
  }

  if (filters.status) {
    filteredCustomers = filteredCustomers.filter(customer => customer.status === filters.status);
  }

  if (filters.dateFrom) {
    filteredCustomers = filteredCustomers.filter(
      customer => customer.registeredOn >= filters.dateFrom!
    );
  }

  if (filters.dateTo) {
    filteredCustomers = filteredCustomers.filter(
      customer => customer.registeredOn <= filters.dateTo!
    );
  }

  if (filters.location) {
    filteredCustomers = filteredCustomers.filter(
      customer => customer.jobs.some(job => job.location.toLowerCase().includes(filters.location!.toLowerCase()))
    );
  }

  if (filters.jobType) {
    filteredCustomers = filteredCustomers.filter(
      customer => customer.jobs.some(job => job.type.toLowerCase() === filters.jobType!.toLowerCase())
    );
  }

  return { customers: filteredCustomers };
};

export const fetchCustomerDetails = async (customerId: string): Promise<{ customer: Customer }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const customer = dummyCustomers.find(c => c.id === customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  return { customer };
};

export const addCustomer = async (data: AddCustomerRequest): Promise<{ customer: Customer }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const newCustomer: Customer = {
    id: String(dummyCustomers.length + 1),
    customerId: `CUST${String(dummyCustomers.length + 1).padStart(3, '0')}`,
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    address: data.address,
    status: 'Active',
    registeredOn: new Date().toISOString().split('T')[0],
    jobs: []
  };

  dummyCustomers.push(newCustomer);
  return { customer: newCustomer };
};

export const editCustomer = async (customerId: string, data: EditCustomerRequest): Promise<{ customer: Customer }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const customerIndex = dummyCustomers.findIndex(c => c.id === customerId);
  if (customerIndex === -1) {
    throw new Error('Customer not found');
  }

  const updatedCustomer = {
    ...dummyCustomers[customerIndex],
    ...data
  };

  dummyCustomers[customerIndex] = updatedCustomer;
  return { customer: updatedCustomer };
};

export const toggleCustomerStatus = async (customerId: string): Promise<{ customer: Customer }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const customerIndex = dummyCustomers.findIndex(c => c.id === customerId);
  if (customerIndex === -1) {
    throw new Error('Customer not found');
  }

  const newStatus: 'Active' | 'Inactive' = dummyCustomers[customerIndex].status === 'Active' ? 'Inactive' : 'Active';
  const updatedCustomer = {
    ...dummyCustomers[customerIndex],
    status: newStatus
  };

  dummyCustomers[customerIndex] = updatedCustomer;
  return { customer: updatedCustomer };
};
