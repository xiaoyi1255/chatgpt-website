import { ss } from '@/utils/storage'

const LOCAL_NAME = 'SECRET_TOKEN'
const LOCAL_TOKEN = 'WC_TOKEN'

export function getToken() {
  return ss.get(LOCAL_NAME)
}

export function setToken(token: string) {
  return ss.set(LOCAL_NAME, token)
}

export function removeToken() {
  return ss.remove(LOCAL_NAME)
}

export function getWechatToken() {
  return ss.get(LOCAL_TOKEN)
}

export function setWechatToken(token: string) {
  return ss.set(LOCAL_TOKEN, token)
}

export function removetWechatToken() {
  return ss.remove(LOCAL_TOKEN)
}