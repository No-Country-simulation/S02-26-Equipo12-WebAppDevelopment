import { type StateCreator } from 'zustand'

// TODO: import from user interface folder
interface User {
  id: string
  name: string
  lastname: string
  gender: string
  email: string
}

export const AUTH_STATUS = {
  UNAUTHENTICATED: 'unauthenticated',
  AUTHENTICATED: 'authenticated',
  LOADING: 'loading'
} as const

export type AuthStatus =
  typeof AUTH_STATUS[keyof typeof AUTH_STATUS]

export interface AuthSlice {
  user: User | null
  state: AuthStatus

  login: (user: User) => void
  logout: () => void
}

export const createAuthSlice: StateCreator<
  AuthSlice
> = (set) => ({
  user: null,
  state: AUTH_STATUS.LOADING,

  login(user: User) {
    set(({
      user,
      state: AUTH_STATUS.AUTHENTICATED
    }))
  },
  logout() {
    set(({
      user: null,
      state: AUTH_STATUS.UNAUTHENTICATED
    }))
  }
})
