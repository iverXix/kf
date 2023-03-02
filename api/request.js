// 目前没有针对uni的Fly版本，使用wx版本没有问题
import store from '@/store'
import requestConfig from '@/utils/appConfig'
// H5版本
// #ifdef H5
import Fly from 'flyio/dist/npm/fly'
// #endif

//微信小程序和APP版本
// #ifndef H5
// import Fly from 'flyio/dist/npm/wx'
// #endif

const flyRequest = new Fly()
let isLoginIng = false

flyRequest.interceptors.request.use((request) => {
	if (!request.headers.noShowLoading) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		})
	}
	// 防止缓存
	if (request.method === 'POST' && request.headers['Content-Type'] !== 'multipart/form-data') {
		request.body = {
			...request.body,
			_t: Date.parse(new Date()) / 1000,
		}
	} else if (request.method === 'GET') {
		request.params = {
			_t: Date.parse(new Date()) / 1000,
			...request.body,
		}
	}
	request.baseURL = requestConfig.BASE_API
	const token = store.state.user.token
	if (token) {
		request.headers['Authorization'] = token
	}
	return request
})

flyRequest.interceptors.response.use(
	function(response) {
		// console.log('respone',response)
		//不要使用箭头函数，否则调用this.lock()时，this指向不对
		let errmsg = ''
		const data = response.data
		if (!data || typeof data !== 'object') {
			errmsg = '服务器响应格式错误'
			uni.showToast({
				title: errmsg,
				icon: 'none',
			})
			return Promise.reject(data.error)
		}
		if (data.code !== 200) {
			if (data.code === 40101 || data.code === 40102) {
				if (!isLoginIng) {
					isLoginIng = true
					return store
						.dispatch('login')
						.then(() => {
							isLoginIng = false
							// return flyRequest.request(response.request)
						})
						.finally(() => {})
				}
			}
			if (data.code === 30200) {
				// 拉黑重定向
				return window.location.href = data.error
			}
			uni.showToast({
				title: data.error,
				icon: 'none',
			})
			return Promise.reject(data.error)
		}
		if (!response.request.headers.noShowLoading) {
			uni.hideLoading()
		}
		return Promise.resolve(response.data) //只返回业务数据部分
	},
	function(err) {
		uni.hideLoading()
		let errmsg = err.error
		switch (err.code) {
			case 0:
				errmsg = '网络连接错误'
				uni.showToast({
					title: errmsg,
					icon: 'none',
				})
				break
			case 40101:
			case 40102:
				store.dispatch('login', {
					source_id: '',
				})
				break
			default:
				uni.showToast({
					title: errmsg,
					icon: 'none',
				})
		}
		return Promise.reject(errmsg)
	}
)

export default flyRequest
export {
	flyRequest
}
