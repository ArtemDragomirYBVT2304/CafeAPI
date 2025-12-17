import axios from 'axios';

// Создаём экземпляр axios с базовым URL вашего API
const api = axios.create({
  baseURL: 'http://localhost:8000', // URL вашего FastAPI-сервера
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функции для работы с блюдами
export const dishAPI = {
  // Получить все блюда
  getAll: () => api.get('/dishes/'),

  // Получить одно блюдо по ID
  getById: (id) => api.get(`/dishes/${id}`),

  // Создать новое блюдо
  create: (dishData) => api.post('/dishes/', dishData),

  // Обновить блюдо
  update: (id, dishData) => api.put(`/dishes/${id}`, dishData),

  // Удалить блюдо
  delete: (id) => api.delete(`/dishes/${id}`),

  // Поиск и фильтрация
  search: (params) => api.get('/dishes/', { params }),
};

export default api;