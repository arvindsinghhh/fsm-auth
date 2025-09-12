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
    // In-memory storage
    _inMemoryContents: [
        {
            id: 1,
            title: 'About Us',
            description: 'About FSM company and its mission. We are dedicated to providing the best field service management solutions.',
            metaTitle: 'About Us - FSM',
            metaDescription: 'Learn more about FSM company and our commitment to excellence in field service management',
            metaKeywords: ['about', 'fsm', 'company', 'field service'],
            slug: 'about-us',
            active: true,
            createdAt: '2025-09-12T10:00:00Z',
            updatedAt: '2025-09-12T10:00:00Z'
        },
        {
            id: 2,
            title: 'Privacy Policy',
            description: 'Our privacy policy details how we collect, use, and protect your personal information.',
            metaTitle: 'Privacy Policy - FSM',
            metaDescription: 'FSM Privacy Policy and data handling practices - Learn how we protect your information',
            metaKeywords: ['privacy', 'policy', 'data', 'security'],
            slug: 'privacy-policy',
            active: true,
            createdAt: '2025-09-12T10:00:00Z',
            updatedAt: '2025-09-12T10:00:00Z'
        },
        {
            id: 3,
            title: 'Terms of Service',
            description: 'Our terms of service outline the rules and guidelines for using FSM services.',
            metaTitle: 'Terms of Service - FSM',
            metaDescription: 'Read our terms of service to understand your rights and responsibilities when using FSM services',
            metaKeywords: ['terms', 'service', 'conditions', 'legal'],
            slug: 'terms-of-service',
            active: true,
            createdAt: '2025-09-12T09:00:00Z',
            updatedAt: '2025-09-12T09:00:00Z'
        }
    ] as StaticContent[],

    // Add or Update Static Content
    addContent: async (content: StaticContent): Promise<StaticContent> => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
            
            if (content.id) {
                // Update existing content
                const index = staticContentService._inMemoryContents.findIndex(c => c.id === content.id);
                if (index !== -1) {
                    staticContentService._inMemoryContents[index] = {
                        ...content,
                        updatedAt: new Date().toISOString()
                    };
                    return staticContentService._inMemoryContents[index];
                }
            } else {
                // Add new content
                const newContent = {
                    ...content,
                    id: Math.max(0, ...staticContentService._inMemoryContents.map(c => c.id || 0)) + 1,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    slug: content.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                };
                staticContentService._inMemoryContents.push(newContent);
                return newContent;
            }
            throw new Error('Content not found');
        } catch (error) {
            console.error('Error in addContent:', error);
            throw error;
        }
    },

    // Get Content by ID
    getContentById: async (id: number): Promise<StaticContent> => {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
        const content = staticContentService._inMemoryContents.find(c => c.id === id);
        if (!content) {
            throw new Error('Content not found');
        }
        return content;
    },

    // Get Content by Slug
    getContentBySlug: async (slug: string): Promise<StaticContent> => {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
        const content = staticContentService._inMemoryContents.find(c => c.slug === slug);
        if (!content) {
            throw new Error('Content not found');
        }
        return content;
    },

    // Delete Content
    deleteContent: async (id: number): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        const index = staticContentService._inMemoryContents.findIndex(c => c.id === id);
        if (index !== -1) {
            staticContentService._inMemoryContents.splice(index, 1);
            return true;
        }
        return false;
    },

    // List Contents with Filters & Pagination
    listContents: async (params: StaticContentListRequest): Promise<StaticContentListResponse> => {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
        
        let filteredContents = [...staticContentService._inMemoryContents];

        // Apply search filter
        if (params.searchText) {
            const searchLower = params.searchText.toLowerCase();
            filteredContents = filteredContents.filter(content =>
                content.title.toLowerCase().includes(searchLower) ||
                content.description.toLowerCase().includes(searchLower) ||
                content.metaKeywords.some(keyword => keyword.toLowerCase().includes(searchLower))
            );
        }

        // Apply date filters
        if (params.from) {
            filteredContents = filteredContents.filter(content => 
                content.createdAt && new Date(content.createdAt) >= new Date(params.from!)
            );
        }
        if (params.to) {
            filteredContents = filteredContents.filter(content => 
                content.createdAt && new Date(content.createdAt) <= new Date(params.to!)
            );
        }

        // Apply sorting
        if (params.shortingField) {
            filteredContents.sort((a: any, b: any) => {
                const aValue = a[params.shortingField!];
                const bValue = b[params.shortingField!];
                const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                return params.asc ? comparison : -comparison;
            });
        }

        // Apply pagination
        const start = params.pageNumber * params.pageSize;
        const paginatedContents = filteredContents.slice(start, start + params.pageSize);

        return {
            content: paginatedContents,
            totalElements: filteredContents.length,
            totalPages: Math.ceil(filteredContents.length / params.pageSize),
            pageNumber: params.pageNumber,
            pageSize: params.pageSize
        };
    },

    // Change Content Status
    changeStatus: async (id: number): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
        const content = staticContentService._inMemoryContents.find(c => c.id === id);
        if (content) {
            content.active = !content.active;
            content.updatedAt = new Date().toISOString();
            return true;
        }
        return false;
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
