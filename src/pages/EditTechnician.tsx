import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { editTechnician, fetchTechnicianDetail } from '../services/technicianService';
import { Technician } from '../types/technician';

const EditTechnician: React.FC = () => {
  const { id } = useParams();
  const [form, setForm] = useState<Partial<Technician>>({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTechnicianDetail(id!).then(data => setForm(data.technician));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.mobile) {
      setError('All fields are required');
      return;
    }
    try {
      await editTechnician(id!, form);
      navigate('/technicians');
    } catch (err) {
      setError('Update failed');
    }
  };

  return (
    <div>
      <h2>Edit Technician</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input name="name" value={form.name || ''} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" value={form.email || ''} onChange={handleChange} />
        </div>
        <div>
          <label>Mobile:</label>
          <input name="mobile" value={form.mobile || ''} onChange={handleChange} />
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={form.status || ''} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Update Technician</button>
      </form>
      <button onClick={() => navigate('/technicians')}>Back to List</button>
    </div>
  );
};

export default EditTechnician;
