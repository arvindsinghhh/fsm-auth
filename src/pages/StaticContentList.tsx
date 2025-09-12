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
    DialogTitle
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedContentId, setSelectedContentId] = useState<number | null>(null);

    const fetchContents = async () => {
        try {
            setLoading(true);
            const params: StaticContentListRequest = {
                pageNumber: page,
                pageSize: rowsPerPage,
                searchText: searchText || undefined,
                shortingField: 'createdAt',
                asc: false
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
    };

    useEffect(() => {
        fetchContents();
    }, [page, rowsPerPage, searchText]);

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
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" component="h2">
                    Static Content Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/static-content/add')}
                >
                    Add New Content
                </Button>
            </Box>

            <Box mb={3}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search"
                    value={searchText}
                    onChange={handleSearchChange}
                    sx={{ maxWidth: 500 }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Meta Title</TableCell>
                            <TableCell>Keywords</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Last Updated</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contents.map((content) => (
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
                                    <Switch
                                        checked={content.active}
                                        onChange={() => content.id && handleStatusToggle(content.id)}
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(content.updatedAt || '').toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => content.id && navigate(`/static-content/view/${content.id}`)}
                                        color="primary"
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => content.id && navigate(`/static-content/edit/${content.id}`)}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => content.id && handleDeleteClick(content.id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
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
        </Box>
    );
};

export default StaticContentList;
