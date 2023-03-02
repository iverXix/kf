import requestApi from '@/api/system'
import store from '@/store'
import jweixin from 'jweixin-module'
import qs from 'qs'
import Vue from 'vue'
import appConfig from '@/utils/appConfig.js'
let initReady = false // 是否初始化成功
const weChat = {}
let setTimeoutNb = 0
// 1.判断是否是微信浏览器
weChat.isWechat = () => {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/micromessenger/i) == 'micromessenger') {
		// console.log(‘是微信客户端‘)
		return true;
	} else {
		// console.log(‘不是微信客户端‘)
		return false;
	}

}
weChat.init = () => {
	if (!weChat.isWechat()) {
		return 
	}
	console.log('store.state.user.redirectUrl', store.state.user.redirectUrl)
	requestApi
		.getWeChatConfig({//2.调用system的api生成signature，在utils/appConfig.js里封装好调用微信js的方法，引入appConfig.js使用
			url: store.state.user.redirectUrl,
		})
		.then((response) => {
			const {
				appId,
				timestamp,
				nonceStr,
				signature
			} = response.data
			jweixin.config({
				debug: false,
				appId,
				timestamp,
				nonceStr,
				signature,
				jsApiList: ['chooseWXPay', 'updateAppMessageShareData', 'updateTimelineShareData'],
			})
			jweixin.ready(function() {
				initReady = true
			})

			jweixin.error(function(res) {
				console.log(res)
			})
		})
}
weChat.chooseWXPay = ({
	timestamp,
	nonceStr,
	packageValue,
	paySign,
	signType
}, closeOrder) => {
	jweixin.chooseWXPay({
		timestamp,
		nonceStr,
		package: packageValue,
		signType,
		paySign,
		success: (res) => {
			closeOrder(true)
			console.log('支付成功')
		},
		cancel: (r) => {
			closeOrder(false)
			console.log('取消支付')
		},
		fail: (res) => {
			closeOrder(false)
			console.log('支付失败')
		},
	})
}
weChat.setShare = ({//调用appconfig的里的方法
	toPath = '',
	title = appConfig.shareInfo.title,
	desc = appConfig.shareInfo.desc,
	imgUrl = appConfig.shareInfo.imgUrl,
	
}) => {
	// 首页分享默认不带参数的，当传了toPath都会把参数带上
	if (!weChat.isWechat()) {
		return 
	}
	if (initReady) {
		const timestamp = new Date().getTime()
		let query = '?'
		const queryObj = qs.parse(window.location.search.split('?')[1])
		const queryObj1 = qs.parse(window.location.hash.split('?')[1])
		const myQueryObj = Object.assign(queryObj, queryObj1, {
			timestamp: timestamp
		})
		for (const i in myQueryObj) {
			if (i !== 'token') {
				query += `${i}=${myQueryObj[i]}&`
			}
		}
		query = query.substring(0, query.length - 1)
		toPath = appConfig.homePath
		const link = `${store.state.user.redirectUrl}#/${toPath}${query}`
		console.log('分享link', link)
		jweixin.updateAppMessageShareData({
			title, // 分享标题
			desc, // 分享描述
			link,
			imgUrl: imgUrl, // 分享图标
			success: function() {},
		})
		jweixin.updateTimelineShareData({
			title, // 分享标题
			link, // 分享链接
			imgUrl: imgUrl, // 分享图标
			success: function() {},
		})	
	} else {
		setTimeoutNb = setTimeoutNb + 1
		if (setTimeoutNb < 6) {
			weChat.init()
			setTimeout(() => {
				weChat.setShare({
					toPath,
					title,
					desc,
					imgUrl
				})
			}, 2000)
		}
	}
}
Vue.prototype.$weChatApi = weChat
export default weChat
