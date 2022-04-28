import create from 'zustand'

export const useStore = create(set => ({
  isLoggedIn: false,
  changeLoggedInState: (newLoggedInState) => set(state => ({ isLoggedIn: newLoggedInState}))
}))