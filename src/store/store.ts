import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import type { // <-- Додаємо 'type'
    IProduct,
    ICategory,
    ICartItem,
    IFavoritesItem,
    IProductsStore,
    ICartAndFavoritesStore
} from '../types';
import * as api from '../api/products';

// === СТОР ДЛЯ ПРОДУКТІВ ТА ФІЛЬТРІВ ===

export const useProductsStore = create<IProductsStore>((set, get) => ({
    products: [],
    categories: [],
    loading: false,
    error: null,
    limit: 10, // Базовий ліміт для пагінації
    offset: 0,
    totalItems: 0,

    // Фільтри
    titleFilter: '',
    minPriceFilter: 0,
    maxPriceFilter: 99999, // Максимальна ціна
    categoryFilterId: null,

    fetchProducts: async (params = {}) => {
        set({loading: true, error: null});
        const {limit, offset, titleFilter, minPriceFilter, maxPriceFilter, categoryFilterId} = get();

        // Параметри для API
        // Параметри для API
        const apiParams = {
            limit: params.limit ?? limit,
            offset: params.offset ?? offset,
            title: params.title ?? titleFilter,
            price_min: params.minPrice ?? minPriceFilter,
            price_max: params.maxPrice ?? maxPriceFilter,
            // FIX: Якщо categoryId === null, передаємо undefined
            categoryId: (params.categoryId ?? categoryFilterId) ?? undefined,
        };

        try {
            const {products, totalItems} = await api.getProducts(apiParams);
            set({
                products,
                totalItems,
                loading: false,
                offset: apiParams.offset ?? offset // Зберігаємо новий offset
            });
        } catch (e: any) {
            set({error: e.message || 'Помилка завантаження продуктів', loading: false});
        }
    },

    fetchCategories: async () => {
        try {
            const categories = await api.getCategories();
            set({categories});
        } catch (e: any) {
            // Тут можна додатково обробити помилку
            console.error("Failed to fetch categories:", e);
        }
    },

    setFilters: (filters) => {
        set((state) => ({
            titleFilter: filters.title !== undefined ? filters.title : state.titleFilter,
            minPriceFilter: filters.minPrice !== undefined ? filters.minPrice : state.minPriceFilter,
            maxPriceFilter: filters.maxPrice !== undefined ? filters.maxPrice : state.maxPriceFilter,
            categoryFilterId: filters.categoryId !== undefined ? filters.categoryId : state.categoryFilterId,
            offset: 0, // Скидаємо пагінацію при зміні фільтрів
        }));
    },

    setPage: (newOffset) => {
        set({offset: newOffset});
    }
}));

// === СТОР ДЛЯ КОШИКА ТА ОБРАНОГО (З LOCALSTORAGE) ===

export const useCartAndFavoritesStore = create(
    persist<ICartAndFavoritesStore>(
        (set, get) => ({
            cart: [],
            favorites: [],

            // --- Кошик (Cart) ---
            addToCart: (product: IProduct) => {
                const {cart} = get();
                const existingItem = cart.find(item => item.id === product.id);

                if (existingItem) {
                    set({
                        cart: cart.map(item =>
                            item.id === product.id ? {...item, quantity: item.quantity + 1} : item
                        ),
                    });
                } else {
                    set({cart: [...cart, {...product, quantity: 1}]});
                }
            },

            removeFromCart: (productId: number) => {
                set((state) => ({
                    cart: state.cart.filter(item => item.id !== productId),
                }));
            },

            updateQuantity: (productId: number, quantity: number) => {
                if (quantity < 1) {
                    get().removeFromCart(productId);
                    return;
                }

                set((state) => ({
                    cart: state.cart.map(item =>
                        item.id === productId ? {...item, quantity: quantity} : item
                    ),
                }));
            },

            // --- Обране (Favorites) ---
            addToFavorites: (product: IProduct) => {
                const {favorites} = get();
                if (!favorites.find(item => item.id === product.id)) {
                    set({favorites: [...favorites, product]});
                }
            },

            removeFromFavorites: (productId: number) => {
                set((state) => ({
                    favorites: state.favorites.filter(item => item.id !== productId),
                }));
            },
        }),
        {
            name: 'ecommerce-storage', // Ключ у localStorage
            storage: createJSONStorage(() => localStorage), // Використовуємо localStorage
            partialize: (state) => ({cart: state.cart, favorites: state.favorites}),
        }
    )
);

// Допоміжний хук для перевірки наявності продукту в обраному
export const useIsFavorite = (productId: number) => {
    return useCartAndFavoritesStore(state =>
        !!state.favorites.find(item => item.id === productId)
    );
};