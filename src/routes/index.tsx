import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TechniciansManagement from '../pages/TechniciansManagement';
import TechnicianDetail from '../pages/TechnicianDetail';
import LeadActions from '../pages/LeadActions';

const AppRoutes = () => (
  <Routes>
    <Route path="/technicians" element={<TechniciansManagement />} />
    <Route path="/technicians/:id" element={<TechnicianDetail />} />
    <Route path="/technicians/:id/leads" element={<TechnicianDetail />} />
    <Route path="/leads/:leadId/actions" element={<LeadActions />} />
    {/* ...other routes... */}
  </Routes>
);

export default AppRoutes;
