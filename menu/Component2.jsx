import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton,
  Paper 
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Calendar from './Calendar';
import api from '../utils/api';

const taskTypeNames = {
  1: 'Học Tập',
  2: 'Công Việc',
  3: 'Gia Đình',
  4: 'Hàng Ngày',
  5: 'Hàng Tháng',
  6: 'Hàng Năm'
};

const Component2 = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentWeekTasks, setCurrentWeekTasks] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [openDayDialog, setOpenDayDialog] = useState(false);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const tasks = [];
        for (let type = 1; type <= 6; type++) {
          const data = await api.getTasksByType(type);
          if (data) {
            console.log('Fetched tasks for type', type, ':', data);
            tasks.push(...data);
          }
        }
        setCurrentWeekTasks(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchAllTasks();
    const intervalId = setInterval(fetchAllTasks, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const getCurrentWeekDates = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);

    const weekDays = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDays.push({
        name: days[i],
        date: date,
        isToday: date.toDateString() === now.toDateString()
      });
    }

    return weekDays;
  };

  const checkDateHasTask = (date) => {
    return currentWeekTasks.some(task => {
      const [startDateStr] = task.timeStart.split(' ');
      const [startDay, startMonth, startYear] = startDateStr.split('/').map(Number);
      const startDate = new Date(startYear, startMonth - 1, startDay);
      
      const [endDateStr] = task.timeEnd.split(' ');
      const [endDay, endMonth, endYear] = endDateStr.split('/').map(Number);
      const endDate = new Date(endYear, endMonth - 1, endDay);

      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const getTasksForDate = (date) => {
    return currentWeekTasks.filter(task => {
      const [startDateStr] = task.timeStart.split(' ');
      const [startDay, startMonth, startYear] = startDateStr.split('/').map(Number);
      const startDate = new Date(startYear, startMonth - 1, startDay);
      
      const [endDateStr] = task.timeEnd.split(' ');
      const [endDay, endMonth, endYear] = endDateStr.split('/').map(Number);
      const endDate = new Date(endYear, endMonth - 1, endDay);

      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setOpenDayDialog(true);
  };

  const handleDayDialogClose = () => {
    setOpenDayDialog(false);
    setSelectedDay(null);
  };

  const weekDays = getCurrentWeekDates();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, p: 5, bgcolor: '#f3f2f1' }}>
      {weekDays.map((day) => (
        <Box
          key={day.name}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box
            onClick={() => handleDayClick(day)}
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: checkDateHasTask(day.date) ? '#0078d4' : 
                      day.isToday ? '#005a9e' : '#e1e1e1',
              color: (checkDateHasTask(day.date) || day.isToday) ? '#fff' : '#323130',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: checkDateHasTask(day.date) || day.isToday 
                ? '0 2px 8px rgb(0 120 212 / 0.3)'
                : 'none',
              transition: 'all 0.25s ease',
              userSelect: 'none',
              '&:hover': {
                bgcolor: checkDateHasTask(day.date) ? '#005a9e' : 
                       day.isToday ? '#004578' : '#d4d4d4',
                transform: 'scale(1.12)',
                boxShadow: '0 4px 12px rgb(0 120 212 / 0.4)',
              }
            }}
          >
            <Typography sx={{ pointerEvents: 'none' }}>
              {day.name}
            </Typography>
          </Box>

          {day.name === 'Sun' && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: '#0078d4',
                color: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 3px 10px rgb(0 120 212 / 0.4)',
                userSelect: 'none',
              }}
            >
              <IconButton 
                onClick={() => setOpenDialog(true)} 
                sx={{ color: '#fff', p: 0, '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                aria-label="Open calendar"
              >
                <CalendarMonthIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      ))}

      {/* Dialog cho lịch đầy đủ */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            width: '700px',
            height: '700px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            borderRadius: 2,
            boxShadow: '0 8px 24px rgb(0 0 0 / 0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e1e1e1',
          backgroundColor: '#f3f2f1',
          padding: '16px 24px',
          fontWeight: 700,
          fontSize: '1.25rem',
          color: '#323130',
        }}>
          Lịch Công Việc
        </DialogTitle>
        <DialogContent sx={{ padding: '25px', overflowY: 'auto' }}>
          <Calendar />
        </DialogContent>
      </Dialog>

      {/* Dialog cho ngày được chọn */}
      <Dialog 
        open={openDayDialog} 
        onClose={handleDayDialogClose}
        PaperProps={{
          sx: {
            width: '500px',
            maxWidth: '90vw',
            borderRadius: 2,
            boxShadow: '0 8px 24px rgb(0 0 0 / 0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e1e1e1',
          backgroundColor: '#f3f2f1',
          padding: '16px 24px',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#323130',
        }}>
          {selectedDay && `Công việc ${selectedDay.date.toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}`}
        </DialogTitle>
        <DialogContent sx={{ padding: '25px' }}>
          {selectedDay && getTasksForDate(selectedDay.date).map((task, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: '#fff',
                borderRadius: 2,
                border: '1px solid #e1e1e1',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 12px rgb(0 120 212 / 0.2)',
                  cursor: 'pointer'
                }
              }}
            >
              <Typography variant="subtitle1" fontWeight="700" color="#0078d4" gutterBottom>
                {task.task_uname}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {task.timeStart.split(' ')[1]} - {task.timeEnd.split(' ')[1]}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: '#323130' }}>
                {task.task_description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {taskTypeNames[task.task_type_id]} - {task.status}
              </Typography>
            </Paper>
          ))}
          {selectedDay && getTasksForDate(selectedDay.date).length === 0 && (
            <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
              Không có công việc nào.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Component2;
