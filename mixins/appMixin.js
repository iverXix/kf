import {
	mapState
} from 'vuex';
export default {
	install(Vue) {
		Vue.mixin({
			computed: {
				...mapState({}),
			},
			data() {
				return {
					
				}
			},
			onLoad() {

			},
			onShow() {
				const pageList = getCurrentPages()
				const pageInfo = pageList[pageList.length - 1]
				if (pageInfo) {
					this.$weChatApi.setShare({})
				}
			},
			methods: {
				
			}
		})
	}
}
