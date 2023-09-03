import { defineStore } from 'pinia'
import { getToken, removeToken, setToken, getWechatToken, setWechatToken, removetWechatToken } from './helper'
import { store } from '@/store/helper'
import { fetchSession } from '@/api'

interface SessionResponse {
  auth: boolean
  model: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI'
}

export interface AuthState {
  token: string | undefined
  wcToken: string | undefined
  session: SessionResponse | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    session: null,
    wcToken: getWechatToken()
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      return state.session?.model === 'ChatGPTAPI'
    },
  },

  actions: {
    async getSession() {
      try {
        const { data } = await fetchSession<SessionResponse>()
        this.session = { ...data }
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    setWechatToken(token: string) {
      this.wcToken = token
      setWechatToken(token)
    },

    setToken(token: string) {
      this.token = token
      setToken(token)
    },

    removeToken() {
      this.token = undefined
      removeToken()
    },

    removeWechatToken() {
      this.wcToken = undefined
      removetWechatToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
