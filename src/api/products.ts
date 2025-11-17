import axios from 'axios';
import type { IProduct, ICategory } from '../types'; // <-- Додаємо 'type'

const API_URL = 'https://api.escuelajs.co/api/v1';

// Налаштування базового екземпляру Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Інтерфейс для параметрів фільтрації
interface FetchProductsParams {
    limit?: number;
    offset?: number;
    title?: string;
    price_min?: number;
    price_max?: number;
    categoryId?: number;
}

/**
 * Отримати список продуктів з можливістю фільтрації та пагінації.
 */
export async function getProducts(params: FetchProductsParams): Promise<{ products: IProduct[]; totalItems: number }> {
    try {
        // API Platzi Fake Store не має хедера X-Total-Count, тому для пагінації
        // нам потрібно дістати всі продукти (це не ідеально, але для лаби підходить)
        const allProductsResponse = await api.get<IProduct[]>('/products', {
            params: {
                title: params.title,
                price_min: params.price_min,
                price_max: params.price_max,
                categoryId: params.categoryId,
            }
        });

        const totalItems = allProductsResponse.data.length;
        let products = allProductsResponse.data;

        // Ручна пагінація на стороні клієнта (через обмеження API)
        if (params.offset !== undefined && params.limit !== undefined) {
            products = products.slice(params.offset, params.offset + params.limit);
        }

        // В API Platzi іноді приходить пусте поле category, треба це виправити
        const cleanedProducts = products.filter(p => p.category !== null);

        return { products: cleanedProducts, totalItems };

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.data || error.message);
            throw new Error(`Помилка API: ${error.response?.statusText || 'Невідома помилка'}`);
        }
        throw new Error('Невідома помилка під час отримання продуктів.');
    }
}

/**
 * Отримати список категорій.
 */
export async function getCategories(): Promise<ICategory[]> {
    try {
        const response = await api.get<ICategory[]>('/categories');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.data || error.message);
            throw new Error(`Помилка API: ${error.response?.statusText || 'Невідома помилка'}`);
        }
        throw new Error('Невідома помилка під час отримання категорій.');
    }
}