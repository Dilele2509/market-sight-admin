import { create } from 'zustand'

interface Auth {
    accessToken: string | null
    setAccessToken: (token: string | null) => void
}

export const useAuth = create<Auth>((set) => ({
    accessToken: null,
    setAccessToken: (token) => set({ accessToken: token }),
})) 