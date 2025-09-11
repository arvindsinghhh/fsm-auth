import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TechnicianList from '../pages/TechniciansManagement';
import TechnicianDetail from '../pages/TechnicianDetail';
import AddTechnician from '../pages/AddTechnician';
import EditTechnician from '../pages/EditTechnician';
import LeadActions from '../pages/LeadActions';

const AppRoutes = () => (
	<Routes>
		<Route path="/technicians" element={<TechnicianList />} />
		<Route path="/technicians/add" element={<AddTechnician />} />
		<Route path="/technicians/:id" element={<TechnicianDetail />} />
		<Route path="/technicians/:id/edit" element={<EditTechnician />} />
		<Route path="/technicians/:id/leads" element={<TechnicianDetail />} />
		<Route path="/leads/:leadId/actions" element={<LeadActions />} />
		{/* ...other routes... */}
	</Routes>
);

export default AppRoutes;
