import React from 'react';
import { useCartAndFavoritesStore } from '../store/store';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import type { ICartItem } from '../types';

const CartPage: React.FC = () => {
    const { cart, updateQuantity, removeFromCart } = useCartAndFavoritesStore();

    // Загальна сума
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const formattedTotal = new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'USD'
    }).format(total);

    // Компонент для рядка товару в кошику
    const CartItemRow: React.FC<{ item: ICartItem }> = ({ item }) => {
        const formattedPrice = new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'USD'
        }).format(item.price);

        const formattedSubtotal = new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'USD'
        }).format(item.price * item.quantity);

        return (
            <li className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">

                {/* Інформація про товар */}
                <div className="flex items-center flex-grow">
                    <img
                        src={item.images?.[0] || 'https://via.placeholder.com/64'}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
                        <p className="text-gray-500 text-sm">{formattedPrice}</p>
                    </div>
                </div>

                {/* Керування кількістю */}
                <div className="flex items-center space-x-2 mx-4">
                    <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 border border-gray-300 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                        disabled={item.quantity <= 1}
                    >
                        <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                    >
                        <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Сума та видалення */}
                <div className="flex items-center space-x-6 ml-auto">
          <span className="text-lg font-bold text-gray-800 w-24 text-right hidden sm:block">
            {formattedSubtotal}
          </span>
                    <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition"
                        aria-label={`Remove ${item.title} from cart`}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </li>
        );
    };


    if (cart.length === 0) {
        return (
            <div className="text-center p-16 bg-white rounded-lg shadow-lg">
                <ShoppingCart className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Ваш кошик порожній</h2>
                <p className="text-gray-500">Додайте товари з каталогу, щоб оформити замовлення.</p>
                <a
                    href="/"
                    className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    Перейти до каталогу
                </a>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">Кошик товарів ({cart.length})</h1>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200 p-4">
                    {cart.map(item => (
                        <CartItemRow key={item.id} item={item} />
                    ))}
                </ul>

                {/* Підсумок */}
                <div className="p-6 bg-gray-50 border-t">
                    <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                        <span>Загальна сума:</span>
                        <span className="text-indigo-600">{formattedTotal}</span>
                    </div>
                    <button
                        className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition"
                    >
                        Оформити замовлення
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;