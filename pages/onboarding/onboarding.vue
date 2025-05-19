<template>
	<view class="container">
		<!-- 引导页轮播 -->
		<swiper class="swiper" :indicator-dots="true" :autoplay="false" :duration="500">
			<swiper-item v-for="(slide, index) in slides" :key="index">
				<view class="slide">
					<image class="slide-image" :src="slide.image" mode="aspectFit"></image>
					<view class="slide-content">
						<text class="slide-title">{{slide.title}}</text>
						<text class="slide-desc">{{slide.description}}</text>
					</view>
				</view>
			</swiper-item>
			
			<!-- 最后一页：目标设置 -->
			<swiper-item>
				<view class="slide goal-slide">
					<text class="slide-title">设置你的目标</text>
					<text class="slide-desc">设定每日抽烟限制，我们将帮助你逐步减少</text>
					
					<view class="goal-setting">
						<view class="setting-item">
							<text class="setting-label">每日限制 (支)</text>
							<slider 
								:value="dailyGoal" 
								:min="1" 
								:max="30" 
								:step="1" 
								show-value 
								@change="onDailyGoalChange"
							/>
						</view>
						
						<view class="setting-item">
							<text class="setting-label">每周限制 (支)</text>
							<slider 
								:value="weeklyGoal" 
								:min="5" 
								:max="150" 
								:step="5" 
								show-value 
								@change="onWeeklyGoalChange"
							/>
						</view>
						
						<view class="setting-item">
							<text class="setting-label">目标类型</text>
							<radio-group @change="onGoalTypeChange">
								<label class="radio-item">
									<radio :checked="goalType === '控制'" value="控制" />
									<text>控制数量</text>
								</label>
								<label class="radio-item">
									<radio :checked="goalType === '逐步减少'" value="逐步减少" />
									<text>逐步减少</text>
								</label>
								<label class="radio-item">
									<radio :checked="goalType === '完全戒断'" value="完全戒断" />
									<text>完全戒断</text>
								</label>
							</radio-group>
						</view>
					</view>
					
					<view class="start-btn" @click="startApp">
						<text>开始使用</text>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	data() {
		return {
			slides: [
				{
					title: '欢迎使用戒烟助手',
					description: '我们将帮助你记录、分析和减少烟草消耗，迈向更健康的生活',
					image: '/static/images/onboarding1.png'
				},
				{
					title: '简单记录',
					description: '只需轻点一下，即可快速记录每次抽烟，包括数量、心情和场景',
					image: '/static/images/onboarding2.png'
				},
				{
					title: '数据可视化',
					description: '直观的图表帮你了解消耗趋势、时间分布和触发场景',
					image: '/static/images/onboarding3.png'
				},
				{
					title: '成就系统',
					description: '获得徽章、解锁成就，见证你的每一步进步',
					image: '/static/images/onboarding4.png'
				}
			],
			dailyGoal: 10,
			weeklyGoal: 60,
			goalType: '控制'
		}
	},
	methods: {
		onDailyGoalChange(e) {
			this.dailyGoal = e.detail.value;
		},
		onWeeklyGoalChange(e) {
			this.weeklyGoal = e.detail.value;
		},
		onGoalTypeChange(e) {
			this.goalType = e.detail.value;
		},
		startApp() {
			// 保存用户目标设置
			uni.setStorageSync('dailyGoal', this.dailyGoal.toString());
			uni.setStorageSync('weeklyGoal', this.weeklyGoal.toString());
			uni.setStorageSync('goalType', this.goalType);
			
			// 标记已使用过
			uni.setStorageSync('hasUsed', 'true');
			
			// 跳转到主页
			uni.switchTab({
				url: '/pages/index/index'
			});
		}
	}
}
</script>

<style>
.container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #fff;
}

.swiper {
	flex: 1;
	height: 100vh;
}

.slide {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40rpx;
	height: 100%;
}

.slide-image {
	width: 500rpx;
	height: 500rpx;
	margin-bottom: 60rpx;
}

.slide-content {
	text-align: center;
}

.slide-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.slide-desc {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
}

.goal-slide {
	justify-content: flex-start;
	padding-top: 100rpx;
}

.goal-setting {
	width: 100%;
	margin-top: 60rpx;
	margin-bottom: 60rpx;
}

.setting-item {
	margin-bottom: 40rpx;
}

.setting-label {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 20rpx;
	display: block;
}

.radio-item {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.radio-item text {
	font-size: 28rpx;
	color: #333;
	margin-left: 10rpx;
}

.start-btn {
	width: 80%;
	height: 90rpx;
	background: linear-gradient(135deg, #6E7FF3, #9D6EF3);
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 40rpx;
}

.start-btn text {
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
}
</style>
