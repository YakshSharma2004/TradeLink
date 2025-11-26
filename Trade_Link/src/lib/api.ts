import { User, TradeListing, Message } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for fetch with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

// ============================================================================
// USERS
// ============================================================================

export async function getUsers(filters?: { role?: string; search?: string }): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI<User[]>(`/users${query}`);
}

export async function getUser(id: string): Promise<User> {
    return fetchAPI<User>(`/users/${id}`);
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return fetchAPI<User>('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
    return fetchAPI<User>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(userData),
    });
}

export async function deleteUser(id: string): Promise<void> {
    return fetchAPI<void>(`/users/${id}`, {
        method: 'DELETE',
    });
}

// ============================================================================
// TRADE LISTINGS
// ============================================================================

export interface TradeListingFilters {
    tradeType?: string;
    area?: string;
    minRate?: number;
    maxRate?: number;
    tradesmanId?: string;
    email?: string;
}

export async function getTradeListings(filters?: TradeListingFilters): Promise<TradeListing[]> {
    const params = new URLSearchParams();
    if (filters?.tradeType) params.append('tradeType', filters.tradeType);
    if (filters?.area) params.append('area', filters.area);
    if (filters?.minRate !== undefined) params.append('minRate', filters.minRate.toString());
    if (filters?.maxRate !== undefined) params.append('maxRate', filters.maxRate.toString());
    if (filters?.tradesmanId) params.append('tradesmanId', filters.tradesmanId);
    if (filters?.email) params.append('email', filters.email);

    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI<TradeListing[]>(`/trade-listings${query}`);
}

export async function getTradeListing(id: string): Promise<TradeListing> {
    return fetchAPI<TradeListing>(`/trade-listings/${id}`);
}

export async function createTradeListing(data: Omit<TradeListing, 'id' | 'createdAt'>): Promise<TradeListing> {
    return fetchAPI<TradeListing>('/trade-listings', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateTradeListing(id: string, data: Partial<TradeListing>): Promise<TradeListing> {
    return fetchAPI<TradeListing>(`/trade-listings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteTradeListing(id: string): Promise<void> {
    return fetchAPI<void>(`/trade-listings/${id}`, {
        method: 'DELETE',
    });
}

// ============================================================================
// MESSAGES
// ============================================================================

export interface Conversation {
    userId: string;
    userName: string;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
}

export async function getMessages(userId: string, otherUserId?: string): Promise<Message[]> {
    const params = new URLSearchParams();
    params.append('userId', userId);
    if (otherUserId) params.append('otherUserId', otherUserId);

    return fetchAPI<Message[]>(`/messages?${params.toString()}`);
}

export async function getConversations(userId: string): Promise<Conversation[]> {
    return fetchAPI<Conversation[]>(`/messages/conversations?userId=${userId}`);
}

export async function sendMessage(messageData: Omit<Message, 'id' | 'read'>): Promise<Message> {
    return fetchAPI<Message>('/messages', {
        method: 'POST',
        body: JSON.stringify(messageData),
    });
}

export async function markMessageAsRead(messageId: string): Promise<Message> {
    return fetchAPI<Message>(`/messages/${messageId}`, {
        method: 'PATCH',
        body: JSON.stringify({ read: true }),
    });
}

//==================================================================
//Authentication for signin and up
//==================================================================

export interface LoginData {
    email: string;
    role: string;
    name: string;
}

export interface SignUpData {
    email: string;
    name: string;
    role: 'builder' | 'tradesman' | 'other';
    phone?: string;
}

export async function login(loginData: LoginData): Promise<User> {
    return fetchAPI<User>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
    });
}
export function signup(signupData: SignUpData): Promise<User> {
    return fetchAPI<User>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(signupData),
    });
}
