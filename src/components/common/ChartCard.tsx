import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ChartCardProps {
  title: string;
  data: any[];
  loading?: boolean;
  height?: number;
  dataKey: string;
  categories: string[];
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  loading = false,
  height = 300,
  dataKey,
  categories
}) => {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        height: '100%'
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {loading ? (
        <Box
          sx={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKey} />
            <YAxis />
            <Tooltip />
            {categories.map((category, index) => (
              <Bar
                key={category}
                dataKey={category}
                fill={`hsl(${(index * 360) / categories.length}, 70%, 50%)`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};
