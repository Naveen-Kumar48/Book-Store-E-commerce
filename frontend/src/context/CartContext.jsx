import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (book) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === book._id);
            if (existingItem) {
                toast.success(`Increased quantity of ${book.title}`);
                return prevCart.map(item =>
                    item._id === book._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            toast.success(`Added ${book.title} to cart`);
            return [...prevCart, { ...book, quantity: 1 }];
        });
    };

    const removeFromCart = (bookId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== bookId));
        toast.success('Removed from cart');
    };

    const updateQuantity = (bookId, quantity) => {
        if (quantity < 1) return;
        setCart(prevCart => prevCart.map(item =>
            item._id === bookId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
        toast.success('Cart cleared');
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
