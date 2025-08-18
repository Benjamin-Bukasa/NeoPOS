// 📁 src/stores/useUserStore.js
import useAuthStore from './authStore';

export const useUserStore = () => {
  const { user } = useAuthStore.getState();
  return { user };
};
