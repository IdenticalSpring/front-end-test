import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const publicApi = axios.create({
  baseURL: API_URL,
});

const privateApi = axios.create({
  baseURL: API_URL,
});

privateApi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// PUBLIC ENDPOINTS 
export const register = (username, email, password) =>
  publicApi.post('/users/register', { username, email, password });

export const login = (username, password) =>
  publicApi.post('/auth/login', { username, password });

// PRIVATE ENDPOINTS 
export const getProfile = () => privateApi.get('/users/profile');

export const depositMoney = (amount) =>
  privateApi.post('/wallet/deposit', { amount });

// ADMIN ENDPOINTS
export const getPendingTransactions = () =>
  privateApi.get('/admin/wallet/pending-transactions');

export const confirmDeposit = (transactionId) =>
  privateApi.post('/admin/wallet/confirm-deposit', { transactionId });
export const getWalletByUserId = (userId) => {
  return privateApi.get(`/wallet/${userId}`);
};
export const updateWalletBalance = (userId, dto) => {
  return privateApi.put(`/wallet/${userId}`, dto);
};

// ADMIN BLOG ENDPOINTS
export const getBlogs = () => privateApi.get('/blogs');
export const updateBlog = (id, data) => privateApi.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => privateApi.delete(`/blogs/${id}`);
export const createBlog = (data) => privateApi.post('/blogs', data);
export const getBlogById = (id) => privateApi.get(`/blogs/${id}`);
// ADMIN FIELD ENDPOINTS
export const getFields = () => privateApi.get('/fields');
export const getFieldById = (id) => privateApi.get(`/fields/${id}`);
export const createField = (data) => privateApi.post('/fields', data);
export const updateField = (id, data) => privateApi.put(`/fields/${id}`, data);
export const deleteField = (id) => privateApi.delete(`/fields/${id}`);

// ORDER ENDPOINTS
export const createOrder = (orderData) => privateApi.post('/orders', orderData);
export const getOrders = () => privateApi.get('/orders');
export const getOrdersAll = () => privateApi.get('/orders/all');
export const getOrderById = (id) => privateApi.get(`/orders/${id}`);
export const updateOrder = (id, orderData) => privateApi.put(`/orders/${id}`, orderData);
export const deleteOrder = (id) => privateApi.delete(`/orders/${id}`);

// ADMIN USER ENDPOINTS
export const getUsers = () => privateApi.get('/admin/users');
export const updateUser = (id, userData) => privateApi.patch(`/admin/users/${id}`, userData);
export const disableUser = (id) => privateApi.delete(`/admin/users/${id}`);


// CONTACT ENDPOINTS
export const createContact = (data) => publicApi.post('/contacts', data);
export const getContacts = () => privateApi.get('/contacts');
export const getContactById = (id) => privateApi.get(`/contacts/${id}`);
export const updateContact = (id, data) => privateApi.put(`/contacts/${id}`, data);
export const deleteContact = (id) => privateApi.delete(`/contacts/${id}`);

