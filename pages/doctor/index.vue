<template>
	<view class="page">
		<scroll-view class="nav1" scroll-x="true">
			<view
				:class="doctorInfo.doctor_category_id === item.id ? 'item active' : 'item'"
				v-for="(item, index) in doctorCategoryList"
				:key="index"
				@click="selectNav('doctor_category_id', item.id)"
			>
				{{ item.name }}
			</view>
		</scroll-view>
		<scroll-view class="nav2" scroll-x="true">
			<view
				:class="doctorInfo.doctor_area_id === item.id ? 'item active' : 'item'"
				v-for="(item, index) in doctorAreaList"
				:key="index"
				@click="selectNav('doctor_area_id', item.id)"
			>
				{{ item.name }}
			</view>
		</scroll-view>
		<view class="doctorItem" v-for="(item, index) in doctorList" :key="index" @click="previewImage(item.introduction_img)">
			<image class="img" :src="item.introduction_img"></image>
			<view class="btn">点击放大</view>
		</view>
		<image class="kefu" src="../../static/icon_kefu.png" @click="navigateTo(customerService[0].link)"></image>
	</view>
</template>

<script>
import requestApi from '@/api/doctor.js';
import homeApi from '@/api/home.js';
import img_doctor from '@/static/img_doctor.png';
export default {
	data() {
		return {
			doctorCategoryList: [],
			doctorAreaList: [],
			doctorList: [],
			doctorInfo: {
				pagesize: 10,
				page: 1,
				doctor_category_id: '',
				doctor_area_id: '',
				loading: false,
				count: 10000
			},
			customerService: {
				link: ''
			}
		};
	},
	onLoad() {
		this.getDoctorCategory()
	},
	onPullDownRefresh() {
		this.getDoctor(true);
		uni.stopPullDownRefresh();
	},
	onReachBottom() {
		this.getDoctor(false);
	},
	methods: {
		getCustomerService() {
			homeApi.getCustomerService().then(async ({ data }) => {
				this.customerService = await data.filter(item => {
					return item.name === '6号牙问诊';
				});
			});
			// console.log(this.customerService)
		},
		navigateTo(url) {
			this.$utils.navigateTo(url)
		},
		selectNav(type, id) {
			// console.log(type,id)
			this.doctorInfo[type] = id;//等于给this.doctorInfo.doctor_category.id或this.doctorInfo.doctor_area.id赋值！！！
			// console.log(this.doctorInfo[type])
			this.getDoctor(true);
		},
		getDoctor(isRefresh) {
			// console.log('isRefresh',isRefresh)
			if (this.doctorInfo.loading) {
				return;
			}
			let requestData = {
				pagesize: this.doctorInfo.pagesize,
				page: this.doctorInfo.pagesize,
				doctor_category_id: this.doctorInfo.doctor_category_id,
				doctor_area_id: this.doctorInfo.doctor_area_id,
			};
			if (isRefresh) {
				requestData.page = 1;
			} else {
				requestData.page = requestData.page + 1;
			}
			requestApi
				.getDoctor({
					...requestData
				})
				.then(({ data }) => {
					if (isRefresh) {
						this.doctorList = [...data.rows];
						// console.log(this.doctorList)
					} else {
						this.doctorList = [...this.doctorList, ...data.rows];//先将data的doctorList空数组赋值给doctorList，然后赋值数据（先清空后赋值）？？？
					}
					if (data.rows.length > 0) {
						this.doctorInfo = {
							...this.doctorInfo,
							page: requestData.page,
							count: data.count
						};
					}
					// console.log('b=',this.doctorInfo)
				})
				.finally(() => {
					this.doctorInfo.loading = false;
				});
		},
		getDoctorCategory() {//1.先获取类型数据的数组
			requestApi.getDoctorCategory().then(async ({ data }) => {
				// console.log(data)//一组数组，四个数据:1-种植...2-正畸...3-全科...4-儿童
				this.doctorCategoryList = [...data];//赋值
				if (this.doctorCategoryList.length > 0) {//判断医生种类列表数组中是否有数据
					this.doctorInfo = {//true，将data自定义的doctorInfo赋值，并且将后端的类型数据第一条的类型赋值的id赋值给定义的doctorInfo
						...this.doctorInfo,
						doctor_category_id: this.doctorCategoryList[0].id
					};
					this.getDoctorArea();
				}
			});
		},
		getDoctorArea() {
			requestApi.getDoctorArea().then(async ({ data }) => {
				this.doctorAreaList = [...data];
				if (this.doctorAreaList.length > 0) {
					this.doctorInfo = {
						...this.doctorInfo,
						doctor_area_id: this.doctorAreaList[0].id
					};
					this.getDoctor(true);
					this.getCustomerService()
				}
			});
		},
		previewImage(url) {
			uni.previewImage({
				urls: [url],
				longPressActions: {
					success: function(data) {},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	box-sizing: border-box;
	padding-bottom: 100rpx;
	padding-top: 210rpx;
	.nav1 {
		background: #b58c47;
		height: 92rpx;
		white-space: nowrap;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 2;
		overflow: hidden;
		.item {
			padding: 0 14rpx;
			height: 92rpx;
			line-height: 92rpx;
			font-weight: 500;
			font-size: 28rpx;
			background: #b58c47;
			color: #ffffff;
			display: inline-block;
			margin: 0;
		}
		.item.active {
			background: #f9e6c5;
			color: #5c4113;
		}
	}
	.nav2 {
		padding: 30rpx 0;
		white-space: nowrap;
		width: 670rpx;
		margin: auto;
		position: fixed;
		left: 40rpx;
		top: 92rpx;
		z-index: 2;
		background-color: #ffffff;
		.item {
			height: 66rpx;
			border: 1rpx solid rgba(0, 0, 0, 0.3);
			border-radius: 8rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: rgba(0, 0, 0, 0.7);
			line-height: 66rpx;
			padding: 0 20rpx;
			display: inline-block;
			margin-right: 20rpx;
		}
		.item.active {
			color: #5c4113;
			background: #f4dfb9;
		}
		.item:last-child {
			margin-right: 0;
		}
	}
	.doctorItem {
		position: relative;
		width: 670rpx;
		margin: 20rpx auto 0;
		.img {
			width: 670rpx;
			height: 498rpx;
			border-radius: 16rpx;
		}
		.btn {
			width: 156rpx;
			height: 64rpx;
			background: #ffffff;
			border-radius: 32rpx;
			font-weight: 400;
			font-size: 28rpx;
			line-height: 64rpx;
			text-align: center;
			color: #b58c47;
			position: absolute;
			bottom: 50rpx;
			left: 50rpx;
		}
	}
	.kefu {
		width: 180rpx;
		height: 180rpx;
		position: fixed;
		bottom: 184rpx;
		right: 14rpx;
	}
}
</style>
