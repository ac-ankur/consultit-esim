

import { useState, useEffect, useCallback } from 'react';
import apiClient from './apiClient';


// Custom hook for API calls with loading states and error handling
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.userMessage || err.message || 'An error occurred');
      throw err;
    }
  }, []);

  const get = useCallback((url, config) => request(() => apiClient.get(url, config)), [request]);
  const post = useCallback((url, data, config) => request(() => apiClient.post(url, data, config)), [request]);
  const put = useCallback((url, data, config) => request(() => apiClient.put(url, data, config)), [request]);
  const patch = useCallback((url, data, config) => request(() => apiClient.patch(url, data, config)), [request]);
  const del = useCallback((url, config) => request(() => apiClient.delete(url, config)), [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    clearError: () => setError(null)
  };
}

// Hook for fetching data on component mount
export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { 
    dependencies = [], 
    skip = false,
    onSuccess,
    onError 
  } = options;

  const fetchData = useCallback(async () => {
    if (skip) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(url);
      setData(response.data);
      onSuccess?.(response.data);
    } catch (err) {
      const errorMessage = err.userMessage || err.message || 'Failed to fetch data';
      setError(errorMessage);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [url, skip, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Hook for mutations (POST, PUT, PATCH, DELETE)
export function useMutation(mutationFn, options = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  const { onSuccess, onError } = options;

  const mutate = useCallback(async (variables) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mutationFn(variables);
      setData(response.data);
      onSuccess?.(response.data, variables);
      return response.data;
    } catch (err) {
      const errorMessage = err.userMessage || err.message || 'Mutation failed';
      setError(errorMessage);
      onError?.(err, variables);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, onSuccess, onError]);

  return {
    mutate,
    loading,
    error,
    data,
    reset: () => {
      setData(null);
      setError(null);
      setLoading(false);
    }
  };
}