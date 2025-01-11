import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useReducer';
import { refreshAuthToken, logout } from '@/store/slices/authSlice';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { accessToken, expiresIn, createdAt } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken || !expiresIn || !createdAt) return;

    // Calculate time until token expires
    const tokenCreationTime = new Date(createdAt).getTime();
    const expiryTime = tokenCreationTime + (expiresIn * 1000);
    const timeUntilExpiry = expiryTime - Date.now();

    // If token is already expired, logout
    if (timeUntilExpiry <= 0) {
      dispatch(logout());
      navigate('/login');
      return;
    }

    // Refresh token 5 minutes before expiry
    const refreshTime = timeUntilExpiry - (5 * 60 * 1000);
    const refreshTimeout = setTimeout(() => {
      dispatch(refreshAuthToken())
        .unwrap()
        .catch(() => {
          // If refresh fails, logout and redirect to login
          dispatch(logout());
          navigate('/login');
        });
    }, refreshTime);

    // Setup periodic check for token expiry every minute
    const checkInterval = setInterval(() => {
      if (Date.now() >= expiryTime) {
        dispatch(logout());
        navigate('/login');
      }
    }, 60 * 1000);

    return () => {
      clearTimeout(refreshTimeout);
      clearInterval(checkInterval);
    };
  }, [accessToken, expiresIn, createdAt, dispatch, navigate]);

  return <>{children}</>;
};