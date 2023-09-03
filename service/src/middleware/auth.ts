import { isNotEmptyString } from '../utils/is'
const redisCkient = require('../utils/redis');

const auth = async (req, res, next) => {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  const AUTH_LOGIN = process.env.AUTH_LOGIN
  if (isNotEmptyString(AUTH_SECRET_KEY)) {
    try {
      const Authorization = req.header('Authorization')
      const flag = !Authorization || Authorization.replace('Bearer ', '').trim() !== AUTH_SECRET_KEY.trim()
      if (flag) {
        throw new Error('Error: 无访问权限 | No access rights')
      }
    }
    catch (error) {
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
  } else if (AUTH_LOGIN !== 'xiaoyi') {
    try {
      const token = req.header('token')
      const redisToken = await redisCkient.get(token)
      const flag = !token || !redisToken || token.replace('Bearer ', '')?.trim() !== redisToken?.trim()
      if (flag) {
        throw new Error('Error: 验证码过期！请重新获取验证码')
      }
    } catch(error) {
      res.send({ status: 'Unauthorized', message: error.message ?? '请输入验证码', data: null })
    }
  } else {
    next()
  }
}

export { auth }
