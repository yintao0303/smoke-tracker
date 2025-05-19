<template>
	<view class="container">
		<view class="header">
			<view class="time-tabs">
				<view 
					v-for="(tab, index) in timeTabs" 
					:key="index" 
					class="tab-item" 
					:class="{'active': activeTimeTab === index}"
					@click="switchTimeTab(index)"
				>
					<text>{{tab}}</text>
				</view>
			</view>
		</view>
		
		<view class="content">
			<!-- 核心数据卡片 -->
			<view class="data-cards">
				<view class="data-card">
					<text class="card-title">总消耗量</text>
					<text class="card-value">{{totalConsumption}}</text>
					<text class="card-unit">支</text>
					<view class="card-trend" :class="trendClass">
						<text>{{trendText}}</text>
					</view>
				</view>
				
				<view class="data-card">
					<text class="card-title">健康指数</text>
					<text class="card-value">{{healthIndex}}</text>
					<view class="progress-bar">
						<view class="progress" :style="{width: healthIndex + '%', backgroundColor: getHealthColor(healthIndex)}"></view>
					</view>
				</view>
				
				<view class="data-card">
					<text class="card-title">节省金额</text>
					<text class="card-value">¥{{savedMoney}}</text>
					<text class="card-desc">相比目标值</text>
				</view>
			</view>
			
			<!-- 图表区域 -->
			<view class="chart-section">
				<view class="section-header">
					<text class="section-title">消耗趋势</text>
					<view class="chart-tabs">
						<view 
							v-for="(tab, index) in chartTabs" 
							:key="index" 
							class="chart-tab" 
							:class="{'active': activeChartTab === index}"
							@click="switchChartTab(index)"
						>
							<text>{{tab}}</text>
						</view>
					</view>
				</view>
				
				<view class="chart-container">
					<view class="chart-placeholder">
						<image class="chart-image" src="/static/images/trend-chart.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			
			<!-- 热力图区域 -->
			<view class="chart-section">
				<view class="section-header">
					<text class="section-title">24小时分布</text>
				</view>
				
				<view class="chart-container">
					<view class="chart-placeholder">
						<image class="chart-image" src="/static/images/heatmap-chart.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			
			<!-- 场景占比区域 -->
			<view class="chart-section">
				<view class="section-header">
					<text class="section-title">触发场景占比</text>
				</view>
				
				<view class="chart-container">
					<view class="chart-placeholder">
						<image class="chart-image" src="/static/images/pie-chart.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="scene-legend">
					<view class="legend-item" v-for="(scene, index) in sceneData" :key="index">
						<view class="legend-color" :style="{backgroundColor: scene.color}"></view>
						<text class="legend-text">{{scene.name}}: {{scene.percentage}}%</text>
					</view>
				</view>
			</view>
			
			<!-- 详细记录区域 -->
			<view class="record-section">
				<view class="section-header">
					<text class="section-title">详细记录</text>
				</view>
				
				<view class="record-list">
					<view class="record-item" v-for="(record, index) in records" :key="index">
						<view class="record-left">
							<text class="record-time">{{record.time}}</text>
							<text class="record-scene">{{record.scene}}</text>
						</view>
						<view class="record-middle">
							<text class="record-mood">{{record.mood.emoji}}</text>
							<text class="record-remark" v-if="record.remark">{{record.remark}}</text>
						</view>
						<view class="record-right">
							<text class="record-quantity">{{record.quantity}}支</text>
						</view>
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
			timeTabs: ['日', '周', '月', '年'],
			activeTimeTab: 0,
			chartTabs: ['折线图', '柱状图'],
			activeChartTab: 0,
			totalConsumption: 0,
			previousConsumption: 0,
			healthIndex: 85,
			savedMoney: '0.00',
			sceneData: [
				{ name: '工作压力', percentage: 45, color: '#6E7FF3' },
				{ name: '社交活动', percentage: 25, color: '#9D6EF3' },
				{ name: '饭后', percentage: 15, color: '#4CAF50' },
				{ name: '休息时间', percentage: 10, color: '#FF9800' },
				{ name: '其他', percentage: 5, color: '#F44336' }
			],
			records: []
		}
	},
	computed: {
		trendClass() {
			if (this.totalConsumption < this.previousConsumption) {
				return 'trend-down';
			} else if (this.totalConsumption > this.previousConsumption) {
				return 'trend-up';
			} else {
				return 'trend-equal';
			}
		},
		trendText() {
			if (this.totalConsumption < this.previousConsumption) {
				const diff = this.previousConsumption - this.totalConsumption;
				const percentage = Math.round((diff / this.previousConsumption) * 100);
				return `↓ ${percentage}%`;
			} else if (this.totalConsumption > this.previousConsumption) {
				const diff = this.totalConsumption - this.previousConsumption;
				const percentage = Math.round((diff / this.previousConsumption) * 100);
				return `↑ ${percentage}%`;
			} else {
				return '持平';
			}
		}
	},
	onLoad() {
		// 初始化数据
		this.loadData();
	},
	methods: {
		// 切换时间维度
		switchTimeTab(index) {
			this.activeTimeTab = index;
			this.loadData();
		},
		
		// 切换图表类型
		switchChartTab(index) {
			this.activeChartTab = index;
		},
		
		// 加载数据
		loadData() {
			// 根据当前选择的时间维度加载数据
			const timeType = this.timeTabs[this.activeTimeTab];
			
			// 模拟加载数据
			uni.showLoading({
				title: '加载中...'
			});
			
			setTimeout(() => {
				uni.hideLoading();
				
				// 模拟数据
				switch(timeType) {
					case '日':
						this.totalConsumption = 8;
						this.previousConsumption = 10;
						this.healthIndex = 85;
						this.savedMoney = '10.00';
						break;
					case '周':
						this.totalConsumption = 45;
						this.previousConsumption = 60;
						this.healthIndex = 80;
						this.savedMoney = '75.00';
						break;
					case '月':
						this.totalConsumption = 180;
						this.previousConsumption = 220;
						this.healthIndex = 75;
						this.savedMoney = '200.00';
						break;
					case '年':
						this.totalConsumption = 2160;
						this.previousConsumption = 2500;
						this.healthIndex = 70;
						this.savedMoney = '1700.00';
						break;
				}
				
				// 加载详细记录
				this.loadRecords();
			}, 500);
		},
		
		// 加载详细记录
		loadRecords() {
			// 从状态管理获取记录
			const today = new Date().toISOString().split('T')[0];
			const recordsStr = uni.getStorageSync(`records_${today}`);
			
			if (recordsStr) {
				const records = JSON.parse(recordsStr);
				
				// 格式化记录
				this.records = records.map(record => {
					return {
						...record,
						time: this.$utils.formatTime(record.timestamp)
					};
				});
			} else {
				// 模拟记录
				this.records = [
					{
						time: '08:30',
						scene: '工作压力',
						mood: { emoji: '😕', text: '不好' },
						quantity: 2,
						remark: '早会前'
					},
					{
						time: '12:15',
						scene: '饭后',
						mood: { emoji: '🙂', text: '好' },
						quantity: 1,
						remark: ''
					},
					{
						time: '15:45',
						scene: '工作压力',
						mood: { emoji: '😐', text: '一般' },
						quantity: 2,
						remark: '项目截止前'
					},
					{
						time: '19:20',
						scene: '社交活动',
						mood: { emoji: '😀', text: '很好' },
						quantity: 3,
						remark: '朋友聚会'
					}
				];
			}
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
	padding: 20rpx 40rpx;
	position: sticky;
	top: 0;
	z-index: 10;
}

.time-tabs {
	display: flex;
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 45rpx;
	padding: 5rpx;
}

.tab-item {
	flex: 1;
	height: 70rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 35rpx;
}

.tab-item text {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.8);
}

.tab-item.active {
	background-color: #FFFFFF;
}

.tab-item.active text {
	color: #8A6EF3;
	font-weight: bold;
}

.content {
	padding: 40rpx;
}

.data-cards {
	display: flex;
	justify-content: space-between;
	margin-bottom: 40rpx;
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

.card-title {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.card-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.card-unit {
	font-size: 24rpx;
	color: #999;
	margin-top: 5rpx;
}

.card-desc {
	font-size: 20rpx;
	color: #999;
	margin-top: 5rpx;
}

.card-trend {
	margin-top: 10rpx;
	padding: 5rpx 10rpx;
	border-radius: 10rpx;
	font-size: 20rpx;
}

.trend-down {
	background-color: rgba(76, 175, 80, 0.1);
}

.trend-down text {
	color: #4CAF50;
}

.trend-up {
	background-color: rgba(244, 67, 54, 0.1);
}

.trend-up text {
	color: #F44336;
}

.trend-equal {
	background-color: rgba(158, 158, 158, 0.1);
}

.trend-equal text {
	color: #9E9E9E;
}

.progress-bar {
	width: 100%;
	height: 10rpx;
	background-color: #F0F0F0;
	border-radius: 5rpx;
	overflow: hidden;
	margin-top: 10rpx;
}

.progress {
	height: 100%;
	border-radius: 5rpx;
}

.chart-section {
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
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.chart-tabs {
	display: flex;
}

.chart-tab {
	padding: 10rpx 20rpx;
	border-radius: 20rpx;
	margin-left: 10rpx;
}

.chart-tab text {
	font-size: 24rpx;
	color: #666;
}

.chart-tab.active {
	background-color: rgba(138, 110, 243, 0.1);
}

.chart-tab.active text {
	color: #8A6EF3;
	font-weight: bold;
}

.chart-container {
	height: 400rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.chart-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.chart-image {
	width: 100%;
	height: 100%;
}

.scene-legend {
	display: flex;
	flex-wrap: wrap;
	margin-top: 20rpx;
}

.legend-item {
	display: flex;
	align-items: center;
	margin-right: 30rpx;
	margin-bottom: 10rpx;
}

.legend-color {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	margin-right: 10rpx;
}

.legend-text {
	font-size: 24rpx;
	color: #666;
}

.record-list {
	margin-top: 20rpx;
}

.record-item {
	display: flex;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
}

.record-left {
	display: flex;
	flex-direction: column;
}

.record-time {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 5rpx;
}

.record-scene {
	font-size: 24rpx;
	color: #666;
}

.record-middle {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.record-mood {
	font-size: 32rpx;
	margin-bottom: 5rpx;
}

.record-remark {
	font-size: 24rpx;
	color: #999;
}

.record-right {
	display: flex;
	align-items: center;
}

.record-quantity {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}
</style>
