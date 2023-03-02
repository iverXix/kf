<script>
import appConfig from '@/utils/appConfig.js';
import qs  from 'qs'
export default {
	onLaunch: function(option) {
		const noTokenUrlArray = [...appConfig.noTokenUrlArray];
		const queryObj = qs.parse(window.location.search.split('?')[1]);
		const queryObj1 = qs.parse(window.location.hash.split('?')[1]);
		//Object.assign（第一个参数为目标对象，...一个或者多个源对象）方法可以用来将源对象（source）中所有可枚举（枚举：就是可以遍历出来，不可枚举就是遍历不出来）的属性，
		//复制到目标对象（target），也就是合并两个对象或多个对象给目标对象，注意：第一个参数一定是目标对象
		const myQueryObj = Object.assign(queryObj, queryObj1);//将queryObj1可枚举的合并到queryObj上
		if (myQueryObj.token) {//有token 跳回上传给后端的链接并带上token,再通过链接去获取token
			this.$store.dispatch('setToken', option.path);
		} else {
			const ua = window.navigator.userAgent.toLowerCase();
			if (ua.indexOf('micromessenger') > -1) {
				// 微信浏览器
				if (noTokenUrlArray.indexOf(option.path) === -1) {
					// 需要token的页面
					if (!this.$store.state.user.token) {
						this.$store.dispatch('login', option.path);
					} else {
						this.$store.commit('set_RedirectUrl')
						this.$store.commit('set_channel', myQueryObj.channel ? myQueryObj.channel : 1)
					}
				}
			} else {
				// 其他浏览器
			}
		}
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/*每个页面公共css */
</style>
