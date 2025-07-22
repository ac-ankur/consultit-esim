import React, { createContext, useContext,useEffect, useState } from 'react';
import { useUser } from './UserContext';
import baseURL from '../API/baseUrl';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const {user} = useUser();
 
  useEffect(() => {
        fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
      try {
        const res = await fetch(`${baseURL}/product/get-all-product`, {
          headers: {
            Authorization: ''
          },
        });
        const data = await res.json();
        const tempProduct = await data?.data;
        // console.log(tempProduct)
        setProducts(tempProduct);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <ProductContext.Provider value={{ products, loading, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductContext);
};
