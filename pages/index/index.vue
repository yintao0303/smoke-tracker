<template>
	<view class="container">
		<view class="content">
			<view class="app-name">
				<image class="logo" src="/static/images/logo.png" mode="aspectFit"></image>
				<text class="title">戒烟助手</text>
			</view>
			
			<!-- 打卡按钮区域 -->
			<view class="check-in-area">
				<view class="check-in-button" @click="openRecordPanel" :class="{'pulse': isPulsing}">
					<view class="smoke-effect"></view>
					<text>打卡</text>
				</view>
				<view class="today-stats">
					<text class="stats-text">今日已记录: {{todayCount}}支</text>
					<text class="stats-text">目标剩余: {{dailyGoal - todayCount > 0 ? dailyGoal - todayCount : 0}}支</text>
				</view>
			</view>
			
			<!-- 数据概览区域 -->
			<view class="data-overview">
				<view class="data-card">
					<text class="data-title">健康指数</text>
					<text class="data-value">{{healthIndex}}</text>
					<view class="progress-bar">
						<view class="progress" :style="{width: healthIndex + '%', backgroundColor: getHealthColor(healthIndex)}"></view>
					</view>
				</view>
				
				<view class="data-card">
					<text class="data-title">本周进度</text>
					<text class="data-value">{{weeklyProgress}}/{{weeklyGoal}}</text>
					<view class="progress-bar">
						<view class="progress" :style="{width: (weeklyProgress/weeklyGoal*100) + '%', backgroundColor: getProgressColor(weeklyProgress, weeklyGoal)}"></view>
					</view>
				</view>
				
				<view class="data-card">
					<text class="data-title">已节省</text>
					<text class="data-value">¥{{savedMoney}}</text>
					<text class="data-subtitle">本月累计</text>
				</view>
			</view>
			
			<!-- 快捷功能区域 -->
			<view class="quick-actions">
				<view class="action-item" @click="navigateTo('/pages/dashboard/dashboard')">
					<view class="action-icon stats-icon"></view>
					<text class="action-text">数据详情</text>
				</view>
				<view class="action-item" @click="navigateTo('/pages/calendar/calendar')">
					<view class="action-icon calendar-icon"></view>
					<text class="action-text">历史记录</text>
				</view>
				<view class="action-item" @click="navigateTo('/pages/achievement/achievement')">
					<view class="action-icon achievement-icon"></view>
					<text class="action-text">我的成就</text>
				</view>
				<view class="action-item" @click="navigateTo('/pages/social/social')">
					<view class="action-icon social-icon"></view>
					<text class="action-text">社交互动</text>
				</view>
			</view>
		</view>
		
		<!-- 记录面板弹窗 -->
		<uni-popup ref="recordPopup" type="bottom">
			<view class="record-panel">
				<view class="panel-header">
					<text class="panel-title">快速记录</text>
					<text class="close-btn" @click="closeRecordPanel">×</text>
				</view>
				
				<view class="panel-body">
					<view class="input-group">
						<text class="input-label">数量 (支)</text>
						<view class="quantity-selector">
							<view class="quantity-btn minus" @click="decreaseQuantity">-</view>
							<input type="number" v-model="quantity" class="quantity-input" />
							<view class="quantity-btn plus" @click="increaseQuantity">+</view>
						</view>
					</view>
					
					<view class="input-group">
						<text class="input-label">心情</text>
						<view class="mood-selector">
							<view 
								v-for="(mood, index) in moods" 
								:key="index" 
								class="mood-item" 
								:class="{'selected': selectedMood === index}"
								@click="selectMood(index)"
							>
								<text class="mood-emoji">{{mood.emoji}}</text>
								<text class="mood-text">{{mood.text}}</text>
							</view>
						</view>
					</view>
					
					<view class="input-group">
						<text class="input-label">场景</text>
						<view class="scene-selector">
							<view 
								v-for="(scene, index) in scenes" 
								:key="index" 
								class="scene-item" 
								:class="{'selected': selectedScene === index}"
								@click="selectScene(index)"
							>
								<text>{{scene}}</text>
							</view>
						</view>
					</view>
					
					<view class="input-group">
						<text class="input-label">备注</text>
						<textarea class="remark-input" v-model="remark" placeholder="添加备注..." />
					</view>
					
					<view class="submit-btn" @click="saveRecord">
						<text>保存记录</text>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 紧急替代方案弹窗 -->
		<uni-popup ref="emergencyPopup" type="center">
			<view class="emergency-panel">
				<view class="panel-header">
					<text class="panel-title">紧急替代方案</text>
					<text class="close-btn" @click="closeEmergencyPanel">×</text>
				</view>
				
				<view class="panel-body">
					<view class="emergency-tips">
						<view v-for="(tip, index) in emergencyTips" :key="index" class="tip-item">
							<text class="tip-number">{{index + 1}}</text>
							<text class="tip-text">{{tip}}</text>
						</view>
					</view>
					
					<view class="encourage-message">
						<text>{{randomEncourageMessage}}</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isPulsing: true,
			todayCount: 0,
			dailyGoal: 10,
			weeklyGoal: 60,
			weeklyProgress: 0,
			healthIndex: 85,
			savedMoney: '0.00',
			quantity: 1,
			moods: [],
			selectedMood: 0,
			scenes: [],
			selectedScene: 0,
			remark: '',
			emergencyTips: [],
			randomEncourageMessage: ''
		}
	},
	onLoad() {
		// 初始化数据
		this.initData();
		
		// 开始按钮脉动动画
		this.startPulseAnimation();
		
		// 从配置中获取心情和场景选项
		this.moods = this.$config.moods;
		this.scenes = this.$config.scenes;
		this.emergencyTips = this.$config.emergencyTips;
		
		// 随机获取一条鼓励消息
		this.getRandomEncourageMessage();
	},
	onShow() {
		// 刷新数据
		this.refreshData();
	},
	methods: {
		// 初始化数据
		initData() {
			// 从状态管理获取数据
			this.$store.dispatch('initUserData').then(() => {
				this.refreshData();
			});
		},
		
		// 刷新数据
		refreshData() {
			// 从状态管理获取最新数据
			this.todayCount = this.$store.state.todayCount;
			this.dailyGoal = this.$store.state.dailyGoal;
			this.weeklyGoal = this.$store.state.weeklyGoal;
			this.weeklyProgress = this.$store.state.weeklyProgress;
			this.healthIndex = this.$store.state.userInfo.healthIndex;
			
			// 计算节省金额
			const savedCount = Math.max(0, (this.dailyGoal * 30) - (this.todayCount * 30));
			this.savedMoney = this.$utils.calculateSavedMoney(savedCount);
		},
		
		// 开始按钮脉动动画
		startPulseAnimation() {
			this.isPulsing = true;
			setTimeout(() => {
				this.isPulsing = false;
			}, 2000);
			
			// 每隔5秒重复动画
			setInterval(() => {
				this.isPulsing = true;
				setTimeout(() => {
					this.isPulsing = false;
				}, 2000);
			}, 10000);
		},
		
		// 打开记录面板
		openRecordPanel() {
			this.$refs.recordPopup.open();
		},
		
		// 关闭记录面板
		closeRecordPanel() {
			this.$refs.recordPopup.close();
		},
		
		// 增加数量
		increaseQuantity() {
			this.quantity++;
		},
		
		// 减少数量
		decreaseQuantity() {
			if (this.quantity > 1) {
				this.quantity--;
			}
		},
		
		// 选择心情
		selectMood(index) {
			this.selectedMood = index;
		},
		
		// 选择场景
		selectScene(index) {
			this.selectedScene = index;
		},
		
		// 保存记录
		saveRecord() {
			// 构建记录对象
			const record = {
				id: this.$utils.generateUUID(),
				quantity: parseInt(this.quantity),
				mood: this.moods[this.selectedMood],
				scene: this.scenes[this.selectedScene],
				remark: this.remark,
				timestamp: Date.now()
			};
			
			// 保存到状态管理
			this.$store.dispatch('saveRecord', record).then(() => {
				// 刷新数据
				this.refreshData();
				
				// 关闭面板
				this.closeRecordPanel();
				
				// 重置表单
				this.quantity = 1;
				this.selectedMood = 0;
				this.selectedScene = 0;
				this.remark = '';
				
				// 显示提示
				uni.showToast({
					title: '记录成功',
					icon: 'success'
				});
			});
		},
		
		// 打开紧急替代方案面板
		openEmergencyPanel() {
			// 获取新的随机鼓励消息
			this.getRandomEncourageMessage();
			
			// 打开面板
			this.$refs.emergencyPopup.open();
		},
		
		// 关闭紧急替代方案面板
		closeEmergencyPanel() {
			this.$refs.emergencyPopup.close();
		},
		
		// 获取随机鼓励消息
		getRandomEncourageMessage() {
			const messages = this.$config.encourageMessages;
			const randomIndex = Math.floor(Math.random() * messages.length);
			this.randomEncourageMessage = messages[randomIndex];
		},
		
		// 获取健康指数颜色
		getHealthColor(index) {
			if (index < 60) {
				return '#F44336'; // 红色
			} else if (index < 80) {
				return '#FF9800'; // 橙色
			} else {
				return '#4CAF50'; // 绿色
			}
		},
		
		// 获取进度颜色
		getProgressColor(progress, goal) {
			const ratio = progress / goal;
			if (ratio > 1) {
				return '#F44336'; // 红色
			} else if (ratio > 0.8) {
				return '#FF9800'; // 橙色
			} else {
				return '#4CAF50'; // 绿色
			}
		},
		
		// 页面导航
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
}

.content {
	padding: 40rpx;
}

.app-name {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
}

.logo {
	width: 80rpx;
	height: 80rpx;
	margin-right: 20rpx;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.check-in-area {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 60rpx;
}

.check-in-button {
	width: 240rpx;
	height: 240rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #6E7FF3, #9D6EF3);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #FFFFFF;
	font-size: 40rpx;
	font-weight: bold;
	box-shadow: 0 10rpx 20rpx rgba(110, 127, 243, 0.3);
	position: relative;
	overflow: hidden;
	margin-bottom: 30rpx;
}

.smoke-effect {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
	opacity: 0;
	animation: smoke 3s infinite;
}

@keyframes smoke {
	0% {
		transform: scale(0.5);
		opacity: 0.8;
	}
	100% {
		transform: scale(2);
		opacity: 0;
	}
}

.pulse {
	animation: pulse 1.5s infinite;
}

@keyframes pulse {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.05);
	}
	100% {
		transform: scale(1);
	}
}

.today-stats {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stats-text {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.data-overview {
	display: flex;
	justify-content: space-between;
	margin-bottom: 60rpx;
}

.data-card {
	width: 30%;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	display: flex;
	flex-direction: column;
	align-items: center;
}

.data-title {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.data-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.data-subtitle {
	font-size: 20rpx;
	color: #999;
}

.progress-bar {
	width: 100%;
	height: 10rpx;
	background-color: #F0F0F0;
	border-radius: 5rpx;
	overflow: hidden;
}

.progress {
	height: 100%;
	border-radius: 5rpx;
}

.quick-actions {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.action-item {
	width: 48%;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.action-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	background-size: 50%;
	background-position: center;
	background-repeat: no-repeat;
}

.stats-icon {
	background-color: rgba(110, 127, 243, 0.1);
	background-image: url('/static/images/icon-stats.png');
}

.calendar-icon {
	background-color: rgba(76, 175, 80, 0.1);
	background-image: url('/static/images/icon-calendar.png');
}

.achievement-icon {
	background-color: rgba(255, 152, 0, 0.1);
	background-image: url('/static/images/icon-achievement.png');
}

.social-icon {
	background-color: rgba(244, 67, 54, 0.1);
	background-image: url('/static/images/icon-social.png');
}

.action-text {
	font-size: 28rpx;
	color: #333;
}

/* 记录面板样式 */
.record-panel {
	background-color: #FFFFFF;
	border-radius: 30rpx 30rpx 0 0;
	padding: 30rpx;
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.panel-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.close-btn {
	font-size: 48rpx;
	color: #999;
	line-height: 1;
}

.input-group {
	margin-bottom: 30rpx;
}

.input-label {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 20rpx;
	display: block;
}

.quantity-selector {
	display: flex;
	align-items: center;
	border: 1rpx solid #E0E0E0;
	border-radius: 45rpx;
	overflow: hidden;
}

.quantity-btn {
	width: 90rpx;
	height: 90rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	background-color: #F5F5F5;
}

.quantity-input {
	flex: 1;
	height: 90rpx;
	text-align: center;
	font-size: 32rpx;
}

.mood-selector {
	display: flex;
	justify-content: space-between;
}

.mood-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx;
	border-radius: 16rpx;
	background-color: #F5F5F5;
}

.mood-item.selected {
	background-color: rgba(110, 127, 243, 0.1);
	border: 1rpx solid #6E7FF3;
}

.mood-emoji {
	font-size: 40rpx;
	margin-bottom: 10rpx;
}

.mood-text {
	font-size: 24rpx;
	color: #666;
}

.scene-selector {
	display: flex;
	flex-wrap: wrap;
}

.scene-item {
	padding: 15rpx 30rpx;
	border-radius: 30rpx;
	background-color: #F5F5F5;
	margin-right: 20rpx;
	margin-bottom: 20rpx;
	font-size: 24rpx;
	color: #666;
}

.scene-item.selected {
	background-color: rgba(110, 127, 243, 0.1);
	border: 1rpx solid #6E7FF3;
	color: #6E7FF3;
}

.remark-input {
	width: 100%;
	height: 180rpx;
	background-color: #F5F5F5;
	border-radius: 16rpx;
	padding: 20rpx;
	font-size: 28rpx;
}

.submit-btn {
	height: 90rpx;
	background: linear-gradient(135deg, #6E7FF3, #9D6EF3);
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
}

/* 紧急替代方案面板样式 */
.emergency-panel {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 30rpx;
	width: 80vw;
}

.emergency-tips {
	margin-bottom: 30rpx;
}

.tip-item {
	display: flex;
	margin-bottom: 20rpx;
}

.tip-number {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background-color: #6E7FF3;
	color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	margin-right: 20rpx;
}

.tip-text {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	line-height: 1.5;
}

.encourage-message {
	padding: 20rpx;
	background-color: rgba(110, 127, 243, 0.1);
	border-radius: 16rpx;
	font-size: 28rpx;
	color: #6E7FF3;
	text-align: center;
	font-weight: bold;
}
</style>
