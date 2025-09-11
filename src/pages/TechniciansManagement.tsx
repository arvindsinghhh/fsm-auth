import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTechnicians } from '../services/technicianService';
import { Technician } from '../types/technician';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
// Remove Grid import, use Grid from '@mui/material' directly
// Use Grid from '@mui/material' instead

const TechnicianList: React.FC = () => {
	const [technicians, setTechnicians] = useState<Technician[]>([]);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('');
	const [dateRange, setDateRange] = useState({ from: '', to: '' });
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		fetchTechnicians({ search, status, from: dateRange.from, to: dateRange.to })
			.then(data => setTechnicians(data.technicians || []))
			.finally(() => setLoading(false));
	}, [search, status, dateRange]);

	return (
		<Card sx={{ maxWidth: '100%', margin: 'auto', mt: 2, boxShadow: 3 }}>
			<CardContent>
				<Typography variant="h5" gutterBottom>Technicians</Typography>
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
					<Box sx={{ flex: '1 1 30%' }}>
						<TextField
							fullWidth
							label="Search by Name or Email"
							value={search}
							onChange={e => setSearch(e.target.value)}
							variant="outlined"
							size="small"
						/>
					</Box>
					<Box sx={{ flex: '1 1 15%' }}>
						<Select
							fullWidth
							value={status}
							onChange={e => setStatus(e.target.value)}
							displayEmpty
							size="small"
						>
							<MenuItem value="">All Status</MenuItem>
							<MenuItem value="Active">Active</MenuItem>
							<MenuItem value="Inactive">Inactive</MenuItem>
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
							onClick={() => navigate('/technicians/add')}
							sx={{ height: '40px' }}
						>
							Add Technician
						</Button>
					</Box>
				</Box>
				<TableContainer component={Box} sx={{ boxShadow: 1 }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Mobile</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Assigned Leads</TableCell>
								<TableCell>Join Date</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={7} align="center">
										<CircularProgress size={24} />
									</TableCell>
								</TableRow>
							) : (
								technicians.map(tech => (
									<TableRow key={tech.id}>
										<TableCell>{tech.name}</TableCell>
										<TableCell>{tech.email}</TableCell>
										<TableCell>{tech.mobile}</TableCell>
										<TableCell>{tech.status}</TableCell>
										<TableCell>
											<Button size="small" onClick={() => navigate(`/technicians/${tech.id}/leads`)}>
												{tech.assignedLeads}
											</Button>
										</TableCell>
										<TableCell>{tech.joinDate}</TableCell>
										<TableCell>
											<Button size="small" variant="outlined" onClick={() => navigate(`/technicians/${tech.id}`)} sx={{ mr: 1 }}>View</Button>
											<Button size="small" variant="contained" color="secondary" onClick={() => navigate(`/technicians/${tech.id}/edit`)}>Edit</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</CardContent>
		</Card>
	);
};

export default TechnicianList;
