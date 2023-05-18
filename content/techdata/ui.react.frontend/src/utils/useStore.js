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
  setUserData: async () => {
    console.log('setting user data');
    await getSessionInfo().then((data) => {
      console.log('user data: ', data[1]);
      set((state) => ({ userData: data[1] }));
    });
  },
}));