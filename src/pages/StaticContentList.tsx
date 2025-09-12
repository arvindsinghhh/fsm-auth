import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Switch,
    IconButton,
    Typography,
    TextField,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
    Card,
    CardContent,
    Select,
    MenuItem
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { staticContentService, StaticContent, StaticContentListRequest } from '../services/staticContentService';

const StaticContentList: React.FC = () => {
    const navigate = useNavigate();
    const [contents, setContents] = useState<StaticContent[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedContentId, setSelectedContentId] = useState<number | null>(null);

    const fetchContents = React.useCallback(async () => {
        try {
            setLoading(true);
            const params: StaticContentListRequest = {
                pageNumber: page,
                pageSize: rowsPerPage,
                searchText: searchText || undefined,
                shortingField: 'createdAt',
                asc: false,
                from: dateRange.from || undefined,
                to: dateRange.to || undefined
            };

            const response = await staticContentService.listContents(params);
            setContents(response.content);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error('Error fetching contents:', error);
            // Use dummy data if API fails
            const dummyData = staticContentService.getDummyData();
            setContents(dummyData.content);
            setTotalElements(dummyData.totalElements);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, searchText]);

    useEffect(() => {
        fetchContents();
    }, [fetchContents]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
        setPage(0);
    };

    const handleStatusToggle = async (id: number) => {
        try {
            await staticContentService.changeStatus(id);
            fetchContents();
        } catch (error) {
            console.error('Error changing status:', error);
        }
    };

    const handleDeleteClick = (id: number) => {
        setSelectedContentId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedContentId) {
            try {
                await staticContentService.deleteContent(selectedContentId);
                fetchContents();
            } catch (error) {
                console.error('Error deleting content:', error);
            }
        }
        setDeleteDialogOpen(false);
        setSelectedContentId(null);
    };

    return (
        <Card sx={{ maxWidth: '100%', margin: 'auto', mt: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>Static Content Management</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <Box sx={{ flex: '1 1 30%' }}>
                        <TextField
                            fullWidth
                            label="Search Content"
                            value={searchText}
                            onChange={handleSearchChange}
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                    <Box sx={{ flex: '1 1 15%' }}>
                        <Select
                            fullWidth
                            value=""
                            displayEmpty
                            size="small"
                        >
                            <MenuItem value="">All Types</MenuItem>
                            <MenuItem value="page">Page</MenuItem>
                            <MenuItem value="blog">Blog</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{ flex: '1 1 15%' }}>
                        <TextField
                            fullWidth
                            type="date"
                            label="From"
                            InputLabelProps={{ shrink: true }}
                            value={dateRange.from}
                            onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
                            size="small"
                        />
                    </Box>
                    <Box sx={{ flex: '1 1 15%' }}>
                        <TextField
                            fullWidth
                            type="date"
                            label="To"
                            InputLabelProps={{ shrink: true }}
                            value={dateRange.to}
                            onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
                            size="small"
                        />
                    </Box>
                    <Box sx={{ flex: '1 1 15%' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => navigate('/static-content/add')}
                            sx={{ 
                                height: '40px',
                                bgcolor: '#546FFF',
                                '&:hover': {
                                    bgcolor: '#7C91FF',
                                }
                            }}
                        >
                            Add Content
                        </Button>
                    </Box>
                </Box>

                <TableContainer component={Box} sx={{ boxShadow: 1 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Meta Title</TableCell>
                                <TableCell>Keywords</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Last Updated</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : contents.map((content) => (
                                <TableRow key={content.id}>
                                    <TableCell>{content.title}</TableCell>
                                    <TableCell>{content.metaTitle}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {content.metaKeywords.map((keyword, index) => (
                                                <Chip
                                                    key={index}
                                                    label={keyword}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    bgcolor: content.active ? 'success.main' : 'text.disabled'
                                                }}
                                            />
                                            <Switch
                                                checked={content.active}
                                                onChange={() => content.id && handleStatusToggle(content.id)}
                                                color="primary"
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(content.updatedAt || '').toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{ 
                                                    color: '#546FFF',
                                                    borderColor: '#546FFF',
                                                    '&:hover': {
                                                        borderColor: '#7C91FF',
                                                        color: '#7C91FF',
                                                    }
                                                }}
                                                onClick={() => content.id && navigate(`/static-content/view/${content.id}`)}
                                                startIcon={<ViewIcon />}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => content.id && navigate(`/static-content/edit/${content.id}`)}
                                                startIcon={<EditIcon />}
                                            >
                                                Edit
                                            </Button>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => content.id && handleDeleteClick(content.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalElements}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>

                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this content? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleDeleteConfirm} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default StaticContentList;
