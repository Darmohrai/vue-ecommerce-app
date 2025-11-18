import React from 'react';
import { Frown } from 'lucide-react';

// Реалізація сторінки 404 (вимога лаби)
const NotFoundPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-white rounded-lg shadow-lg p-16">
            <Frown className="w-20 h-20 text-red-500 mb-6" />
            <h1 className="text-5xl font-extrabold text-gray-800 mb-3">404</h1>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Сторінка не знайдена</h2>
            <p className="text-gray-500 mb-6">Нам дуже шкода, але запитана вами сторінка не існує.</p>
            <a
                href="/"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-150"
            >
                Повернутися на головну
            </a>
        </div>
    );
};

export default NotFoundPage;