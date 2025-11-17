// Базові інтерфейси для API

export interface ICategory {
    id: number;
    name: string;
    image: string;
}

export interface IProduct {
    id: number;
    title: string;
    price: number;
    description: string;
    images: string[];
    creationAt: string;
    updatedAt: string;
    category: ICategory;
}

// Інтерфейси для Стор-Логіки (Кошик та Обране)

export interface ICartItem extends IProduct {
    quantity: number;
}

export interface IFavoritesItem extends IProduct {
    // Додаткових полів не потрібно, просто зберігаємо продукт
}

// Інтерфейси для State Management
export interface IProductsStore {
    products: IProduct[];
    categories: ICategory[];
    loading: boolean;
    error: string | null;
    limit: number;
    offset: number;
    totalItems: number; // Для пагінації

    // Фільтри
    titleFilter: string;
    minPriceFilter: number;
    maxPriceFilter: number;
    categoryFilterId: number | null;

    // Actions
    fetchProducts: (params?: { limit?: number; offset?: number; title?: string; price_min?: number; price_max?: number; categoryId?: number }) => Promise<void>;
    fetchCategories: () => Promise<void>;
    setFilters: (filters: { title?: string; minPrice?: number; maxPrice?: number; categoryId?: number | null }) => void;
    setPage: (newOffset: number) => void;
}

export interface ICartAndFavoritesStore {
    cart: ICartItem[];
    favorites: IFavoritesItem[];

    // Actions
    addToCart: (product: IProduct) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;

    addToFavorites: (product: IProduct) => void;
    removeFromFavorites: (productId: number) => void;
}