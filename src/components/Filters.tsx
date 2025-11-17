import React, { useState, useEffect } from 'react';
import type { ICategory } from '../types';

interface FiltersProps {
    categories: ICategory[];
    currentFilters: {
        titleFilter: string;
        minPriceFilter: number;
        maxPriceFilter: number;
        categoryFilterId: number | null;
    };
    onFilterChange: (filters: { title?: string, minPrice?: number, maxPrice?: number, categoryId?: number | null }) => void;
}

const Filters: React.FC<FiltersProps> = ({ categories, currentFilters, onFilterChange }) => {
    // Локальний стан для полів вводу
    const [localTitle, setLocalTitle] = useState(currentFilters.titleFilter);
    const [localMinPrice, setLocalMinPrice] = useState(String(currentFilters.minPriceFilter));
    const [localMaxPrice, setLocalMaxPrice] = useState(String(currentFilters.maxPriceFilter));
    const [localCategory, setLocalCategory] = useState(String(currentFilters.categoryFilterId || ''));

    // Синхронізація локального стану з глобальним (при зміні URL)
    useEffect(() => {
        setLocalTitle(currentFilters.titleFilter);
        setLocalMinPrice(String(currentFilters.minPriceFilter));
        setLocalMaxPrice(String(currentFilters.maxPriceFilter));
        setLocalCategory(String(currentFilters.categoryFilterId || ''));
    }, [currentFilters]);

    // Обробка форми
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({
            title: localTitle,
            minPrice: Number(localMinPrice),
            maxPrice: Number(localMaxPrice),
            categoryId: localCategory ? Number(localCategory) : null,
        });
    };

    const handleClear = () => {
        setLocalTitle('');
        setLocalMinPrice('0');
        setLocalMaxPrice('99999');
        setLocalCategory('');
        onFilterChange({
            title: '',
            minPrice: 0,
            maxPrice: 99999,
            categoryId: null
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Фільтр за назвою */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Назва продукту</label>
                <input
                    id="title"
                    type="text"
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    placeholder="Пошук за назвою"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            {/* Фільтр за категорією */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Категорія</label>
                <select
                    id="category"
                    value={localCategory}
                    onChange={(e) => setLocalCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                    <option value="">Усі категорії</option>
                    {categories.map((cat) => (
                        cat.name && cat.id && (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        )
                    ))}
                </select>
            </div>

            {/* Фільтр за ціною */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Діапазон ціни (USD)</label>
                <div className="flex gap-3">
                    {/* Мінімальна ціна */}
                    <input
                        type="number"
                        value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(e.target.value)}
                        placeholder="Min Price"
                        min="0"
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {/* Максимальна ціна */}
                    <input
                        type="number"
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                        placeholder="Max Price"
                        min="0"
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    Застосувати
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                    Скинути
                </button>
            </div>

        </form>
    );
};

export default Filters;