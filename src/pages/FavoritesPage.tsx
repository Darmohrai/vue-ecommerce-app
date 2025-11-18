import React from 'react';
import ProductCard from '../components/ProductCard';
import { useCartAndFavoritesStore } from '../store/store';
import { Heart } from 'lucide-react';

const FavoritesPage: React.FC = () => {
    // Дістаємо список улюблених товарів зі стору (зберігається в localStorage)
    const favorites = useCartAndFavoritesStore(state => state.favorites);

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2 flex items-center">
                <Heart className="w-7 h-7 text-red-500 mr-2 fill-red-500" />
                Улюблені товари ({favorites.length})
            </h1>

            {favorites.length === 0 ? (
                <div className="text-center p-16 bg-white rounded-lg shadow-lg">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Список улюбленого порожній</h2>
                    <p className="text-gray-500">
                        Додайте товари, які вам сподобалися, натиснувши на сердечко на картці товару.
                    </p>
                    <a
                        href="/"
                        className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Перейти до каталогу
                    </a>
                </div>
            ) : (
                // Відображаємо улюблені товари у вигляді сітки
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {favorites.map(product => (
                        // Використовуємо ту ж картку, що і на головній сторінці
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;