// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './layouts/ScrollToTop';

// Сторінки
import Home from './pages/HomePage';
import Cart from './pages/CartPage';
import Favorites from './pages/FavoritesPage'; // <-- НОВИЙ ІМПОРТ
import NotFound from './pages/NotFoundPage';

function App() {
    return (
        <BrowserRouter>
            {/* ScrollToTop - компонент для вимоги Scroll Behavior */}
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="favorites" element={<Favorites />} /> {/* <-- НОВИЙ РОУТ */}

                    {/* Сторінка 404 (вимога лаби) */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;