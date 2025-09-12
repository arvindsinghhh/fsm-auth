import { mockService } from '../service';
import { StaticContent } from '../../services/staticContentService';

// Modify this file to match your existing service interface
type MockStaticContent = Omit<StaticContent, 'id'> & { id: string | number | undefined };

export const staticContentService = {
    listContents: async (params: any) => {
        const response = await mockService.get<MockStaticContent>('staticContent', {
            page: params.pageNumber,
            limit: params.pageSize,
            search: params.searchText,
        });

        return {
            content: response.data as StaticContent[],
            totalElements: response.total,
            pageNumber: response.page,
            pageSize: response.limit,
        };
    },

    getContentById: (id: number) => {
        return mockService.getById<MockStaticContent>('staticContent', id);
    },

    createContent: (data: Omit<StaticContent, 'id'>) => {
        const contentWithId = { ...data, id: undefined };
        return mockService.post<MockStaticContent>('staticContent', contentWithId);
    },

    updateContent: (id: number, data: Partial<StaticContent>) => {
        const mockData = { ...data, id: data.id || undefined } as Partial<MockStaticContent>;
        return mockService.put<MockStaticContent>('staticContent', id, mockData);
    },

    deleteContent: (id: number) => {
        return mockService.delete('staticContent', id);
    },

    changeStatus: async (id: number) => {
        const content = await mockService.getById<MockStaticContent>('staticContent', id);
        if (!content) throw new Error('Content not found');
        
        return mockService.put<MockStaticContent>('staticContent', id, {
            active: !content.active
        });
    }
};
