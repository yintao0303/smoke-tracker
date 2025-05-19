<template>
	<view class="container">
		<view class="header">
			<text class="page-title">个人中心</text>
		</view>
		
		<view class="content">
			<!-- 用户信息 -->
			<view class="user-info">
				<view class="avatar-container">
					<image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
					<view class="edit-avatar" @click="changeAvatar">
						<text class="edit-icon">✎</text>
					</view>
				</view>
				<text class="nickname">{{userInfo.nickname}}</text>
				<view class="health-index">
					<text class="index-value">{{userInfo.healthIndex}}</text>
					<text class="index-label">健康指数</text>
				</view>
			</view>
			
			<!-- 目标设置 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">目标设置</text>
					<view class="edit-btn" @click="showGoalPanel">
						<text>编辑</text>
					</view>
				</view>
				
				<view class="goal-info">
					<view class="goal-item">
						<text class="goal-label">每日限制</text>
						<text class="goal-value">{{goals.daily}}支</text>
					</view>
					<view class="goal-item">
						<text class="goal-label">每周限制</text>
						<text class="goal-value">{{goals.weekly}}支</text>
					</view>
					<view class="goal-item">
						<text class="goal-label">目标类型</text>
						<text class="goal-value">{{goals.type}}</text>
					</view>
				</view>
			</view>
			
			<!-- 统计概览 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">统计概览</text>
				</view>
				
				<view class="stats-grid">
					<view class="stats-item">
						<text class="stats-value">{{stats.totalDays}}</text>
						<text class="stats-label">记录天数</text>
					</view>
					<view class="stats-item">
						<text class="stats-value">{{stats.streakDays}}</text>
						<text class="stats-label">连续天数</text>
					</view>
					<view class="stats-item">
						<text class="stats-value">{{stats.totalReduction}}</text>
						<text class="stats-label">累计减少</text>
					</view>
					<view class="stats-item">
						<text class="stats-value">{{stats.savedMoney}}</text>
						<text class="stats-label">节省金额</text>
					</view>
				</view>
			</view>
			
			<!-- 功能菜单 -->
			<view class="section">
				<view class="menu-list">
					<view class="menu-item" @click="navigateTo('/pages/achievement/achievement')">
						<view class="menu-icon achievement-icon"></view>
						<text class="menu-text">我的成就</text>
						<text class="menu-arrow">›</text>
					</view>
					<view class="menu-item" @click="navigateTo('/pages/social/social')">
						<view class="menu-icon social-icon"></view>
						<text class="menu-text">社交互动</text>
						<text class="menu-arrow">›</text>
					</view>
					<view class="menu-item" @click="showNotificationSettings">
						<view class="menu-icon notification-icon"></view>
						<text class="menu-text">通知设置</text>
						<text class="menu-arrow">›</text>
					</view>
					<view class="menu-item" @click="showDataExport">
						<view class="menu-icon export-icon"></view>
						<text class="menu-text">数据导出</text>
						<text class="menu-arrow">›</text>
					</view>
					<view class="menu-item" @click="showAbout">
						<view class="menu-icon about-icon"></view>
						<text class="menu-text">关于我们</text>
						<text class="menu-arrow">›</text>
					</view>
				</view>
			</view>
			
			<!-- 退出登录 -->
			<view class="logout-btn" @click="showLogoutConfirm">
				<text>退出登录</text>
			</view>
		</view>
		
		<!-- 目标设置面板 -->
		<uni-popup ref="goalPopup" type="bottom">
			<view class="goal-panel">
				<view class="panel-header">
					<text class="panel-title">目标设置</text>
					<text class="close-btn" @click="closeGoalPanel">×</text>
				</view>
				
				<view class="panel-body">
					<view class="setting-item">
						<text class="setting-label">每日限制 (支)</text>
						<slider 
							:value="editGoals.daily" 
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
							:value="editGoals.weekly" 
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
								<radio :checked="editGoals.type === '控制'" value="控制" />
								<text>控制数量</text>
							</label>
							<label class="radio-item">
								<radio :checked="editGoals.type === '逐步减少'" value="逐步减少" />
								<text>逐步减少</text>
							</label>
							<label class="radio-item">
								<radio :checked="editGoals.type === '完全戒断'" value="完全戒断" />
								<text>完全戒断</text>
							</label>
						</radio-group>
					</view>
					
					<view class="save-btn" @click="saveGoals">
						<text>保存设置</text>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 通知设置面板 -->
		<uni-popup ref="notificationPopup" type="bottom">
			<view class="notification-panel">
				<view class="panel-header">
					<text class="panel-title">通知设置</text>
					<text class="close-btn" @click="closeNotificationPanel">×</text>
				</view>
				
				<view class="panel-body">
					<view class="switch-item">
						<text class="switch-label">每日提醒</text>
						<switch :checked="notifications.daily" @change="toggleDaily" />
					</view>
					
					<view class="time-picker" v-if="notifications.daily">
						<text class="time-label">提醒时间</text>
						<picker 
							mode="time" 
							:value="notifications.dailyTime" 
							@change="onDailyTimeChange"
						>
							<view class="picker-value">
								<text>{{notifications.dailyTime}}</text>
							</view>
						</picker>
					</view>
					
					<view class="switch-item">
						<text class="switch-label">周报提醒</text>
						<switch :checked="notifications.weekly" @change="toggleWeekly" />
					</view>
					
					<view class="switch-item">
						<text class="switch-label">目标达成提醒</text>
						<switch :checked="notifications.goal" @change="toggleGoal" />
					</view>
					
					<view class="switch-item">
						<text class="switch-label">社交互动提醒</text>
						<switch :checked="notifications.social" @change="toggleSocial" />
					</view>
					
					<view class="save-btn" @click="saveNotifications">
						<text>保存设置</text>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 数据导出面板 -->
		<uni-popup ref="exportPopup" type="bottom">
			<view class="export-panel">
				<view class="panel-header">
					<text class="panel-title">数据导出</text>
					<text class="close-btn" @click="closeExportPanel">×</text>
				</view>
				
				<view class="panel-body">
					<view class="export-options">
						<view class="export-option">
							<radio-group @change="onExportTypeChange">
								<label class="radio-item">
									<radio :checked="exportType === 'all'" value="all" />
									<text>导出全部数据</text>
								</label>
								<label class="radio-item">
									<radio :checked="exportType === 'month'" value="month" />
									<text>导出本月数据</text>
								</label>
								<label class="radio-item">
									<radio :checked="exportType === 'custom'" value="custom" />
									<text>自定义时间范围</text>
								</label>
							</radio-group>
						</view>
						
						<view class="date-range" v-if="exportType === 'custom'">
							<view class="date-picker">
								<text class="date-label">开始日期</text>
								<picker 
									mode="date" 
									:value="exportStartDate" 
									@change="onStartDateChange"
								>
									<view class="picker-value">
										<text>{{exportStartDate}}</text>
									</view>
								</picker>
							</view>
							
							<view class="date-picker">
								<text class="date-label">结束日期</text>
								<picker 
									mode="date" 
									:value="exportEndDate" 
									@change="onEndDateChange"
								>
									<view class="picker-value">
										<text>{{exportEndDate}}</text>
									</view>
								</picker>
							</view>
						</view>
						
						<view class="export-format">
							<text class="format-label">导出格式</text>
							<radio-group @change="onFormatChange">
								<label class="radio-item">
									<radio :checked="exportFormat === 'csv'" value="csv" />
									<text>CSV</text>
								</label>
								<label class="radio-item">
									<radio :checked="exportFormat === 'excel'" value="excel" />
									<text>Excel</text>
								</label>
								<label class="radio-item">
									<radio :checked="exportFormat === 'pdf'" value="pdf" />
									<text>PDF</text>
								</label>
							</radio-group>
						</view>
					</view>
					
					<view class="export-btn" @click="exportData">
						<text>导出数据</text>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 关于我们面板 -->
		<uni-popup ref="aboutPopup" type="bottom">
			<view class="about-panel">
				<view class="panel-header">
					<text class="panel-title">关于我们</text>
					<text class="close-btn" @click="closeAboutPanel">×</text>
				</view>
				
				<view class="panel-body">
					<view class="app-info">
						<image class="app-logo" src="/static/images/logo.png" mode="aspectFit"></image>
						<text class="app-name">戒烟助手</text>
						<text class="app-version">版本 1.0.0</text>
					</view>
					
					<view class="about-content">
						<text class="about-text">戒烟助手是一款帮助用户记录、分析和减少烟草消耗的应用，通过数据可视化、成就系统和社交互动，激励用户迈向更健康的生活方式。</text>
					</view>
					
					<view class="about-links">
						<view class="link-item" @click="openPrivacyPolicy">
							<text>隐私政策</text>
						</view>
						<view class="link-item" @click="openUserAgreement">
							<text>用户协议</text>
						</view>
						<view class="link-item" @click="contactUs">
							<text>联系我们</text>
						</view>
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
			userInfo: {
				avatar: '/static/images/default-avatar.png',
				nickname: '用户昵称',
				healthIndex: 85
			},
			goals: {
				daily: 10,
				weekly: 60,
				type: '控制'
			},
			editGoals: {
				daily: 10,
				weekly: 60,
				type: '控制'
			},
			stats: {
				totalDays: 5,
				streakDays: 3,
				totalReduction: 12,
				savedMoney: '60.00'
			},
			notifications: {
				daily: true,
				dailyTime: '21:00',
				weekly: true,
				goal: true,
				social: true
			},
			exportType: 'all',
			exportStartDate: '2025-05-01',
			exportEndDate: '2025-05-19',
			exportFormat: 'csv'
		}
	},
	onLoad() {
		// 加载用户信息
		this.loadUserInfo();
		
		// 加载目标设置
		this.loadGoals();
		
		// 计算统计数据
		this.calculateStats();
		
		// 加载通知设置
		this.loadNotifications();
	},
	methods: {
		// 加载用户信息
		loadUserInfo() {
			// 从状态管理获取用户信息
			const userInfoStr = uni.getStorageSync('userInfo');
			if (userInfoStr) {
				this.userInfo = JSON.parse(userInfoStr);
			}
		},
		
		// 加载目标设置
		loadGoals() {
			// 从状态管理获取目标设置
			const dailyGoal = uni.getStorageSync('dailyGoal');
			const weeklyGoal = uni.getStorageSync('weeklyGoal');
			const goalType = uni.getStorageSync('goalType');
			
			if (dailyGoal && weeklyGoal && goalType) {
				this.goals = {
					daily: parseInt(dailyGoal),
					weekly: parseInt(weeklyGoal),
					type: goalType
				};
				
				this.editGoals = { ...this.goals };
			}
		},
		
		// 计算统计数据
		calculateStats() {
			// 模拟数据
			this.stats = {
				totalDays: 5,
				streakDays: 3,
				totalReduction: 12,
				savedMoney: '60.00'
			};
		},
		
		// 加载通知设置
		loadNotifications() {
			// 从状态管理获取通知设置
			const notificationsStr = uni.getStorageSync('notifications');
			if (notificationsStr) {
				this.notifications = JSON.parse(notificationsStr);
			}
		},
		
		// 更换头像
		changeAvatar() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					const tempFilePath = res.tempFilePaths[0];
					
					// 更新头像
					this.userInfo.avatar = tempFilePath;
					
					// 保存到状态管理
					uni.setStorageSync('userInfo', JSON.stringify(this.userInfo));
					
					// 显示提示
					uni.showToast({
						title: '头像已更新',
						icon: 'success'
					});
				}
			});
		},
		
		// 显示目标设置面板
		showGoalPanel() {
			// 初始化编辑数据
			this.editGoals = { ...this.goals };
			
			// 打开面板
			this.$refs.goalPopup.open();
		},
		
		// 关闭目标设置面板
		closeGoalPanel() {
			this.$refs.goalPopup.close();
		},
		
		// 每日目标变更
		onDailyGoalChange(e) {
			this.editGoals.daily = e.detail.value;
		},
		
		// 每周目标变更
		onWeeklyGoalChange(e) {
			this.editGoals.weekly = e.detail.value;
		},
		
		// 目标类型变更
		onGoalTypeChange(e) {
			this.editGoals.type = e.detail.value;
		},
		
		// 保存目标设置
		saveGoals() {
			// 更新目标设置
			this.goals = { ...this.editGoals };
			
			// 保存到状态管理
			uni.setStorageSync('dailyGoal', this.goals.daily.toString());
			uni.setStorageSync('weeklyGoal', this.goals.weekly.toString());
			uni.setStorageSync('goalType', this.goals.type);
			
			// 关闭面板
			this.closeGoalPanel();
			
			// 显示提示
			uni.showToast({
				title: '目标已更新',
				icon: 'success'
			});
		},
		
		// 显示通知设置面板
		showNotificationSettings() {
			this.$refs.notificationPopup.open();
		},
		
		// 关闭通知设置面板
		closeNotificationPanel() {
			this.$refs.notificationPopup.close();
		},
		
		// 切换每日提醒
		toggleDaily(e) {
			this.notifications.daily = e.detail.value;
		},
		
		// 每日提醒时间变更
		onDailyTimeChange(e) {
			this.notifications.dailyTime = e.detail.value;
		},
		
		// 切换周报提醒
		toggleWeekly(e) {
			this.notifications.weekly = e.detail.value;
		},
		
		// 切换目标达成提醒
		toggleGoal(e) {
			this.notifications.goal = e.detail.value;
		},
		
		// 切换社交互动提醒
		toggleSocial(e) {
			this.notifications.social = e.detail.value;
		},
		
		// 保存通知设置
		saveNotifications() {
			// 保存到状态管理
			uni.setStorageSync('notifications', JSON.stringify(this.notifications));
			
			// 关闭面板
			this.closeNotificationPanel();
			
			// 显示提示
			uni.showToast({
				title: '设置已保存',
				icon: 'success'
			});
		},
		
		// 显示数据导出面板
		showDataExport() {
			this.$refs.exportPopup.open();
		},
		
		// 关闭数据导出面板
		closeExportPanel() {
			this.$refs.exportPopup.close();
		},
		
		// 导出类型变更
		onExportTypeChange(e) {
			this.exportType = e.detail.value;
		},
		
		// 开始日期变更
		onStartDateChange(e) {
			this.exportStartDate = e.detail.value;
		},
		
		// 结束日期变更
		onEndDateChange(e) {
			this.exportEndDate = e.detail.value;
		},
		
		// 导出格式变更
		onFormatChange(e) {
			this.exportFormat = e.detail.value;
		},
		
		// 导出数据
		exportData() {
			// 模拟导出过程
			uni.showLoading({
				title: '导出中...'
			});
			
			setTimeout(() => {
				uni.hideLoading();
				
				// 关闭面板
				this.closeExportPanel();
				
				// 显示提示
				uni.showModal({
					title: '导出成功',
					content: `数据已成功导出为${this.exportFormat.toUpperCase()}格式`,
					showCancel: false
				});
			}, 1500);
		},
		
		// 显示关于我们面板
		showAbout() {
			this.$refs.aboutPopup.open();
		},
		
		// 关闭关于我们面板
		closeAboutPanel() {
			this.$refs.aboutPopup.close();
		},
		
		// 打开隐私政策
		openPrivacyPolicy() {
			// 模拟打开隐私政策
			uni.showModal({
				title: '隐私政策',
				content: '这里是隐私政策内容...',
				showCancel: false
			});
		},
		
		// 打开用户协议
		openUserAgreement() {
			// 模拟打开用户协议
			uni.showModal({
				title: '用户协议',
				content: '这里是用户协议内容...',
				showCancel: false
			});
		},
		
		// 联系我们
		contactUs() {
			// 模拟联系我们
			uni.showModal({
				title: '联系我们',
				content: '邮箱: support@example.com\n电话: 123-456-7890',
				showCancel: false
			});
		},
		
		// 显示退出登录确认
		showLogoutConfirm() {
			uni.showModal({
				title: '退出登录',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						this.logout();
					}
				}
			});
		},
		
		// 退出登录
		logout() {
			// 清除登录状态
			uni.removeStorageSync('token');
			
			// 跳转到登录页
			uni.reLaunch({
				url: '/pages/login/login'
			});
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

.header {
	background: linear-gradient(135deg, #6E7FF3, #9D6EF3);
	padding: 40rpx;
	position: sticky;
	top: 0;
	z-index: 10;
}

.page-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #FFFFFF;
}

.content {
	padding: 40rpx;
}

.user-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 40rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	margin-bottom: 40rpx;
}

.avatar-container {
	position: relative;
	margin-bottom: 20rpx;
}

.avatar {
	width: 150rpx;
	height: 150rpx;
	border-radius: 50%;
}

.edit-avatar {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 50rpx;
	height: 50rpx;
	border-radius: 50%;
	background-color: #8A6EF3;
	display: flex;
	align-items: center;
	justify-content: center;
}

.edit-icon {
	color: #FFFFFF;
	font-size: 24rpx;
}

.nickname {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.health-index {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.index-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #8A6EF3;
}

.index-label {
	font-size: 24rpx;
	color: #666;
}

.section {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	margin-bottom: 40rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.edit-btn {
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	background-color: rgba(138, 110, 243, 0.1);
}

.edit-btn text {
	font-size: 24rpx;
	color: #8A6EF3;
}

.goal-info {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.goal-item {
	width: 48%;
	background-color: #F5F5F5;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.goal-label {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.goal-value {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.stats-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.stats-item {
	width: 48%;
	background-color: #F5F5F5;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stats-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.stats-label {
	font-size: 24rpx;
	color: #666;
}

.menu-list {
	margin-bottom: 20rpx;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-icon {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	background-size: 50%;
	background-position: center;
	background-repeat: no-repeat;
}

.achievement-icon {
	background-color: rgba(255, 152, 0, 0.1);
	background-image: url('/static/images/icon-achievement.png');
}

.social-icon {
	background-color: rgba(244, 67, 54, 0.1);
	background-image: url('/static/images/icon-social.png');
}

.notification-icon {
	background-color: rgba(33, 150, 243, 0.1);
	background-image: url('/static/images/icon-notification.png');
}

.export-icon {
	background-color: rgba(76, 175, 80, 0.1);
	background-image: url('/static/images/icon-export.png');
}

.about-icon {
	background-color: rgba(156, 39, 176, 0.1);
	background-image: url('/static/images/icon-about.png');
}

.menu-text {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.menu-arrow {
	font-size: 36rpx;
	color: #999;
}

.logout-btn {
	height: 90rpx;
	background-color: #F5F5F5;
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 60rpx;
}

.logout-btn text {
	color: #F44336;
	font-size: 32rpx;
}

.goal-panel, .notification-panel, .export-panel, .about-panel {
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

.setting-item {
	margin-bottom: 30rpx;
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

.save-btn, .export-btn {
	height: 90rpx;
	background: linear-gradient(135deg, #6E7FF3, #9D6EF3);
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 30rpx;
}

.save-btn text, .export-btn text {
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
}

.switch-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.switch-label {
	font-size: 28rpx;
	color: #333;
}

.time-picker {
	margin-bottom: 30rpx;
}

.time-label, .date-label, .format-label {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 20rpx;
	display: block;
}

.picker-value {
	height: 80rpx;
	background-color: #F5F5F5;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	padding: 0 30rpx;
}

.picker-value text {
	font-size: 28rpx;
	color: #333;
}

.date-range {
	margin-bottom: 30rpx;
}

.date-picker {
	margin-bottom: 20rpx;
}

.export-options {
	margin-bottom: 30rpx;
}

.export-option {
	margin-bottom: 30rpx;
}

.export-format {
	margin-top: 30rpx;
}

.app-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 30rpx;
}

.app-logo {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 20rpx;
}

.app-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.app-version {
	font-size: 24rpx;
	color: #666;
}

.about-content {
	margin-bottom: 30rpx;
}

.about-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.5;
}

.about-links {
	display: flex;
	justify-content: space-around;
}

.link-item {
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	background-color: rgba(138, 110, 243, 0.1);
}

.link-item text {
	font-size: 24rpx;
	color: #8A6EF3;
}
</style>
