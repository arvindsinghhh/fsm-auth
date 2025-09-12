import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Chip,
    Alert,
    Divider,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { staticContentService, StaticContent } from '../services/staticContentService';

const StaticContentView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [content, setContent] = useState<StaticContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContent = React.useCallback(async () => {
        if (!id) {
            console.log('No ID provided');
            return;
        }
        try {
            setLoading(true);
            console.log('Fetching content for ID:', id);
            const data = await staticContentService.getContentById(Number(id));
            console.log('Received data:', data);
            setContent(data);
        } catch (error: any) {
            console.error('Error fetching content:', error);
            setError('Failed to load content');
            if (error?.response) {
                console.log('Error response:', error.response.status, error.response.data);
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!content) {
        return (
            <Box p={3}>
                <Alert severity="warning">Content not found</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" component="h2">
                    View Static Content
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/static-content/edit/${id}`)}
                >
                    Edit Content
                </Button>
            </Box>

            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Title
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            {content.title}
                        </Typography>
                    </Box>

                    <Divider />

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Description
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                            {content.description}
                        </Typography>
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                        <Box flex={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Meta Title
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                {content.metaTitle}
                            </Typography>
                        </Box>

                        <Box flex={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Status
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                {content.active ? 'Active' : 'Inactive'}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider />

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Meta Description
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            {content.metaDescription}
                        </Typography>
                    </Box>

                    <Divider />

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Meta Keywords
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                            {content.metaKeywords.map((keyword: string, index: number) => (
                                <Chip
                                    key={index}
                                    label={keyword}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </Box>

                    {(content.createdAt || content.updatedAt) && (
                        <>
                            <Divider />

                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                                {content.createdAt && (
                                    <Box flex={1}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Created At
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {new Date(content.createdAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                )}

                                {content.updatedAt && (
                                    <Box flex={1}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Last Updated
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {new Date(content.updatedAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </>
                    )}
                </Box>
            </Paper>

            <Box mt={3}>
                <Button variant="outlined" onClick={() => navigate('/static-content')}>
                    Back to List
                </Button>
            </Box>
        </Box>
    );
};

export default StaticContentView;
