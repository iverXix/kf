<template>
	<view class="page">
		<swiper class="swiper" :autoplay="true">
			<swiper-item v-for="(item, index) in bannerList" :key="index">
				<image class="swiperImg" :src="item.img" mode="aspectFill" @click="navigateTo(item.redirect_link)"></image>
			</swiper-item>
		</swiper>
		<view class="customerServiceList">
			<view :class="item.name === '6号牙问诊' ? 'item item1' : 'item'" v-for="(item, index) in customerServiceList" :key="index">
				<view class="left">
					<image v-if="item.name === '6号牙问诊'" class="icon" src="../../static/icon_ya.png"></image>
					<image v-else class="icon" src="../../static/icon_wenzhen.png"></image>
					<view class="info">
						<view class="title">{{ item.name }}</view>
						<view class="title1">在线咨询 预约挂号</view>
					</view>
				</view>
				<view class="btn" @click="navigateTo(item.link)">点击问诊</view>
			</view>
		</view>
		<view class="knowledgeZoneList">
			<view class="headerTitle">知识区</view>
			<view class="list">
				<view class="item" v-for="(item, index) in knowledgeZoneList" :key="index" @click="navigateTo(item.redirect_link)">
					<image class="icon" :src="item.cover_img"></image>
					<view class="title">{{ item.name }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import requestApi from '@/api/home.js';
import icon_doctor from '@/static/icon_doctor.png';
export default {
	data() {
		return {
			bannerList: [],
			knowledgeZoneList: [
				{
					cover_img: icon_doctor,
					name: '6号牙名医',
					redirect_link: '/pages/doctor/index'
				}
			],
			customerServiceList: []
		};
	},
	onLoad() {
		this.getBanner();
	},
	methods: {
		getBanner() {
			requestApi.getBanner().then(({ data }) => {
				// console.log(data)
				this.bannerList = data;
				this.getKnowledgeZone();
				this.getCustomerService();
			});
		},
		getKnowledgeZone() {
			requestApi.getKnowledgeZone().then(async ({ data }) => {
				this.knowledgeZoneList = [...this.knowledgeZoneList, ...data];
			});
		},
		getCustomerService() {
			requestApi.getCustomerService({
				channel: this.$store.state.user.channel,//访问被store分出去的user模块里的state的channel
			}).then(async ({ data }) => {
				const customerServiceList = await data.filter(item => {
					return item.name !== '6号牙问诊';
				});
				const customerService = await data.filter(item => {
					return item.name === '6号牙问诊';
				});
				this.customerServiceList = [...customerService, ...customerServiceList];
				// console.log('csL=',this.customerServiceList)
			});
		},
		navigateTo(url) {
			// console.log(url)
			this.$utils.navigateTo(url);//相当于vm.$utils,因为utils被挂载到了vue原型上
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	padding: 25rpx;
	box-sizing: border-box;
	padding-bottom: 100rpx;
	.swiper {
		width: 700rpx;
		height: 428rpx;
		.swiperImg {
			width: 700rpx;
			height: 428rpx;
			border-radius: 30rpx;
		}
	}
	.customerServiceList {
		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: linear-gradient(108.41deg, #dbeeff 33.76%, #b1d3f2 68.27%);
			border-radius: 72rpx;
			padding: 0 44rpx;
			height: 144rpx;
			margin-top: 40rpx;
			.left {
				display: flex;
				align-items: center;
				.icon {
					width: 112rpx;
					height: 112rpx;
					margin-right: 6rpx;
					flex: 0 0 112rpx;
				}
				.title {
					font-weight: 400;
					font-size: 34rpx;
					color: #7390b7;
					margin-bottom: 4rpx;
				}
				.title1 {
					font-weight: 400;
					font-size: 24rpx;
					color: #7390b7;
				}
			}
			.btn {
				background: linear-gradient(305.93deg, #b1d4f3 22.06%, #dbeeff 79.2%);
				border: 4rpx solid #e2f2ff;
				box-shadow: 0px 4rpx 24rpx #b1d4f3;
				border-radius: 40rpx;
				text-align: center;
				font-weight: 400;
				font-size: 30rpx;
				line-height: 74rpx;
				height: 80rpx;
				width: 184rpx;
				color: #7390b7;
				box-sizing: border-box;
				flex: 0 0 184rpx;
			}
		}
		.item1 {
			background: linear-gradient(108.41deg, #f4dfb9 33.76%, #ecd4a9 68.27%);
			.left {
				.title {
					color: #5c4113;
				}
				.title1 {
					color: #644614;
				}
			}
			.btn {
				background: linear-gradient(305.93deg, #e2c183 22.06%, rgba(228, 196, 137, 0.87667) 42.2%, rgba(234, 206, 155, 0.5) 79.2%);
				border: 2px solid #f5e6c9;
				box-shadow: 0px 2px 12px rgba(186, 135, 43, 0.5);
				color: #5c4113;
			}
		}
	}
	.knowledgeZoneList {
		margin: auto;
		padding: 30rpx 0;
		background: #ffffff;
		box-shadow: 0px 0px 16rpx rgba(0, 0, 0, 0.04);
		border-radius: 32rpx;
		box-sizing: border-box;
		margin-top: 50rpx;
		.headerTitle {
			font-weight: 400;
			font-size: 34rpx;
			color: #000000;
			padding: 0 40rpx;
		}
		.list {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			.item {
				width: 230rpx;
				flex: 0 0 230rpx;
				text-align: center;
				padding: 10rpx 0;
				box-sizing: border-box;
				margin-top: 30rpx;
				.icon {
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 10rpx;
				}
				.title {
					font-weight: 400;
					font-size: 28rpx;
					text-align: center;
					color: #5c4113;
				}
			}
		}
	}
}
</style>
