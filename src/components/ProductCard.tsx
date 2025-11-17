import React from 'react';
import type { IProduct } from '../types';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartAndFavoritesStore, useIsFavorite } from '../store/store';
import clsx from 'clsx'; // Для динамічних класів

interface ProductCardProps {
    product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    // Actions зі стору (виклик actions тільки в компонентах!)
    const { addToCart, addToFavorites, removeFromFavorites } = useCartAndFavoritesStore();
    const isFavorite = useIsFavorite(product.id);

    const handleToggleFavorite = () => {
        if (isFavorite) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    const formattedPrice = new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'USD'
    }).format(product.price);

    // Обробка зображень: API часто повертає неробочі посилання
    const imageUrl = product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition duration-300 hover:shadow-xl">

            {/* Зображення */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Якщо зображення не завантажилось, показуємо заглушку
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                    }}
                />

                {/* Кнопка "Обране" */}
                <button
                    onClick={handleToggleFavorite}
                    className={clsx(
                        "absolute top-3 right-3 p-2 rounded-full bg-white transition-colors duration-200",
                        isFavorite ? 'text-red-500 hover:text-red-700' : 'text-gray-400 hover:text-red-500'
                    )}
                    aria-label="Add to favorites"
                >
                    <Heart className="w-5 h-5 fill-current" />
                </button>
            </div>

            {/* Інформація про продукт */}
            <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-gray-500 uppercase mb-1">
          {product.category?.name || 'Без категорії'}
        </span>
                <h3 className="text-lg font-bold text-gray-800 mb-2 truncate" title={product.title}>
                    {product.title}
                </h3>

                <p className="text-xl font-extrabold text-indigo-600 mt-auto mb-3">
                    {formattedPrice}
                </p>

                {/* Кнопка "Додати до кошика" */}
                <button
                    onClick={() => addToCart(product)}
                    className="flex items-center justify-center w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-150"
                >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Додати до кошика
                </button>
            </div>
        </div>
    );
};

export default ProductCard;