<template>
	<view class="container">
		<view class="header">
			<text class="page-title">成就系统</text>
		</view>
		
		<view class="content">
			<!-- 徽章墙 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">徽章墙</text>
					<text class="section-subtitle">已解锁 {{unlockedBadges}}/{{badges.length}}</text>
				</view>
				
				<view class="badges-grid">
					<view 
						v-for="(badge, index) in badges" 
						:key="index" 
						class="badge-item"
						:class="{'unlocked': badge.unlocked}"
						@click="showBadgeDetail(badge)"
					>
						<view class="badge-icon">
							<text>{{badge.icon}}</text>
						</view>
						<view class="badge-info">
							<text class="badge-name">{{badge.name}}</text>
							<text class="badge-progress">{{badge.progress}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 健康进度 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">健康进度</text>
					<text class="section-subtitle">基于你的减少趋势</text>
				</view>
				
				<view class="health-timeline">
					<view 
						v-for="(milestone, index) in healthMilestones" 
						:key="index" 
						class="milestone-item"
						:class="{'reached': milestone.reached}"
					>
						<view class="milestone-dot"></view>
						<view class="milestone-line" v-if="index < healthMilestones.length - 1"></view>
						<view class="milestone-content">
							<text class="milestone-time">{{milestone.time}}</text>
							<text class="milestone-title">{{milestone.title}}</text>
							<text class="milestone-desc">{{milestone.description}}</text>
							<text class="milestone-prediction" v-if="!milestone.reached">预计: {{milestone.prediction}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 统计数据 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">统计数据</text>
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
		</view>
		
		<!-- 徽章详情弹窗 -->
		<uni-popup ref="badgePopup" type="center">
			<view class="badge-detail">
				<view class="detail-header">
					<text class="detail-title">徽章详情</text>
					<text class="close-btn" @click="closeBadgeDetail">×</text>
				</view>
				
				<view class="detail-content">
					<view class="detail-icon">
						<text>{{selectedBadge.icon}}</text>
					</view>
					<text class="detail-name">{{selectedBadge.name}}</text>
					<text class="detail-desc">{{selectedBadge.description}}</text>
					<text class="detail-condition">获取条件: {{selectedBadge.condition}}</text>
					<text class="detail-progress">进度: {{selectedBadge.progress}}</text>
					
					<view class="detail-status" v-if="selectedBadge.unlocked">
						<text class="status-text">已解锁</text>
						<text class="unlock-date">解锁日期: {{selectedBadge.unlockedDate || '未知'}}</text>
					</view>
					<view class="detail-status" v-else>
						<text class="status-text">未解锁</text>
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
			badges: [],
			healthMilestones: [],
			stats: {
				totalDays: 0,
				streakDays: 0,
				totalReduction: 0,
				savedMoney: '0.00'
			},
			selectedBadge: {}
		}
	},
	computed: {
		unlockedBadges() {
			return this.badges.filter(badge => badge.unlocked).length;
		}
	},
	onLoad() {
		// 加载数据
		this.loadData();
	},
	methods: {
		// 加载数据
		loadData() {
			// 加载徽章数据
			this.loadBadges();
			
			// 加载健康里程碑数据
			this.loadHealthMilestones();
			
			// 计算统计数据
			this.calculateStats();
		},
		
		// 加载徽章数据
		loadBadges() {
			// 从状态管理获取徽章数据
			const badgesStr = uni.getStorageSync('badges');
			if (badgesStr) {
				this.badges = JSON.parse(badgesStr);
			} else {
				// 使用默认徽章数据
				this.badges = [
					{
						icon: '🌟',
						name: '初次记录',
						description: '完成第一次记录',
						condition: '完成第一次记录',
						unlocked: true,
						unlockedDate: '2025-05-15',
						progress: '1/1'
					},
					{
						icon: '🔥',
						name: '三日连续',
						description: '连续三天记录',
						condition: '连续三天记录',
						unlocked: true,
						unlockedDate: '2025-05-17',
						progress: '3/3'
					},
					{
						icon: '📊',
						name: '数据达人',
						description: '查看所有数据图表',
						condition: '查看所有数据图表',
						unlocked: false,
						progress: '2/4'
					},
					{
						icon: '📉',
						name: '首次减量',
						description: '单日消耗量首次低于目标值',
						condition: '单日消耗量首次低于目标值',
						unlocked: true,
						unlockedDate: '2025-05-16',
						progress: '1/1'
					},
					{
						icon: '🌈',
						name: '七日坚持',
						description: '连续七天记录',
						condition: '连续七天记录',
						unlocked: false,
						progress: '3/7'
					},
					{
						icon: '🏆',
						name: '周减量王',
						description: '单周减量超过30%',
						condition: '单周减量超过30%',
						unlocked: false,
						progress: '15%/30%'
					},
					{
						icon: '🌙',
						name: '深夜守护者',
						description: '连续5天无夜间记录',
						condition: '连续5天无夜间记录',
						unlocked: false,
						progress: '2/5'
					},
					{
						icon: '🌱',
						name: '新生',
						description: '连续30天控制在目标以内',
						condition: '连续30天控制在目标以内',
						unlocked: false,
						progress: '3/30'
					},
					{
						icon: '💪',
						name: '意志力',
						description: '使用替代方案10次',
						condition: '使用替代方案10次',
						unlocked: false,
						progress: '3/10'
					}
				];
			}
		},
		
		// 加载健康里程碑数据
		loadHealthMilestones() {
			// 从状态管理获取健康里程碑数据
			const milestonesStr = uni.getStorageSync('healthMilestones');
			if (milestonesStr) {
				this.healthMilestones = JSON.parse(milestonesStr);
			} else {
				// 使用默认健康里程碑数据
				this.healthMilestones = [
					{
						time: '20分钟',
						title: '血压恢复正常',
						description: '血压和脉搏恢复到正常水平',
						reached: true,
						prediction: '已达成'
					},
					{
						time: '8小时',
						title: '一氧化碳水平下降',
						description: '血液中的一氧化碳水平下降到正常值',
						reached: true,
						prediction: '已达成'
					},
					{
						time: '24小时',
						title: '心脏病发作风险降低',
						description: '心脏病发作的风险开始降低',
						reached: false,
						prediction: '2025-05-20'
					},
					{
						time: '48小时',
						title: '嗅觉和味觉增强',
						description: '嗅觉和味觉神经开始恢复',
						reached: false,
						prediction: '2025-05-21'
					},
					{
						time: '72小时',
						title: '呼吸更顺畅',
						description: '支气管放松，呼吸更加顺畅',
						reached: false,
						prediction: '2025-05-22'
					},
					{
						time: '2-12周',
						title: '循环改善',
						description: '全身循环改善，肺功能增加30%',
						reached: false,
						prediction: '2025-06-15'
					},
					{
						time: '1-9个月',
						title: '咳嗽减少',
						description: '咳嗽和呼吸短促明显减少',
						reached: false,
						prediction: '2025-08-19'
					},
					{
						time: '1年',
						title: '冠心病风险减半',
						description: '冠心病风险降低到吸烟者的一半',
						reached: false,
						prediction: '2026-05-19'
					}
				];
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
		
		// 显示徽章详情
		showBadgeDetail(badge) {
			this.selectedBadge = badge;
			this.$refs.badgePopup.open();
		},
		
		// 关闭徽章详情
		closeBadgeDetail() {
			this.$refs.badgePopup.close();
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

.section-subtitle {
	font-size: 24rpx;
	color: #666;
}

.badges-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.badge-item {
	width: 30%;
	background-color: #F5F5F5;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	opacity: 0.6;
}

.badge-item.unlocked {
	background-color: rgba(138, 110, 243, 0.1);
	opacity: 1;
}

.badge-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 10rpx;
	font-size: 40rpx;
}

.badge-info {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.badge-name {
	font-size: 24rpx;
	color: #333;
	margin-bottom: 5rpx;
	text-align: center;
}

.badge-progress {
	font-size: 20rpx;
	color: #666;
}

.health-timeline {
	position: relative;
}

.milestone-item {
	display: flex;
	margin-bottom: 30rpx;
	position: relative;
}

.milestone-dot {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	background-color: #F0F0F0;
	margin-right: 20rpx;
	margin-top: 10rpx;
	z-index: 1;
}

.milestone-line {
	position: absolute;
	left: 10rpx;
	top: 20rpx;
	width: 2rpx;
	height: calc(100% + 30rpx);
	background-color: #F0F0F0;
}

.milestone-content {
	flex: 1;
}

.milestone-time {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 5rpx;
}

.milestone-title {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 5rpx;
}

.milestone-desc {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 5rpx;
}

.milestone-prediction {
	font-size: 24rpx;
	color: #8A6EF3;
}

.milestone-item.reached .milestone-dot {
	background-color: #4CAF50;
}

.milestone-item.reached .milestone-time,
.milestone-item.reached .milestone-title {
	color: #4CAF50;
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

.badge-detail {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	width: 80vw;
	padding: 30rpx;
}

.detail-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.detail-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.close-btn {
	font-size: 48rpx;
	color: #999;
	line-height: 1;
}

.detail-content {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.detail-icon {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background-color: rgba(138, 110, 243, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
	font-size: 60rpx;
}

.detail-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.detail-desc {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 20rpx;
	text-align: center;
}

.detail-condition {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 10rpx;
}

.detail-progress {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 20rpx;
}

.detail-status {
	margin-top: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.status-text {
	font-size: 28rpx;
	font-weight: bold;
	color: #4CAF50;
	margin-bottom: 10rpx;
}

.unlock-date {
	font-size: 24rpx;
	color: #666;
}
</style>
