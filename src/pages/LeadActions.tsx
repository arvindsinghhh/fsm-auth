import React from 'react';
import { useParams } from 'react-router-dom';
import { fetchLeadActions } from '../services/technicianService';

const LeadActions: React.FC = () => {
  const { leadId } = useParams();
  const [actions, setActions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetchLeadActions(leadId!).then(data => {
      setActions(data.actions || []);
      setLoading(false);
    });
  }, [leadId]);

  return (
    <div>
      <h2>Lead Actions</h2>
      {loading ? <div>Loading...</div> : (
        <ul>
          {actions.map((action, idx) => <li key={idx}>{action}</li>)}
        </ul>
      )}
    </div>
  );
};

export default LeadActions;
