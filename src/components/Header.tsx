// src/components/Header.tsx
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Store } from 'lucide-react';
import { useCartAndFavoritesStore } from '../store/store';

const Header = () => {
    // Дістаємо кількість товарів у кошику та обраному
    const cartItemCount = useCartAndFavoritesStore(state => state.cart.reduce((sum, item) => sum + item.quantity, 0));
    const favoriteCount = useCartAndFavoritesStore(state => state.favorites.length);

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">

                {/* Логотип / Головна сторінка */}
                <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center gap-2 hover:text-indigo-600 transition duration-150">
                    <Store className="w-6 h-6" />
                    FakeStore E-Commerce
                </Link>

                {/* Навігація */}
                <nav className="flex items-center space-x-6">

                    {/* Обране (Favorites) */}
                    <Link to="/favorites" className="relative text-gray-600 hover:text-red-500 transition duration-150" title="Улюблене"> {/* <-- ЗМІНЕНО: /favorites */}
                        <Heart className="w-6 h-6" />
                        {favoriteCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {favoriteCount}
              </span>
                        )}
                    </Link>

                    {/* Кошик (Cart) */}
                    <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600 transition duration-150" title="Кошик">
                        <ShoppingCart className="w-6 h-6" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
                        )}
                    </Link>

                </nav>
            </div>
        </header>
    );
};

export default Header;