import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectIsInitialized,
  login,
  register,
  logout,
  fetchMe,
  clearError,
} from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isInitialized = useSelector(selectIsInitialized);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    login: (data) => dispatch(login(data)),
    register: (data) => dispatch(register(data)),
    logout: () => dispatch(logout()),
    fetchMe: () => dispatch(fetchMe()),
    clearError: () => dispatch(clearError()),
  };
};