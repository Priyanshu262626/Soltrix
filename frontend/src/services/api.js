import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to format responses and standard server errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Read clean exception messages structured by backend or Axios
    const serverMessage = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(serverMessage));
  }
);

export const api = {
  // Authentication
  auth: {
    signup: (name, email, password, isAdmin) =>
      apiClient.post('/auth/signup', { name, email, password, admin: isAdmin }),

    login: (email, password) =>
      apiClient.post('/auth/login', { email, password }),
  },

  // Products
  products: {
    getAll: (search = '', category = '') => {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      return apiClient.get('/products', { params });
    },

    getById: (id) =>
      apiClient.get(`/products/${id}`),

    create: (productData) =>
      apiClient.post('/products', productData),

    update: (id, productData) =>
      apiClient.put(`/products/${id}`, productData),

    delete: (id) =>
      apiClient.delete(`/products/${id}`),
  },

  // Cart
  cart: {
    get: () =>
      apiClient.get('/cart'),

    addItem: (productId, quantity, size) =>
      apiClient.post('/cart/items', { productId, quantity, size }),

    updateQuantity: (itemId, quantity) =>
      apiClient.put(`/cart/items/${itemId}`, null, { params: { quantity } }),

    removeItem: (itemId) =>
      apiClient.delete(`/cart/items/${itemId}`),

    clear: () =>
      apiClient.delete('/cart'),
  },

  // Orders
  orders: {
    checkout: (shippingAddress) =>
      apiClient.post('/orders', { shippingAddress }),

    getMyOrders: () =>
      apiClient.get('/orders'),

    getDetails: (orderId) =>
      apiClient.get(`/orders/${orderId}`),
  },

  // Wishlist
  wishlist: {
    get: () =>
      apiClient.get('/wishlist'),

    add: (productId) =>
      apiClient.post(`/wishlist/add/${productId}`),

    remove: (productId) =>
      apiClient.delete(`/wishlist/remove/${productId}`),

    check: (productId) =>
      apiClient.get(`/wishlist/check/${productId}`),
  },

  // Admin Order Management
  admin: {
    getAllOrders: () =>
      apiClient.get('/admin/orders'),

    updateOrderStatus: (orderId, status) =>
      apiClient.put(`/admin/orders/${orderId}/status`, null, { params: { status } }),
  },

  // User Profile
  user: {
    getProfile: () =>
      apiClient.get('/user/profile'),

    updateProfile: (profileData) =>
      apiClient.put('/user/profile', profileData),
  },
};

