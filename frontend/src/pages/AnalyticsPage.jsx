import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import API_PATHS from '../utils/apiPaths';
import { Container, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [month, setMonth] = useState(''); // format YYYY-MM

  const fetch = async () => {
    try {
      const url = month ? `${API_PATHS.TASKS.ANALYTICS}?month=${month}` : API_PATHS.TASKS.ANALYTICS;
      const res = await axios.get(url);
      setData(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetch(); }, [month]);

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Analytics</Typography>
        <Typography variant="body2" sx={{ my: 1 }}>Select month (optional):</Typography>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
        <button onClick={fetch}>Refresh</button>

        {data && (
          <>
            <Typography sx={{ mt: 2 }}>Total tasks: {data.total}</Typography>

            <Typography sx={{ mt: 1 }}>By status:</Typography>
            <List>
              {Object.entries(data.byStatus || {}).map(([k,v]) => (
                <ListItem key={k}><ListItemText primary={`${k}: ${v}`} /></ListItem>
              ))}
            </List>

            <Typography sx={{ mt: 1 }}>Stages summary:</Typography>
            <List>
              {Object.entries(data.stages || {}).map(([name, info]) => (
                <ListItem key={name}><ListItemText primary={`${name}: ${info.completed} / ${info.total} completed`} /></ListItem>
              ))}
            </List>
          </>
        )}
      </Paper>
    </Container>
  );
}
