import React, { useState, useEffect } from 'react';
import { dishAPI } from '../services/api';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  Button, Box, Typography, Card, CardContent,
  Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DishList = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const navigate = useNavigate();

  // Загружаем блюда при запуске
  useEffect(() => {
    fetchDishes();
  }, []);

  // Функция загрузки блюд
  const fetchDishes = async () => {
    try {
      setLoading(true);
      const response = await dishAPI.getAll();
      setDishes(response.data);
      setFilteredDishes(response.data);
    } catch (error) {
      console.error('Ошибка загрузки блюд:', error);
      alert('Не удалось загрузить блюда');
    } finally {
      setLoading(false);
    }
  };

  // Поиск блюд
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDishes(dishes);
    } else {
      const filtered = dishes.filter(dish =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDishes(filtered);
    }
  }, [searchTerm, dishes]);

  // Удаление блюда
  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это блюдо?')) {
      try {
        await dishAPI.delete(id);
        fetchDishes(); // Обновляем список
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Не удалось удалить блюдо');
      }
    }
  };

  // Открытие диалога редактирования
  const handleEdit = (dish) => {
    setSelectedDish(dish);
    setOpenDialog(true);
  };

  // Сохранение изменений
  const handleSave = async () => {
    try {
      await dishAPI.update(selectedDish.id, selectedDish);
      setOpenDialog(false);
      fetchDishes();
      alert('Блюдо обновлено!');
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert('Не удалось обновить блюдо');
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок и кнопки */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Меню кафе</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Поле поиска */}
          <TextField
            placeholder="Поиск блюд..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
          {/* Кнопка добавления */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/add')}
          >
            Добавить блюдо
          </Button>
        </Box>
      </Box>

      {/* Таблица блюд */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Цена ($)</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDishes.map((dish) => (
              <TableRow key={dish.id}>
                <TableCell>{dish.id}</TableCell>
                <TableCell>{dish.name}</TableCell>
                <TableCell>{dish.category}</TableCell>
                <TableCell>{dish.description}</TableCell>
                <TableCell>${dish.price.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(dish)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(dish.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог редактирования */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Редактировать блюдо</DialogTitle>
        <DialogContent>
          {selectedDish && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Название"
                value={selectedDish.name}
                onChange={(e) => setSelectedDish({...selectedDish, name: e.target.value})}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Категория"
                value={selectedDish.category}
                onChange={(e) => setSelectedDish({...selectedDish, category: e.target.value})}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Описание"
                value={selectedDish.description}
                onChange={(e) => setSelectedDish({...selectedDish, description: e.target.value})}
                margin="normal"
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Цена"
                type="number"
                value={selectedDish.price}
                onChange={(e) => setSelectedDish({...selectedDish, price: parseFloat(e.target.value)})}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DishList;