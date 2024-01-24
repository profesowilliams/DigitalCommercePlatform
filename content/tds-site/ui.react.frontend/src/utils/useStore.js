import create from 'zustand'



export const useStore = create((set, get) => {
  return {
    isLoggedIn: false,
    refreshOrderTrackingDetailApi: { lineDetails: false, settings: false },
    userData: null,
    changeLoggedInState: (newLoggedInState) =>
      set((state) => ({ isLoggedIn: newLoggedInState })),
    changeRefreshDetailApiState: (id) =>
      set((state) => ({
        refreshOrderTrackingDetailApi: {
          ...state.refreshOrderTrackingDetailApi,
          [id]: !state.refreshOrderTrackingDetailApi[id],
        },
      })),
    setUserData: (userData) => {
      set((state) => ({ userData: userData }));
    },
  };
});