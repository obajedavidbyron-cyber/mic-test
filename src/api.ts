import axios from "axios";
import { User, MarketplaceListing, Reel, Booking, QuoteRequest, Message, MarketplaceCategory } from "./types";

const API = axios.create({
  baseURL: "/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("rental_token");
    if (token) {
      if (typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("rental_token");
      localStorage.removeItem("rental_user");
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: any) => {
    const res = await API.post<{ user: User; token: string }>("/auth/register", data);
    localStorage.setItem("rental_token", res.data.token);
    localStorage.setItem("rental_user", JSON.stringify(res.data.user));
    return res.data;
  },
  login: async (data: any) => {
    const res = await API.post<{ user: User; token: string }>("/auth/login", data);
    localStorage.setItem("rental_token", res.data.token);
    localStorage.setItem("rental_user", JSON.stringify(res.data.user));
    return res.data;
  },
  resetPassword: async (data: { email: string; newPassword: string }) => {
    const res = await API.post<{ message: string }>("/auth/reset-password", data);
    return res.data;
  },
  logout: () => {
    localStorage.removeItem("rental_token");
    localStorage.removeItem("rental_user");
  },
  getProfile: async () => {
    const res = await API.get<User>("/users/profile");
    return res.data;
  },
  updateProfile: async (data: { name?: string; phone?: string; role?: "tenant" | "landlord" }) => {
    const res = await API.put<User>("/users/profile", data);
    localStorage.setItem("rental_user", JSON.stringify(res.data));
    return res.data;
  },
  getCurrentUser: (): User | null => {
    const u = localStorage.getItem("rental_user");
    const token = localStorage.getItem("rental_token");
    if (!u || !token) return null;
    try {
      return JSON.parse(u);
    } catch {
      return null;
    }
  }
};

export const propertyAPI = {
  getAll: async (filters: any = {}) => {
    const res = await API.get<{ listings: MarketplaceListing[]; properties: MarketplaceListing[]; total: number }>("/listings", { params: filters });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await API.get<MarketplaceListing>(`/listings/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await API.post<MarketplaceListing>("/listings", data);
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await API.put<MarketplaceListing>(`/listings/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await API.delete<{ message: string }>(`/listings/${id}`);
    return res.data;
  },
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await API.post<{ imageUrl: string }>("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  }
};

export const reelAPI = {
  getReels: async (category?: MarketplaceCategory) => {
    const res = await API.get<Reel[]>("/reels", { params: { category } });
    return res.data;
  },
  likeReel: async (id: string) => {
    const res = await API.post<Reel>(`/reels/${id}/like`);
    return res.data;
  }
};

export const bookingAPI = {
  getBookings: async () => {
    const res = await API.get<Booking[]>("/bookings");
    return res.data;
  },
  createBooking: async (data: {
    listingId: string;
    startDate: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    guestsCount?: number;
    totalAmountKES?: number;
    notes?: string;
  }) => {
    const res = await API.post<Booking>("/bookings", data);
    return res.data;
  }
};

export const quoteAPI = {
  getQuoteRequests: async () => {
    const res = await API.get<QuoteRequest[]>("/quote-requests");
    return res.data;
  },
  createQuoteRequest: async (data: {
    serviceId: string;
    details: string;
    fromAddress?: string;
    toAddress?: string;
    preferredDate?: string;
  }) => {
    const res = await API.post<QuoteRequest>("/quote-requests", data);
    return res.data;
  }
};

export const favoriteAPI = {
  getFavorites: async () => {
    const res = await API.get<MarketplaceListing[]>("/favorites");
    return res.data;
  },
  toggleFavorite: async (id: string) => {
    const res = await API.post<{ message: string; isFavorite: boolean }>(`/properties/${id}/favorite`);
    return res.data;
  }
};

export const messageAPI = {
  getMessages: async () => {
    const res = await API.get<Message[]>("/messages");
    return res.data;
  },
  sendMessage: async (propertyId: string, message: string) => {
    const res = await API.post<{ message: string; data: Message }>(`/properties/${propertyId}/contact`, { message });
    return res.data;
  }
};

export default API;
