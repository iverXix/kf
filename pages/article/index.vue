<template>
	<view class="page">
		<template v-if="info">
			<view class="header">
				<view class="title">{{ info.title }}</view>
				<view class="time_view">
					<view class="time">{{ info.create_time }}</view>
					<view class="view_total">浏览次数：{{ info.view_total }}</view>
				</view>
			</view>
			<view v-if="info.content" class="uParse"><uParse :content="info.content" /></view>
		</template>
	</view>
</template>

<script>
import requestApi from '@/api/article.js';
import uParse from '@/components/feng-parse/parse.vue';
import dayjs from 'dayjs'
export default {
	components: {
		uParse
	},
	data() {
		return {
			// info: {
			// 	title: '6号牙课堂标题',
			// 	content: '<img src=\"https://hlxq-dev.oss-cn-shenzhen.aliyuncs.com/image/20230112_1673533645847.jpg\" />',
			// 	view_total: '20',
			// 	created_at: '2023-01-04 00:00:00'
			// },
			info: null,
			id: ''
		};
	},
	onLoad(option) {
		this.id = option.id;
		this.getArticle();
	},
	methods: {
		getArticle() {
			requestApi
				.getArticle({
					id: this.id
				})
				.then(async ({ data }) => {
					this.info = {
						...data,
						create_time: dayjs(data.create_time).format('YYYY-MM-DD HH:mm:ss')
					};
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	padding: 40rpx;
	box-sizing: border-box;
	.header {
		margin-bottom: 30rpx;
		.title {
			font-weight: 400;
			font-size: 40rpx;
			color: #000000;
			margin-bottom: 24rpx;
		}
		.time_view {
			font-weight: 400;
			font-size: 24rpx;
			color: rgba(0, 0, 0, 0.5);
			display: flex;
			align-items: center;
			justify-content: space-between;
			.time {
			}
			.view_total {
			}
		}
	}
	.uParse {
		color: rgba(0, 0, 0, 0.9);
		font-size: 32rpx;
	}
}
</style>
