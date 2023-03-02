import dayjs from 'dayjs'
import Vue from 'vue'
import store from '@/store/index.js'
const Utils = {}
Utils.setTime = (time) => {
  if (!time) {
    return ''
  }
  return dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')
}
Utils.navigateTo = (url) => {//看传入的url是哪种类型，通过indexof检测存在哪种字符串
	if (url.indexOf('http') > -1) {
		window.location.href = url
	} else {
		if (url.indexOf('?') > -1) {
			url = `${url}&channel=${store.state.user.channel}`
		} else {
			url = `${url}?channel=${store.state.user.channel}`
		}
		uni.navigateTo({
		  url,
		})
	}
}
Utils.cutStr = (str, L) => {
  let result = ''
  const strlen = str.length
  const chrlen = str.replace(/[^\x00-\xff]/g, '**').length
  if (chrlen <= L) {
    return str
  }
  for (var i = 0, j = 0; i < strlen; i++) {
    const chr = str.charAt(i)
    if (/[\x00-\xff]/.test(chr)) {
      j++
    } else {
      j += 2
    }
    if (j <= L) {
      result += chr
    } else {
      return result
    }
  }
}
Vue.prototype.$utils = Utils
export default Utils
