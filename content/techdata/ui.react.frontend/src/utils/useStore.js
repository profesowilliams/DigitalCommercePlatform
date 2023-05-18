import create from 'zustand'

export const useStore = create((set) => ({
  isLoggedIn: false,
  refreshRenewalDetailApi: false,
  userData: null,
  changeLoggedInState: (newLoggedInState) =>
    set((state) => ({ isLoggedIn: newLoggedInState })),
  changeRefreshDetailApiState: () =>
    set((state) => ({
      refreshRenewalDetailApi: !state.refreshRenewalDetailApi,
    })),
  setUserData: () => {
      set((state) => ({ userData: userData }));
  },
}));