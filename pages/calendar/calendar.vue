<template>
	<view class="container">
		<view class="header">
			<view class="month-selector">
				<view class="arrow" @click="prevMonth">
					<text>◀</text>
				</view>
				<view class="current-month">
					<text>{{currentYear}}年{{currentMonth + 1}}月</text>
				</view>
				<view class="arrow" @click="nextMonth">
					<text>▶</text>
				</view>
			</view>
		</view>
		
		<view class="calendar">
			<!-- 星期标题 -->
			<view class="week-header">
				<view class="week-day" v-for="(day, index) in weekDays" :key="index">
					<text>{{day}}</text>
				</view>
			</view>
			
			<!-- 日历格子 -->
			<view class="days-grid">
				<view 
					v-for="(day, index) in days" 
					:key="index" 
					class="day-cell" 
					:class="{
						'empty': !day.date,
						'today': day.isToday,
						'selected': selectedDate === day.fullDate
					}"
					@click="selectDate(day)"
				>
					<view v-if="day.date" class="day-content">
						<text class="day-number">{{day.date}}</text>
						<view 
							v-if="day.count > 0" 
							class="count-badge"
							:class="getLevelClass(day.count)"
						>
							<text>{{day.count}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 日期详情 -->
		<view class="date-details" v-if="selectedDate">
			<view class="details-header">
				<text class="details-date">{{formatSelectedDate}}</text>
				<text class="details-count">共 {{selectedDayRecords.length}} 条记录</text>
			</view>
			
			<view class="details-summary">
				<view class="summary-item">
					<text class="summary-label">总数量</text>
					<text class="summary-value">{{totalCount}}支</text>
				</view>
				<view class="summary-item">
					<text class="summary-label">平均心情</text>
					<text class="summary-value">{{averageMood}}</text>
				</view>
				<view class="summary-item">
					<text class="summary-label">主要场景</text>
					<text class="summary-value">{{mainScene}}</text>
				</view>
			</view>
			
			<view class="record-list">
				<view class="record-item" v-for="(record, index) in selectedDayRecords" :key="index">
					<view class="record-left">
						<text class="record-time">{{formatTime(record.timestamp)}}</text>
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
			
			<view class="empty-records" v-if="selectedDayRecords.length === 0">
				<text>暂无记录</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			weekDays: ['日', '一', '二', '三', '四', '五', '六'],
			currentYear: new Date().getFullYear(),
			currentMonth: new Date().getMonth(),
			days: [],
			selectedDate: '',
			selectedDayRecords: [],
			monthData: {} // 存储每月数据的缓存
		}
	},
	computed: {
		formatSelectedDate() {
			if (!this.selectedDate) return '';
			
			const date = new Date(this.selectedDate);
			return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
		},
		totalCount() {
			return this.selectedDayRecords.reduce((sum, record) => sum + record.quantity, 0);
		},
		averageMood() {
			if (this.selectedDayRecords.length === 0) return '无';
			
			// 找出出现次数最多的心情
			const moodCounts = {};
			this.selectedDayRecords.forEach(record => {
				const mood = record.mood.emoji;
				moodCounts[mood] = (moodCounts[mood] || 0) + 1;
			});
			
			let maxCount = 0;
			let mainMood = '';
			
			for (const mood in moodCounts) {
				if (moodCounts[mood] > maxCount) {
					maxCount = moodCounts[mood];
					mainMood = mood;
				}
			}
			
			return mainMood;
		},
		mainScene() {
			if (this.selectedDayRecords.length === 0) return '无';
			
			// 找出出现次数最多的场景
			const sceneCounts = {};
			this.selectedDayRecords.forEach(record => {
				const scene = record.scene;
				sceneCounts[scene] = (sceneCounts[scene] || 0) + 1;
			});
			
			let maxCount = 0;
			let mainScene = '';
			
			for (const scene in sceneCounts) {
				if (sceneCounts[scene] > maxCount) {
					maxCount = sceneCounts[scene];
					mainScene = scene;
				}
			}
			
			return mainScene;
		}
	},
	onLoad() {
		// 初始化日历
		this.initCalendar();
	},
	methods: {
		// 初始化日历
		initCalendar() {
			// 生成当前月份的日历数据
			this.generateCalendar();
			
			// 默认选中今天
			const today = new Date();
			const todayStr = this.$utils.formatDate(today);
			this.selectedDate = todayStr;
			
			// 加载今天的记录
			this.loadDateRecords(todayStr);
		},
		
		// 生成日历数据
		generateCalendar() {
			const year = this.currentYear;
			const month = this.currentMonth;
			
			// 获取当月第一天是星期几
			const firstDay = new Date(year, month, 1).getDay();
			
			// 获取当月天数
			const daysInMonth = new Date(year, month + 1, 0).getDate();
			
			// 获取今天日期
			const today = new Date();
			const todayYear = today.getFullYear();
			const todayMonth = today.getMonth();
			const todayDate = today.getDate();
			
			// 生成日历数据
			const days = [];
			
			// 填充前面的空白
			for (let i = 0; i < firstDay; i++) {
				days.push({
					date: '',
					fullDate: '',
					isToday: false,
					count: 0
				});
			}
			
			// 填充日期
			for (let i = 1; i <= daysInMonth; i++) {
				const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
				const isToday = year === todayYear && month === todayMonth && i === todayDate;
				
				days.push({
					date: i,
					fullDate,
					isToday,
					count: this.getDayCount(fullDate)
				});
			}
			
			this.days = days;
		},
		
		// 获取某天的记录数量
		getDayCount(date) {
			// 从缓存中获取
			if (this.monthData[date]) {
				return this.monthData[date].length;
			}
			
			// 从存储中获取
			const recordsStr = uni.getStorageSync(`records_${date}`);
			if (recordsStr) {
				const records = JSON.parse(recordsStr);
				this.monthData[date] = records;
				return records.length;
			}
			
			return 0;
		},
		
		// 加载某天的记录
		loadDateRecords(date) {
			// 从缓存中获取
			if (this.monthData[date]) {
				this.selectedDayRecords = this.monthData[date];
				return;
			}
			
			// 从存储中获取
			const recordsStr = uni.getStorageSync(`records_${date}`);
			if (recordsStr) {
				const records = JSON.parse(recordsStr);
				this.monthData[date] = records;
				this.selectedDayRecords = records;
			} else {
				this.selectedDayRecords = [];
			}
		},
		
		// 选择日期
		selectDate(day) {
			if (!day.date) return;
			
			this.selectedDate = day.fullDate;
			this.loadDateRecords(day.fullDate);
		},
		
		// 上个月
		prevMonth() {
			if (this.currentMonth === 0) {
				this.currentYear--;
				this.currentMonth = 11;
			} else {
				this.currentMonth--;
			}
			
			// 清空月份数据缓存
			this.monthData = {};
			
			// 重新生成日历
			this.generateCalendar();
		},
		
		// 下个月
		nextMonth() {
			if (this.currentMonth === 11) {
				this.currentYear++;
				this.currentMonth = 0;
			} else {
				this.currentMonth++;
			}
			
			// 清空月份数据缓存
			this.monthData = {};
			
			// 重新生成日历
			this.generateCalendar();
		},
		
		// 格式化时间
		formatTime(timestamp) {
			return this.$utils.formatTime(timestamp);
		},
		
		// 获取颜色等级样式
		getLevelClass(count) {
			if (count < 5) {
				return 'level-green';
			} else if (count <= 10) {
				return 'level-orange';
			} else {
				return 'level-red';
			}
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding-bottom: 40rpx;
}

.header {
	background: linear-gradient(135deg, #6E7FF3, #9D6EF3);
	padding: 20rpx 40rpx;
	position: sticky;
	top: 0;
	z-index: 10;
}

.month-selector {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 80rpx;
}

.arrow {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.arrow text {
	color: #FFFFFF;
	font-size: 32rpx;
}

.current-month {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.current-month text {
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
}

.calendar {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	margin: 40rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.week-header {
	display: flex;
	margin-bottom: 20rpx;
}

.week-day {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 60rpx;
}

.week-day text {
	font-size: 28rpx;
	color: #666;
}

.days-grid {
	display: flex;
	flex-wrap: wrap;
}

.day-cell {
	width: 14.28%;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.day-content {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
}

.day-number {
	font-size: 28rpx;
	color: #333;
}

.count-badge {
	position: absolute;
	bottom: 10rpx;
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.count-badge text {
	font-size: 20rpx;
	color: #FFFFFF;
}

.level-green {
	background-color: #4CAF50;
}

.level-orange {
	background-color: #FF9800;
}

.level-red {
	background-color: #F44336;
}

.empty {
	opacity: 0;
}

.today .day-content {
	background-color: rgba(138, 110, 243, 0.1);
	border: 1rpx solid #8A6EF3;
}

.selected .day-content {
	background-color: #8A6EF3;
}

.selected .day-number {
	color: #FFFFFF;
}

.date-details {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	margin: 0 40rpx 40rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.details-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.details-date {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.details-count {
	font-size: 24rpx;
	color: #666;
}

.details-summary {
	display: flex;
	justify-content: space-between;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #F0F0F0;
}

.summary-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.summary-label {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.summary-value {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.record-list {
	max-height: 600rpx;
	overflow-y: auto;
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

.empty-records {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 200rpx;
}

.empty-records text {
	font-size: 28rpx;
	color: #999;
}
</style>
