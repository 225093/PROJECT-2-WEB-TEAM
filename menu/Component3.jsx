import React, { useState } from 'react';
import {
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography
} from '@mui/material';

import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EventIcon from '@mui/icons-material/Event';
import TaskList from './TaskList';

const iconMap = {
  1: <SchoolIcon sx={{ fontSize: 50, color: '#1976d2', mb: 1 }} />,
  2: <WorkIcon sx={{ fontSize: 50, color: '#1976d2', mb: 1 }} />,
  3: <FamilyRestroomIcon sx={{ fontSize: 50, color: '#1976d2', mb: 1 }} />,
  4: <TodayIcon sx={{ fontSize: 50, color: '#1976d2', mb: 1 }} />,
  5: <DateRangeIcon sx={{ fontSize: 50, color: '#1976d2', mb: 1 }} />,
  6: <EventIcon sx={{ fontSize: 50, color: '#1976d2', mb: 1 }} />,
};

const items = [
  { id: 1, name: 'Học Tập' },
  { id: 2, name: 'Công Việc' },
  { id: 3, name: 'Gia Đình' },
  { id: 4, name: 'Hàng Ngày' },
  { id: 5, name: 'Hàng Tháng' },
  { id: 6, name: 'Hàng Năm' },
];

const Component3 = () => {
  const [open, setOpen] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState(null);

  const handleClickOpen = (taskTypeId) => {
    setSelectedTaskType(taskTypeId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTaskType(null);
  };

  return (
    <Box sx={{ flex: 1, pl: 2, mt: 12 }}>
      <Grid container spacing={3} justifyContent="center">
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Box
              onClick={() => handleClickOpen(item.id)}
              sx={{
                width: '100%',
                height: 180,
                bgcolor: '#f5f5f5',
                borderRadius: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 3,
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6,
                },
              }}
            >
              {iconMap[item.id]}
              <Typography variant="h6" color="primary" fontWeight="bold">
                {item.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth={false}>
        <DialogTitle>Danh Sách Nhiệm Vụ</DialogTitle>
        <DialogContent sx={{ width: 900, height: 600, overflowY: 'auto' }}>
          <TaskList taskTypeId={selectedTaskType} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Component3;
