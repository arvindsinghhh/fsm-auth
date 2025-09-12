import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TechniciansManagement from '../pages/TechniciansManagement';
import TechnicianDetail from '../pages/TechnicianDetail';
import LeadActions from '../pages/LeadActions';
import FrontOfficeManager from '../pages/FrontOfficeManager';
import CustomerManager from '../pages/CustomerManager';
import JobTypeManager from '../pages/JobTypeManager';
import { Dashboard } from '../pages/Dashboard';
import StaticPage from '../pages/StaticPage';
import StaticContentList from '../pages/StaticContentList';
import StaticContentForm from '../pages/StaticContentForm';
import StaticContentView from '../pages/StaticContentView';
 
const AppRoutes = () => (
  <Routes>
    <Route path="/front-office" element={<FrontOfficeManager />} />
    <Route path="/customers" element={<CustomerManager />} />
    <Route path="/job-types" element={<JobTypeManager />} />
    <Route path="/technicians" element={<TechniciansManagement />} />
    <Route path="/technicians/:id" element={<TechnicianDetail />} />
    <Route path="/technicians/:id/leads" element={<TechnicianDetail />} />
    <Route path="/leads/:leadId/actions" element={<LeadActions />} />
    <Route path="/dashboard" element={<Dashboard/>} />
    
    {/* Static Content Management */}
    <Route path="/static-content" element={<StaticContentList />} />
    <Route path="/static-content/add" element={<StaticContentForm />} />
    <Route path="/static-content/edit/:id" element={<StaticContentForm />} />
    <Route path="/static-content/view/:id" element={<StaticContentView />} />
    
    {/* Public Static Pages */}
    <Route path="/pages/:pageKey" element={<StaticPage />} />
  </Routes>
);

export default AppRoutes;
