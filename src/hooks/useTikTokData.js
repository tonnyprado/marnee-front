/**
 * useTikTokData Hook
 * Detecta si el usuario tiene datos de TikTok disponibles
 * y proporciona estado de conexión
 */
import { useState, useEffect } from 'react';
import { getTikTokStatus } from '../services/tiktokApi';

export function useTikTokData() {
  const [state, setState] = useState({
    isLoading: true,
    isConnected: false,
    hasData: false,
    error: null,
    connectionInfo: null
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const status = await getTikTokStatus();

      setState({
        isLoading: false,
        isConnected: status.connected || false,
        hasData: status.connected || false,
        error: null,
        connectionInfo: status
      });
    } catch (error) {
      // Si el error es 404, significa que no hay conexión
      if (error.status === 404 || error.response?.status === 404) {
        setState({
          isLoading: false,
          isConnected: false,
          hasData: false,
          error: null,
          connectionInfo: null
        });
      } else {
        setState({
          isLoading: false,
          isConnected: false,
          hasData: false,
          error: error,
          connectionInfo: null
        });
      }
    }
  };

  const refresh = () => {
    checkConnection();
  };

  return {
    ...state,
    refresh
  };
}
