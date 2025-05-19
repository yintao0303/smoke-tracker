<template>
	<view class="container">
		<view class="header">
			<text class="page-title">社交互动</text>
		</view>
		
		<view class="content">
			<!-- 排行榜 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">好友排行</text>
					<text class="section-subtitle">查看好友的健康进度</text>
				</view>
				
				<view class="friend-list">
					<view 
						v-for="(friend, index) in friends" 
						:key="index" 
						class="friend-item"
					>
						<view class="friend-rank">
							<text>{{index + 1}}</text>
						</view>
						<view class="friend-avatar">
							<image :src="friend.avatar" mode="aspectFill"></image>
						</view>
						<view class="friend-info">
							<text class="friend-name">{{friend.nickname}}</text>
							<view class="friend-badges">
								<text 
									v-for="(badge, badgeIndex) in friend.badges" 
									:key="badgeIndex" 
									class="friend-badge"
								>{{badge.icon}}</text>
							</view>
						</view>
						<view class="friend-stats">
							<view class="stats-item">
								<text class="stats-value">{{friend.healthIndex}}</text>
								<text class="stats-label">健康指数</text>
							</view>
							<view class="stats-item">
								<text class="stats-value">{{friend.progressRate}}%</text>
								<text class="stats-label">减量率</text>
							</view>
							<view class="stats-item">
								<text class="stats-value">{{friend.streakDays}}</text>
								<text class="stats-label">连续天数</text>
							</view>
						</view>
						<view class="friend-actions">
							<view 
								class="action-btn like-btn" 
								:class="{'active': friend.isLiked}"
								@click="toggleLike(index)"
							>
								<text class="action-icon">👍</text>
								<text class="action-count">{{friend.likeCount}}</text>
							</view>
							<view class="action-btn message-btn" @click="showMessagePanel(friend)">
								<text class="action-icon">💬</text>
							</view>
							<view class="action-btn challenge-btn" @click="showChallengePanel(friend)">
								<text class="action-icon">🏆</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 互动消息 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">互动消息</text>
					<text class="section-subtitle">{{interactions.length}}条新消息</text>
				</view>
				
				<view class="interaction-list">
					<view 
						v-for="(interaction, index) in interactions" 
						:key="index" 
						class="interaction-item"
						:class="{'interaction-' + interaction.type}"
					>
						<view class="interaction-avatar">
							<image :src="interaction.avatar" mode="aspectFill"></image>
						</view>
						<view class="interaction-content">
							<view class="interaction-header">
								<text class="interaction-name">{{interaction.nickname}}</text>
								<text class="interaction-time">{{interaction.time}}</text>
							</view>
							<text class="interaction-text">{{interaction.content}}</text>
							
							<view class="interaction-actions" v-if="interaction.type === 'challenge'">
								<view class="action-btn accept-btn" @click="respondChallenge(index, true)">
									<text>接受</text>
								</view>
								<view class="action-btn decline-btn" @click="respondChallenge(index, false)">
									<text>婉拒</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="empty-interactions" v-if="interactions.length === 0">
					<text>暂无互动消息</text>
				</view>
			</view>
			
			<!-- 分享卡片 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">分享卡片</text>
					<text class="section-subtitle">生成分享卡片，展示你的成就</text>
				</view>
				
				<view class="share-templates">
					<view 
						v-for="(template, index) in shareTemplates" 
						:key="index" 
						class="template-item"
						:class="{'selected': selectedTemplate === index}"
						@click="selectTemplate(index)"
					>
						<image :src="template.image" mode="aspectFill"></image>
						<text class="template-name">{{template.name}}</text>
					</view>
				</view>
				
				<view class="share-preview">
					<view class="preview-card">
						<image class="preview-bg" :src="currentTemplate.image" mode="aspectFill"></image>
						<view class="preview-content">
							<text class="preview-title">我的戒烟之旅</text>
							<view class="preview-data">
								<view class="preview-item">
									<text class="preview-value">{{stats.days}}</text>
									<text class="preview-label">记录天数</text>
								</view>
								<view class="preview-item">
									<text class="preview-value">{{stats.reduction}}%</text>
									<text class="preview-label">减量比例</text>
								</view>
								<view class="preview-item">
									<text class="preview-value">¥{{stats.saved}}</text>
									<text class="preview-label">节省金额</text>
								</view>
							</view>
							<text class="preview-slogan">每一天，都是新的开始</text>
						</view>
					</view>
				</view>
				
				<view class="share-btn" @click="generateShareCard">
					<text>生成分享卡片</text>
				</view>
			</view>
		</view>
		
		<!-- 消息面板 -->
		<uni-popup ref="messagePopup" type="bottom">
			<view class="message-panel">
				<view class="panel-header">
					<text class="panel-title">发送鼓励</text>
					<text class="close-btn" @click="closeMessagePanel">×</text>
				</view>
				
				<view class="panel-body">
					<view class="message-to">
						<text>发送给: {{selectedFriend.nickname}}</text>
					</view>
					
					<view class="message-templates">
						<view 
							v-for="(template, index) in messageTemplates" 
							:key="index" 
							class="message-template"
							:class="{'selected': selectedMessage === index}"
							@click="selectMessage(index)"
						>
							<text>{{template}}</text>
						</view>
					</view>
					
					<textarea 
						class="message-input" 
						v-model="customMessage" 
						placeholder="或者输入自定义消息..." 
					/>
					
					<view class="send-btn" @click="sendMessage">
						<text>发送鼓励</text>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 挑战面板 -->
		<uni-popup ref="challengePopup" type="bottom">
			<view class="challenge-panel">
				<view class="panel-header">
					<text class="panel-title">发起挑战</text>
					<text class="close-btn" @click="closeChallengePanel">×</text>
				</view>
				
				<view class="panel-body">
					<view class="challenge-to">
						<text>挑战对象: {{selectedFriend.nickname}}</text>
					</view>
					
					<view class="challenge-type">
						<text class="input-label">挑战类型</text>
						<radio-group @change="onChallengeTypeChange">
							<label class="radio-item">
								<radio :checked="challengeType === '日减量'" value="日减量" />
								<text>日减量挑战</text>
							</label>
							<label class="radio-item">
								<radio :checked="challengeType === '周减量'" value="周减量" />
								<text>周减量挑战</text>
							</label>
							<label class="radio-item">
								<radio :checked="challengeType === '连续打卡'" value="连续打卡" />
								<text>连续打卡挑战</text>
							</label>
						</radio-group>
					</view>
					
					<view class="challenge-duration">
						<text class="input-label">挑战时长</text>
						<slider 
							:value="challengeDuration" 
							:min="1" 
							:max="30" 
							:step="1" 
							show-value 
							@change="onDurationChange"
						/>
						<text class="duration-unit">天</text>
					</view>
					
					<view class="challenge-goal">
						<text class="input-label">目标减量</text>
						<slider 
							:value="challengeGoal" 
							:min="5" 
							:max="50" 
							:step="5" 
							show-value 
							@change="onGoalChange"
						/>
						<text class="goal-unit">%</text>
					</view>
					
					<view class="send-btn" @click="sendChallenge">
						<text>发起挑战</text>
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
			friends: [],
			interactions: [],
			shareTemplates: [
				{
					name: '简约蓝',
					image: '/static/images/share-template1.png'
				},
				{
					name: '健康绿',
					image: '/static/images/share-template2.png'
				},
				{
					name: '活力橙',
					image: '/static/images/share-template3.png'
				}
			],
			selectedTemplate: 0,
			stats: {
				days: 5,
				reduction: 25,
				saved: '60.00'
			},
			selectedFriend: {},
			messageTemplates: [
				'加油！你已经做得很棒了！',
				'坚持就是胜利，继续加油！',
				'每一天都是新的开始，你可以的！',
				'看到你的进步，真为你感到骄傲！',
				'健康生活，从现在开始！'
			],
			selectedMessage: 0,
			customMessage: '',
			challengeType: '日减量',
			challengeDuration: 3,
			challengeGoal: 20
		}
	},
	computed: {
		currentTemplate() {
			return this.shareTemplates[this.selectedTemplate];
		}
	},
	onLoad() {
		// 加载数据
		this.loadData();
	},
	methods: {
		// 加载数据
		loadData() {
			// 加载好友列表
			this.loadFriends();
			
			// 加载互动消息
			this.loadInteractions();
		},
		
		// 加载好友列表
		loadFriends() {
			// 从状态管理获取好友列表
			const friendsStr = uni.getStorageSync('friends');
			if (friendsStr) {
				this.friends = JSON.parse(friendsStr);
			} else {
				// 使用默认好友列表
				this.friends = [
					{
						id: '1',
						nickname: '健康达人',
						avatar: '/static/images/avatar1.png',
						healthIndex: 92,
						progressRate: 35,
						streakDays: 15,
						likeCount: 24,
						isLiked: false,
						badges: [
							{ icon: '🌟', name: '初次记录' },
							{ icon: '🔥', name: '三日连续' },
							{ icon: '📊', name: '数据达人' },
							{ icon: '📉', name: '首次减量' },
							{ icon: '🌈', name: '七日坚持' }
						]
					},
					{
						id: '2',
						nickname: '坚持不懈',
						avatar: '/static/images/avatar2.png',
						healthIndex: 85,
						progressRate: 28,
						streakDays: 12,
						likeCount: 18,
						isLiked: true,
						badges: [
							{ icon: '🌟', name: '初次记录' },
							{ icon: '🔥', name: '三日连续' },
							{ icon: '📉', name: '首次减量' }
						]
					},
					{
						id: '3',
						nickname: '新手上路',
						avatar: '/static/images/avatar3.png',
						healthIndex: 78,
						progressRate: 42,
						streakDays: 8,
						likeCount: 15,
						isLiked: false,
						badges: [
							{ icon: '🌟', name: '初次记录' },
							{ icon: '📉', name: '首次减量' }
						]
					},
					{
						id: '4',
						nickname: '稳步前进',
						avatar: '/static/images/avatar4.png',
						healthIndex: 80,
						progressRate: 25,
						streakDays: 10,
						likeCount: 12,
						isLiked: false,
						badges: [
							{ icon: '🌟', name: '初次记录' },
							{ icon: '🔥', name: '三日连续' },
							{ icon: '📊', name: '数据达人' }
						]
					},
					{
						id: '5',
						nickname: '决心满满',
						avatar: '/static/images/avatar5.png',
						healthIndex: 75,
						progressRate: 30,
						streakDays: 7,
						likeCount: 9,
						isLiked: false,
						badges: [
							{ icon: '🌟', name: '初次记录' },
							{ icon: '🔥', name: '三日连续' }
						]
					}
				];
			}
		},
		
		// 加载互动消息
		loadInteractions() {
			// 从状态管理获取互动消息
			const interactionsStr = uni.getStorageSync('interactions');
			if (interactionsStr) {
				this.interactions = JSON.parse(interactionsStr);
			} else {
				// 使用默认互动消息
				this.interactions = [
					{
						id: '1',
						nickname: '健康达人',
						avatar: '/static/images/avatar1.png',
						time: '10分钟前',
						type: 'like',
						content: '给你点赞了一个👍'
					},
					{
						id: '2',
						nickname: '坚持不懈',
						avatar: '/static/images/avatar2.png',
						time: '1小时前',
						type: 'encourage',
						content: '加油！你已经做得很棒了，继续保持！'
					},
					{
						id: '3',
						nickname: '新手上路',
						avatar: '/static/images/avatar3.png',
						time: '3小时前',
						type: 'challenge',
						content: '向你发起了为期3天的日减量挑战，一起加油吧！'
					},
					{
						id: '4',
						nickname: '稳步前进',
						avatar: '/static/images/avatar4.png',
						time: '昨天',
						type: 'like',
						content: '给你点赞了一个👍'
					}
				];
			}
		},
		
		// 切换点赞状态
		toggleLike(index) {
			const friend = this.friends[index];
			friend.isLiked = !friend.isLiked;
			
			if (friend.isLiked) {
				friend.likeCount++;
			} else {
				friend.likeCount--;
			}
			
			// 保存到状态管理
			uni.setStorageSync('friends', JSON.stringify(this.friends));
			
			// 显示提示
			uni.showToast({
				title: friend.isLiked ? '点赞成功' : '取消点赞',
				icon: 'success'
			});
		},
		
		// 显示消息面板
		showMessagePanel(friend) {
			this.selectedFriend = friend;
			this.selectedMessage = 0;
			this.customMessage = '';
			this.$refs.messagePopup.open();
		},
		
		// 关闭消息面板
		closeMessagePanel() {
			this.$refs.messagePopup.close();
		},
		
		// 选择消息模板
		selectMessage(index) {
			this.selectedMessage = index;
			this.customMessage = this.messageTemplates[index];
		},
		
		// 发送消息
		sendMessage() {
			if (!this.customMessage) {
				uni.showToast({
					title: '请输入消息内容',
					icon: 'none'
				});
				return;
			}
			
			// 添加到互动消息
			const newInteraction = {
				id: 'msg_' + Date.now(),
				nickname: '我',
				avatar: '/static/images/default-avatar.png',
				time: '刚刚',
				type: 'encourage',
				content: `向${this.selectedFriend.nickname}发送了鼓励：${this.customMessage}`
			};
			
			this.interactions.unshift(newInteraction);
			
			// 保存到状态管理
			uni.setStorageSync('interactions', JSON.stringify(this.interactions));
			
			// 关闭面板
			this.closeMessagePanel();
			
			// 显示提示
			uni.showToast({
				title: '发送成功',
				icon: 'success'
			});
		},
		
		// 显示挑战面板
		showChallengePanel(friend) {
			this.selectedFriend = friend;
			this.challengeType = '日减量';
			this.challengeDuration = 3;
			this.challengeGoal = 20;
			this.$refs.challengePopup.open();
		},
		
		// 关闭挑战面板
		closeChallengePanel() {
			this.$refs.challengePopup.close();
		},
		
		// 挑战类型变更
		onChallengeTypeChange(e) {
			this.challengeType = e.detail.value;
		},
		
		// 挑战时长变更
		onDurationChange(e) {
			this.challengeDuration = e.detail.value;
		},
		
		// 目标减量变更
		onGoalChange(e) {
			this.challengeGoal = e.detail.value;
		},
		
		// 发送挑战
		sendChallenge() {
			// 添加到互动消息
			const newInteraction = {
				id: 'challenge_' + Date.now(),
				nickname: '我',
				avatar: '/static/images/default-avatar.png',
				time: '刚刚',
				type: 'challenge',
				content: `向${this.selectedFriend.nickname}发起了为期${this.challengeDuration}天的${this.challengeType}挑战，目标减量${this.challengeGoal}%`
			};
			
			this.interactions.unshift(newInteraction);
			
			// 保存到状态管理
			uni.setStorageSync('interactions', JSON.stringify(this.interactions));
			
			// 关闭面板
			this.closeChallengePanel();
			
			// 显示提示
			uni.showToast({
				title: '挑战已发起',
				icon: 'success'
			});
		},
		
		// 响应挑战
		respondChallenge(index, accept) {
			const interaction = this.interactions[index];
			
			// 更新互动消息
			if (accept) {
				interaction.content += '（已接受）';
			} else {
				interaction.content += '（已婉拒）';
			}
			
			// 保存到状态管理
			uni.setStorageSync('interactions', JSON.stringify(this.interactions));
			
			// 显示提示
			uni.showToast({
				title: accept ? '已接受挑战' : '已婉拒挑战',
				icon: 'success'
			});
		},
		
		// 选择分享模板
		selectTemplate(index) {
			this.selectedTemplate = index;
		},
		
		// 生成分享卡片
		generateShareCard() {
			// 模拟生成分享卡片
			uni.showLoading({
				title: '生成中...'
			});
			
			setTimeout(() => {
				uni.hideLoading();
				
				uni.showModal({
					title: '分享卡片已生成',
					content: '分享卡片已生成，是否立即分享？',
					confirmText: '立即分享',
					cancelText: '稍后分享',
					success: (res) => {
						if (res.confirm) {
							// 模拟分享操作
							uni.showToast({
								title: '分享成功',
								icon: 'success'
							});
						}
					}
				});
			}, 1500);
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

.friend-list {
	margin-bottom: 20rpx;
}

.friend-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
}

.friend-rank {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background-color: #F5F5F5;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.friend-rank text {
	font-size: 24rpx;
	color: #666;
}

.friend-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 20rpx;
}

.friend-avatar image {
	width: 100%;
	height: 100%;
}

.friend-info {
	flex: 1;
}

.friend-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.friend-badges {
	display: flex;
}

.friend-badge {
	font-size: 24rpx;
	margin-right: 10rpx;
}

.friend-stats {
	display: flex;
	margin-right: 20rpx;
}

.stats-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 20rpx;
}

.stats-value {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.stats-label {
	font-size: 20rpx;
	color: #666;
}

.friend-actions {
	display: flex;
}

.action-btn {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background-color: #F5F5F5;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-left: 10rpx;
}

.action-icon {
	font-size: 24rpx;
}

.action-count {
	font-size: 20rpx;
	color: #666;
}

.like-btn.active {
	background-color: rgba(244, 67, 54, 0.1);
}

.interaction-list {
	margin-bottom: 20rpx;
}

.interaction-item {
	display: flex;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
}

.interaction-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 20rpx;
}

.interaction-avatar image {
	width: 100%;
	height: 100%;
}

.interaction-content {
	flex: 1;
}

.interaction-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10rpx;
}

.interaction-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.interaction-time {
	font-size: 24rpx;
	color: #999;
}

.interaction-text {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 10rpx;
}

.interaction-actions {
	display: flex;
	margin-top: 10rpx;
}

.accept-btn, .decline-btn {
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	margin-right: 20rpx;
}

.accept-btn {
	background-color: rgba(76, 175, 80, 0.1);
}

.accept-btn text {
	color: #4CAF50;
	font-size: 24rpx;
}

.decline-btn {
	background-color: rgba(244, 67, 54, 0.1);
}

.decline-btn text {
	color: #F44336;
	font-size: 24rpx;
}

.interaction-like {
	background-color: rgba(33, 150, 243, 0.05);
}

.interaction-encourage {
	background-color: rgba(76, 175, 80, 0.05);
}

.interaction-challenge {
	background-color: rgba(255, 152, 0, 0.05);
}

.empty-interactions {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 200rpx;
}

.empty-interactions text {
	font-size: 28rpx;
	color: #999;
}

.share-templates {
	display: flex;
	justify-content: space-between;
	margin-bottom: 30rpx;
}

.template-item {
	width: 30%;
	border-radius: 16rpx;
	overflow: hidden;
	position: relative;
}

.template-item image {
	width: 100%;
	height: 150rpx;
}

.template-name {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.5);
	color: #FFFFFF;
	font-size: 24rpx;
	padding: 10rpx;
	text-align: center;
}

.template-item.selected {
	border: 2rpx solid #8A6EF3;
}

.share-preview {
	margin-bottom: 30rpx;
}

.preview-card {
	width: 100%;
	height: 400rpx;
	border-radius: 16rpx;
	overflow: hidden;
	position: relative;
}

.preview-bg {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
}

.preview-content {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding: 40rpx;
}

.preview-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #FFFFFF;
	margin-bottom: 40rpx;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.preview-data {
	display: flex;
	justify-content: space-around;
	width: 100%;
	margin-bottom: 40rpx;
}

.preview-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.preview-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #FFFFFF;
	margin-bottom: 10rpx;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.preview-label {
	font-size: 24rpx;
	color: #FFFFFF;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.preview-slogan {
	font-size: 28rpx;
	color: #FFFFFF;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.share-btn {
	height: 90rpx;
	background: linear-gradient(135deg, #6E7FF3, #9D6EF3);
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.share-btn text {
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
}

.message-panel, .challenge-panel {
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

.message-to, .challenge-to {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 20rpx;
}

.message-templates {
	margin-bottom: 20rpx;
}

.message-template {
	padding: 20rpx;
	background-color: #F5F5F5;
	border-radius: 16rpx;
	margin-bottom: 10rpx;
}

.message-template text {
	font-size: 28rpx;
	color: #333;
}

.message-template.selected {
	background-color: rgba(138, 110, 243, 0.1);
	border: 1rpx solid #8A6EF3;
}

.message-input {
	width: 100%;
	height: 200rpx;
	background-color: #F5F5F5;
	border-radius: 16rpx;
	padding: 20rpx;
	font-size: 28rpx;
	margin-bottom: 30rpx;
}

.send-btn {
	height: 90rpx;
	background: linear-gradient(135deg, #6E7FF3, #9D6EF3);
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.send-btn text {
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
}

.challenge-type {
	margin-bottom: 30rpx;
}

.input-label {
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

.challenge-duration, .challenge-goal {
	margin-bottom: 30rpx;
}

.duration-unit, .goal-unit {
	font-size: 24rpx;
	color: #666;
	margin-top: 10rpx;
	display: block;
}
</style>
