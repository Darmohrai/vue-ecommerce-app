import React, { useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProductsStore } from '../store/store';
import { Search, ChevronLeft, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import Filters from '../components/Filters';

const HomePage: React.FC = () => {
    // Дістаємо стан та екшени з продакт-стору
    const {
        products,
        categories,
        loading,
        error,
        limit,
        offset,
        totalItems,
        titleFilter,
        minPriceFilter,
        maxPriceFilter,
        categoryFilterId,
        fetchProducts,
        fetchCategories,
        setPage,
        setFilters
    } = useProductsStore();

    const [searchParams, setSearchParams] = useSearchParams();

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = offset / limit + 1;

    // --- 1. ФУНКЦІЯ: Оновлення URL (НЕ ЧІПАЄ СТОР) ---
    const updateUrlParams = useCallback((newFilters: Record<string, string | number | null>) => {
        const current = Object.fromEntries(searchParams.entries());
        const mergedParams: Record<string, string> = {};
        const temp = { ...current, ...newFilters };

        if (temp.title) mergedParams.title = String(temp.title);
        if (Number(temp.minPrice) > 0) mergedParams.minPrice = String(temp.minPrice);
        if (Number(temp.maxPrice) < 99999 && Number(temp.maxPrice) > 0) mergedParams.maxPrice = String(temp.maxPrice);
        if (temp.category && Number(temp.category) > 0) mergedParams.category = String(temp.category);
        if (Number(temp.page) > 1) mergedParams.page = String(temp.page);

        setSearchParams(mergedParams, { replace: true });
    }, [searchParams, setSearchParams]);


    // --- 2. ЛОГІКА ЗАВАНТАЖЕННЯ ДАНИХ ---
    // ВИПРАВЛЕННЯ: Прибрано 'loading' із залежностей, щоб уникнути нескінченного циклу
    const loadProducts = useCallback(() => {
        // Якщо ми вже вантажимо, не запускаємо знову (читаємо актуальне значення з store, якщо потрібно, але тут це guard clause)
        if (loading) return;

        fetchProducts({
            limit,
            offset,
            title: titleFilter,
            price_min: minPriceFilter,
            price_max: maxPriceFilter,
            categoryId: categoryFilterId ?? undefined
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset, titleFilter, minPriceFilter, maxPriceFilter, categoryFilterId, fetchProducts]);
    // ^^^ Ми прибрали 'loading' з цього масиву!


    // ТРИГЕР ЗАВАНТАЖЕННЯ (useEffect #1)
    useEffect(() => {
        loadProducts();
    }, [loadProducts]);


    // --- 3. СИНХРОНІЗАЦІЯ URL -> СТОР (useEffect #2) ---
    // ВИПРАВЛЕННЯ: Використовуємо searchParams.toString() для стабільності залежностей
    const paramsString = searchParams.toString();

    useEffect(() => {
        if (categories.length === 0) {
            fetchCategories();
        }

        const urlTitle = searchParams.get('title') || '';
        const urlMinPrice = Number(searchParams.get('minPrice')) || 0;
        const urlMaxPrice = Number(searchParams.get('maxPrice')) || 99999;
        const urlCategoryParam = searchParams.get('category');
        const urlCategory = urlCategoryParam ? Number(urlCategoryParam) : null;
        const urlPage = Number(searchParams.get('page')) || 1;

        const newOffset = (urlPage - 1) * limit;

        // Встановлюємо фільтри (це скидає offset на 0 у сторі)
        setFilters({
            title: urlTitle,
            minPrice: urlMinPrice,
            maxPrice: urlMaxPrice,
            categoryId: urlCategory
        });

        // Якщо сторінка > 1, відновлюємо offset
        if (urlPage > 1) {
            setPage(newOffset);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsString, fetchCategories, limit, setFilters, setPage, categories.length]);


    // --- 4. ОБРОБНИКИ КЛІКУ ---
    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        updateUrlParams({ page: newPage });
    };

    const handleFilterChange = (newFilters: { title?: string, minPrice?: number, maxPrice?: number, categoryId?: number | null }) => {
        updateUrlParams({
            title: newFilters.title ?? null,
            minPrice: newFilters.minPrice ?? null,
            maxPrice: newFilters.maxPrice ?? null,
            category: newFilters.categoryId ?? null,
            page: 1
        });
    };

    if (error) {
        return (
            <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg mt-10 mx-auto max-w-2xl">
                <h2 className="text-xl font-bold mb-2">Помилка завантаження</h2>
                <p>{error}</p>
                <button
                    onClick={() => loadProducts()} // Force reload
                    className="mt-4 flex items-center mx-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    <RefreshCw className="w-4 h-4 mr-2"/> Спробувати знову
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Колонка Фільтрів */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md sticky top-24"> {/* top-24 щоб не перекривало хедер */}
                    <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                        <Search className="w-5 h-5 mr-2"/> Фільтри
                    </h2>
                    <Filters
                        categories={categories}
                        onFilterChange={handleFilterChange}
                        currentFilters={{ titleFilter, minPriceFilter, maxPriceFilter, categoryFilterId }}
                    />
                </div>
            </div>

            {/* Колонка Продуктів */}
            <div className="lg:col-span-3">
                {loading && products.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                        <p className="ml-3 text-xl text-gray-600">Завантаження...</p>
                    </div>
                ) : (
                    <>
                        {products.length === 0 ? (
                            <div className="text-center p-12 bg-gray-100 rounded-lg">
                                <h2 className="text-2xl font-bold text-gray-600">Продукти не знайдено</h2>
                                <p className="text-gray-500 mt-2">Спробуйте змінити параметри пошуку.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Пагінація */}
                        {totalItems > 0 && (
                            <div className="mt-10 flex justify-center items-center space-x-4 pb-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || loading}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" /> Попередня
                                </button>

                                <span className="text-gray-700 font-medium bg-white px-4 py-2 rounded-lg border">
                                    Сторінка {currentPage} з {totalPages || 1}
                                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages || loading}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition"
                                >
                                    Наступна <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;