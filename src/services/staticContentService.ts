import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
console.log('API_BASE_URL:', API_BASE_URL); // This will show the actual URL being used

export interface StaticContent {
    id: number | null;
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    slug?: string;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface StaticContentListRequest {
    pageNumber: number;
    pageSize: number;
    searchText?: string;
    shortingField?: string;
    asc?: boolean;
    active?: boolean;
    from?: string;
    to?: string;
}

export interface StaticContentListResponse {
    content: StaticContent[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
}

const headers = {
    userName: 'testadmin@fsm.com'
};

export const staticContentService = {
    // Add or Update Static Content
    addContent: async (content: StaticContent): Promise<StaticContent> => {
        const response = await axios.post(`${API_BASE_URL}/contents/add`, content, { headers });
        return response.data;
    },

    // Get Content by ID
    getContentById: async (id: number): Promise<StaticContent> => {
        try {
            // First try to get from API
            const response = await axios.get(`${API_BASE_URL}/contents/get/by/${id}`, { headers });
            return response.data;
        } catch (error) {
            console.log('API call failed, using dummy data');
            // If API fails, return dummy data for the requested ID
            const dummyData = staticContentService.getDummyData();
            const content = dummyData.content.find(item => item.id === id);
            if (!content) {
                throw new Error('Content not found');
            }
            return content;
        }
    },

    // Get Content by Slug
    getContentBySlug: async (slug: string): Promise<StaticContent> => {
        const response = await axios.get(`${API_BASE_URL}/contents/get/by/slug/${slug}`, { headers });
        return response.data;
    },

    // Delete Content
    deleteContent: async (id: number): Promise<boolean> => {
        const response = await axios.delete(`${API_BASE_URL}/contents/delete/by/id/${id}`, { headers });
        return response.data;
    },

    // List Contents with Filters & Pagination
    listContents: async (params: StaticContentListRequest): Promise<StaticContentListResponse> => {
        const response = await axios.post(`${API_BASE_URL}/contents/static-list`, params, { headers });
        return response.data;
    },

    // Change Content Status
    changeStatus: async (id: number): Promise<boolean> => {
        const response = await axios.put(`${API_BASE_URL}/contents/change/status/${id}`, null, { headers });
        return response.data;
    },

    // Dummy data for initial development
    getDummyData: (): StaticContentListResponse => ({
        content: [
            {
                id: 1,
                title: 'About Us',
                description: 'About FSM company and its mission...',
                metaTitle: 'About Us - FSM',
                metaDescription: 'Learn more about FSM company',
                metaKeywords: ['about', 'fsm', 'company'],
                slug: 'about-us',
                active: true,
                createdAt: '2025-09-12T10:00:00Z',
                updatedAt: '2025-09-12T10:00:00Z'
            },
            {
                id: 2,
                title: 'Privacy Policy',
                description: 'Our privacy policy details...',
                metaTitle: 'Privacy Policy - FSM',
                metaDescription: 'FSM Privacy Policy and data handling practices',
                metaKeywords: ['privacy', 'policy', 'data'],
                slug: 'privacy-policy',
                active: true,
                createdAt: '2025-09-12T10:00:00Z',
                updatedAt: '2025-09-12T10:00:00Z'
            }
        ],
        totalElements: 2,
        totalPages: 1,
        pageNumber: 0,
        pageSize: 10
    })
};
