import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // If user is a customer, load their database cart & wishlist
      if (parsedUser.role === 'ROLE_CUSTOMER') {
        loadCart();
        loadWishlist();
      }
    }
    setLoading(false);
  }, []);

  const loadCart = async () => {
    try {
      const userCart = await api.cart.get();
      setCart(userCart);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  const loadWishlist = async () => {
    try {
      const userWishlist = await api.wishlist.get();
      setWishlist(userWishlist);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.auth.login(email, password);
      localStorage.setItem('token', data.token);
      
      const loggedUser = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role
      };
      
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setToken(data.token);
      setUser(loggedUser);

      if (loggedUser.role === 'ROLE_CUSTOMER') {
        // Load their cart immediately
        const userCart = await api.cart.get();
        setCart(userCart);
        // Load their wishlist immediately
        const userWishlist = await api.wishlist.get();
        setWishlist(userWishlist);
      } else {
        setCart(null); // Admin has no cart
        setWishlist([]);
      }
      
      setLoading(false);
      return loggedUser;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signup = async (name, email, password, isAdmin) => {
    return await api.auth.signup(name, email, password, isAdmin);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setCart(null);
    setWishlist([]);
  };

  const updateUser = (updatedUser) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const newUser = { ...parsedUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  // Cart operations exposed globally
  const addToCart = async (productId, quantity, size) => {
    if (!user) throw new Error('Please login to add items to cart');
    try {
      const updatedCart = await api.cart.addItem(productId, quantity, size);
      setCart(updatedCart);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    try {
      const updatedCart = await api.cart.updateQuantity(itemId, quantity);
      setCart(updatedCart);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const updatedCart = await api.cart.removeItem(itemId);
      setCart(updatedCart);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await api.cart.clear();
      setCart({ cartItems: [] });
    } catch (err) {
      console.error(err);
    }
  };

  // Wishlist operations
  const addToWishlist = async (productId) => {
    if (!user) throw new Error('Please login to add items to wishlist');
    try {
      await api.wishlist.add(productId);
      await loadWishlist();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) throw new Error('Please login to remove items from wishlist');
    try {
      await api.wishlist.remove(productId);
      await loadWishlist();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) throw new Error('Please login to manage wishlist');
    const isFav = wishlist.some(item => item.product.id === productId);
    if (isFav) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product.id === productId);
  };

  const value = {
    user,
    token,
    cart,
    wishlist,
    loading,
    login,
    signup,
    logout,
    updateUser,
    loadCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
