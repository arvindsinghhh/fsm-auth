import { JobType, AddJobTypeRequest, EditJobTypeRequest } from '../types/jobType';

// Dummy data
const dummyJobTypes: JobType[] = [
  {
    id: '1',
    jobTypeId: 'JT001',
    name: 'Warranty',
    status: 'Active'
  },
  {
    id: '2',
    jobTypeId: 'JT002',
    name: 'Repair',
    status: 'Active'
  },
  {
    id: '3',
    jobTypeId: 'JT003',
    name: 'Warranty Rework',
    status: 'Active'
  },
  {
    id: '4',
    jobTypeId: 'JT004',
    name: 'New Fence Installation',
    status: 'Active'
  },
  {
    id: '5',
    jobTypeId: 'JT005',
    name: 'Layout Processing',
    status: 'Inactive'
  },
  {
    id: '6',
    jobTypeId: 'JT006',
    name: 'New Window Installation',
    status: 'Active'
  }
];

export const fetchJobTypes = async (): Promise<{ jobTypes: JobType[] }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { jobTypes: dummyJobTypes };
};

export const fetchJobTypeDetail = async (jobTypeId: string): Promise<{ jobType: JobType }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const jobType = dummyJobTypes.find(jt => jt.id === jobTypeId);
  if (!jobType) {
    throw new Error('Job type not found');
  }

  return { jobType };
};

export const addJobType = async (data: AddJobTypeRequest): Promise<{ jobType: JobType }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const newJobType: JobType = {
    id: String(dummyJobTypes.length + 1),
    jobTypeId: `JT${String(dummyJobTypes.length + 1).padStart(3, '0')}`,
    name: data.name,
    status: data.status
  };

  dummyJobTypes.push(newJobType);
  return { jobType: newJobType };
};

export const editJobType = async (jobTypeId: string, data: EditJobTypeRequest): Promise<{ jobType: JobType }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const jobTypeIndex = dummyJobTypes.findIndex(jt => jt.id === jobTypeId);
  if (jobTypeIndex === -1) {
    throw new Error('Job type not found');
  }

  const updatedJobType = {
    ...dummyJobTypes[jobTypeIndex],
    ...data
  };

  dummyJobTypes[jobTypeIndex] = updatedJobType;
  return { jobType: updatedJobType };
};

export const deleteJobType = async (jobTypeId: string): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const jobTypeIndex = dummyJobTypes.findIndex(jt => jt.id === jobTypeId);
  if (jobTypeIndex === -1) {
    throw new Error('Job type not found');
  }

  dummyJobTypes.splice(jobTypeIndex, 1);
};
