import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTechnicianDetail, editTechnician, blockTechnician, unblockTechnician, fetchLeadActions } from '../services/technicianService';
import { Technician, TechnicianLead } from '../types/technician';

const TechnicianDetail: React.FC = () => {
  const { id } = useParams();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [leads, setLeads] = useState<TechnicianLead[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Technician>>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchTechnicianDetail(id!).then(data => {
      setTechnician(data.technician);
      setLeads(data.leads || []);
      setForm(data.technician);
    });
  }, [id]);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleSave = async () => {
    await editTechnician(id!, form);
    setEditing(false);
    fetchTechnicianDetail(id!).then(data => setTechnician(data.technician));
  };
  const handleBlock = async () => {
    await blockTechnician(id!);
    fetchTechnicianDetail(id!).then(data => setTechnician(data.technician));
  };
  const handleUnblock = async () => {
    await unblockTechnician(id!);
    fetchTechnicianDetail(id!).then(data => setTechnician(data.technician));
  };

  return (
    <div>
      <h2>Technician Details</h2>
      {technician ? (
        <div>
          <img src={technician.profileImage} alt="Profile" width={80} />
          <div>Name: {editing ? <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /> : technician.name}</div>
          <div>Email: {editing ? <input value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /> : technician.email}</div>
          <div>Mobile: {editing ? <input value={form.mobile || ''} onChange={e => setForm({ ...form, mobile: e.target.value })} /> : technician.mobile}</div>
          <div>Address: {editing ? <input value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} /> : technician.address}</div>
          <div>Status: {editing ? <select value={form.status || ''} onChange={e => setForm({ ...form, status: e.target.value as any })}><option value="Active">Active</option><option value="Inactive">Inactive</option></select> : technician.status}</div>
          <div>Availability: {technician.availability}</div>
          <div>Completed Jobs: {technician.completedJobs}</div>
           <div>
            {editing ? (
              <>
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={handleEdit}>Edit</button>
                {technician.status === 'Active' ? <button onClick={handleBlock}>Block</button> : <button onClick={handleUnblock}>Unblock</button>}
              </>
            )}
          </div>
          <h3>Assigned Leads/Jobs</h3>
          <table>
            <thead>
              <tr>
                <th>Lead ID</th>
                <th>Status</th>
                <th>Customer Feedback</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id}>
                  <td>{lead.id}</td>
                  <td>{lead.status}</td>
                  <td>
                    {lead.customerFeedback ? 
                      `${lead.customerFeedback.rating}/5 - ${lead.customerFeedback.comment}` : 
                      'No feedback yet'
                    }
                  </td>
                  <td><button onClick={async () => { const actions = await fetchLeadActions(lead.id); alert(JSON.stringify(actions)); }}>View Actions</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <div>Loading...</div>}
      <button onClick={() => navigate('/technicians')}>Back to List</button>
    </div>
  );
};

export default TechnicianDetail;
