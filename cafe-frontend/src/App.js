import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddPage from './pages/AddPage';

function App() {
  return (
    <Router>
      {/* Навигационная панель */}
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Кафе "Уютное место"
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Главная
            </Button>
            <Button color="inherit" component={Link} to="/add">
              Добавить блюдо
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Основной контент */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;