import { useCallback } from "react";

import {
  changePassword,
  getProfile,
  isAuthenticated,
  loginUser,
  logout,
  registerUser,
} from "../services/authService.jsx";

export default function useAuth() {
  const register = useCallback(async (payload) => registerUser(payload), []);
  const login = useCallback(async (payload) => loginUser(payload), []);
  const updatePassword = useCallback(async (payload) => changePassword(payload), []);
  const loadProfile = useCallback(async () => getProfile(), []);
  const signOut = useCallback(() => logout(), []);
  const isLoggedIn = useCallback(() => isAuthenticated(), []);

  return {
    register,
    login,
    updatePassword,
    loadProfile,
    signOut,
    isLoggedIn,
  };
}
