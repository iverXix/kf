import request from '@/api/request'
export default {
  getLoginUrl(data) {
    return request.post('/auth/loginUrl', data)
  }
}
