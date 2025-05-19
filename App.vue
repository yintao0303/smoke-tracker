<template>
	<view>
		<view class="status_bar"></view>
		<view class="container">
			<view v-if="!hasLogin">
				<!-- 未登录状态下显示登录页 -->
				<navigator url="/pages/login/login" open-type="navigate">
					<button type="primary">去登录</button>
				</navigator>
			</view>
			<view v-else>
				<!-- 已登录状态下显示内容 -->
				<page-head :title="title"></page-head>
				<view class="uni-padding-wrap uni-common-mt">
					<view class="uni-hello-text">
						<text>欢迎使用戒烟助手！</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '戒烟助手',
				hasLogin: false
			}
		},
		onLoad() {
			// 检查登录状态
			const token = uni.getStorageSync('token');
			if (token) {
				this.hasLogin = true;
			}
			
			// 检查是否首次使用
			const isFirstUse = !uni.getStorageSync('hasUsed');
			if (isFirstUse && this.hasLogin) {
				// 首次使用跳转到引导页
				uni.redirectTo({
					url: '/pages/onboarding/onboarding'
				});
			} else if (this.hasLogin) {
				// 已登录且非首次使用，跳转到主页
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		},
		methods: {
			// 方法定义
		}
	}
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>
