import Vue from 'vue'
let config = {}
switch (process.env.NODE_ENV) {
	case 'development': {
		config = {//开始调用微信js的方法
			upImg_url: '/common/upload/image', // 图片上传接口
			BASE_API: `http://dev.rainchapter.com/delun_kefu/v1/api/fronted`, // 请求链接
			storeKey: 'rainchapte_delunKefu_dev_store', // 缓存key
			shareInfo: {
				title: '6号牙在线问诊', // 分享标题
				desc: '', // 分享描述
				link: window.location.origin + window.location.pathname, // 分享链接
				imgUrl: (window.location.origin + window.location.pathname).split('index.html')[0] +
				'static/share.png', // 分享图标
			},
			homePath: 'pages/index/index', // 首页路由
			noTokenUrlArray: [] // 不需要token的页面
		}
		break
	}
	case 'production': {
		config = {
			upImg_url: '/common/upload/image', // 图片上传接口
			// BASE_API: `http://dev.rainchapter.com/delun_kefu/v1/api/fronted`, // 请求链接
			BASE_API: `https://dltgh5.delunykyy.com/delun_kefu/v1/api/fronted`, // 请求链接
			storeKey: 'rainchapte_delunKefu_prod_store', // 缓存key
			shareInfo: {
				title: '6号牙在线问诊', // 分享标题
				desc: '', // 分享描述
				link: window.location.origin + window.location.pathname, // 分享链接
				imgUrl: (window.location.origin + window.location.pathname).split('index.html')[0] +
				'static/share.png', // 分享图标
			},
			homePath: 'pages/index/index', // 首页路由
			noTokenUrlArray: [] // 不需要token的页面
		}
	}
}
Vue.prototype.$appConfig = config
export default config
