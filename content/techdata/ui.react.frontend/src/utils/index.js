import { nanoid } from 'nanoid'

export const createSessionId = () => nanoid(16)

export const setSessionId = (sessionId) =>
  localStorage.setItem('sessionId', sessionId)

export const getSessionId = () => localStorage.getItem('sessionId')

export const signOut = () => {
  const { protocol, hostname, port, pathname } = window.location
  localStorage.removeItem('sessionId')
  localStorage.removeItem('signin')
  localStorage.removeItem('signout')
  localStorage.removeItem('userData')
  localStorage.removeItem('signInCode')
  window.location.href = `${protocol}//${hostname}${
    port !== '80' ? `:${port}` : ''
  }${pathname}`
}

export const getUser = () => JSON.parse(localStorage.getItem('userData'))

export const getUrlParams = () =>
  Object.fromEntries(
    new Map(
      window.location.search
        .replace('?', '')
        .split('&')
        .map((item) => item.split('='))
    )
  )
