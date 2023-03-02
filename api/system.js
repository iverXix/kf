import request from '@/api/request'
export default {
  getWeChatConfig(data) {
    return request.post('/auth/jssdk', data)
  }
}
