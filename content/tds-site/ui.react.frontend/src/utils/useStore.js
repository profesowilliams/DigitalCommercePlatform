import create from 'zustand'

export const useStore = create((set) => ({
  isLoggedIn: false,
  refreshOrderTrackingDetailApi: false,
  userData: null,
  changeLoggedInState: (newLoggedInState) =>
    set((state) => ({ isLoggedIn: newLoggedInState })),
  changeRefreshDetailApiState: () =>
    set((state) => ({
      refreshOrderTrackingDetailApi: !state.refreshOrderTrackingDetailApi,
    })),
  setUserData: (userData) => {
    set((state) => ({ userData: userData }));
  },
}));