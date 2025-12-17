import React, { useState } from 'react';
import { dishAPI } from '../services/api';
import {
  TextField, Button, Box, Typography,
  Paper, Container, Alert, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DishForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const categories = [
    'Завтраки',
    'Салаты',
    'Основные блюда',
    'Десерты',
    'Напитки',
    'Закуски'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Введите название';
    if (!formData.description.trim()) newErrors.description = 'Введите описание';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Введите корректную цену';
    if (!formData.category) newErrors.category = 'Выберите категорию';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const dishData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      await dishAPI.create(dishData);
      alert('Блюдо успешно добавлено!');
      navigate('/'); // Возвращаемся на главную
    } catch (error) {
      console.error('Ошибка:', error);
      setSubmitError('Не удалось добавить блюдо. Проверьте данные.');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Добавить новое блюдо
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Название блюда"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            select
            label="Категория"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={!!errors.category}
            helperText={errors.category}
            margin="normal"
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Описание"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            margin="normal"
            multiline
            rows={3}
            required
          />

          <TextField
            fullWidth
            label="Цена ($)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            margin="normal"
            inputProps={{ step: "0.01", min: "0" }}
            required
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained">
              Добавить блюдо
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')}>
              Отмена
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DishForm;