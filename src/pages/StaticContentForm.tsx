import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Chip,
    IconButton,
    Alert
} from '@mui/material';
import { Add as AddIcon, Clear as ClearIcon } from '@mui/icons-material';
import { staticContentService, StaticContent } from '../services/staticContentService';

const StaticContentForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [keywordInput, setKeywordInput] = useState('');
    
    const [content, setContent] = useState<StaticContent>({
        id: null,
        title: '',
        description: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: []
    });

    useEffect(() => {
        if (id) {
            fetchContent();
        }
    }, [id]);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const data = await staticContentService.getContentById(Number(id));
            setContent(data);
        } catch (error) {
            console.error('Error fetching content:', error);
            setError('Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddKeyword = () => {
        if (keywordInput.trim()) {
            setContent(prev => ({
                ...prev,
                metaKeywords: [...prev.metaKeywords, keywordInput.trim()]
            }));
            setKeywordInput('');
        }
    };

    const handleRemoveKeyword = (index: number) => {
        setContent(prev => ({
            ...prev,
            metaKeywords: prev.metaKeywords.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await staticContentService.addContent(content);
            navigate('/admin/static-contents');
        } catch (error) {
            console.error('Error saving content:', error);
            setError('Failed to save content');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" mb={3}>
                {id ? 'Edit Static Content' : 'Add New Static Content'}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={content.title}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={content.description}
                        onChange={handleChange}
                        margin="normal"
                        required
                        multiline
                        rows={4}
                    />

                    <TextField
                        fullWidth
                        label="Meta Title"
                        name="metaTitle"
                        value={content.metaTitle}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <TextField
                        fullWidth
                        label="Meta Description"
                        name="metaDescription"
                        value={content.metaDescription}
                        onChange={handleChange}
                        margin="normal"
                        required
                        multiline
                        rows={2}
                    />

                    <Box sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="subtitle1">Meta Keywords</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <TextField
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                label="Add keyword"
                                size="small"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddKeyword();
                                    }
                                }}
                            />
                            <IconButton onClick={handleAddKeyword} color="primary">
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {content.metaKeywords.map((keyword, index) => (
                                <Chip
                                    key={index}
                                    label={keyword}
                                    onDelete={() => handleRemoveKeyword(index)}
                                    color="primary"
                                />
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : (id ? 'Update' : 'Create')}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/admin/static-contents')}
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default StaticContentForm;
