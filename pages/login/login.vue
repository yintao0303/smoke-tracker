<template>
	<view class="container">
		<view class="login-form">
			<view class="logo-container">
				<image class="logo" src="/static/images/logo.png" mode="aspectFit"></image>
				<text class="app-name">戒烟助手</text>
				<text class="app-slogan">每一天，都是新的开始</text>
			</view>
			
			<view class="login-options">
				<view class="login-title">
					<text>登录 / 注册</text>
				</view>
				
				<view class="platform-login">
					<view class="platform-btn wechat" @click="loginWithPlatform('wechat')">
						<text class="platform-icon">微信</text>
						<text class="platform-text">微信一键登录</text>
					</view>
					
					<view class="platform-btn alipay" @click="loginWithPlatform('alipay')">
						<text class="platform-icon">支付宝</text>
						<text class="platform-text">支付宝一键登录</text>
					</view>
					
					<view class="platform-btn douyin" @click="loginWithPlatform('douyin')">
						<text class="platform-icon">抖音</text>
						<text class="platform-text">抖音一键登录</text>
					</view>
				</view>
				
				<view class="divider">
					<text>或</text>
				</view>
				
				<view class="phone-login">
					<view class="input-group">
						<text class="input-label">手机号</text>
						<input type="number" v-model="phone" placeholder="请输入手机号" maxlength="11" />
					</view>
					
					<view class="input-group code-group">
						<text class="input-label">验证码</text>
						<input type="number" v-model="code" placeholder="请输入验证码" maxlength="6" />
						<view class="code-btn" @click="getVerificationCode">
							<text>{{codeText}}</text>
						</view>
					</view>
					
					<view class="login-btn" @click="loginWithPhone">
						<text>登录 / 注册</text>
					</view>
				</view>
				
				<view class="agreement">
					<checkbox :checked="agreed" @click="toggleAgreement" />
					<text class="agreement-text">登录即表示同意<text class="link">《用户协议》</text>和<text class="link">《隐私政策》</text></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			phone: '',
			code: '',
			codeText: '获取验证码',
			countdown: 60,
			timer: null,
			agreed: true
		}
	},
	methods: {
		loginWithPlatform(platform) {
			if (!this.agreed) {
				this.showAgreementTip();
				return;
			}
			
			// 根据不同平台调用不同的登录API
			switch(platform) {
				case 'wechat':
					// 微信登录
					uni.showLoading({
						title: '登录中...'
					});
					
					// 模拟登录过程
					setTimeout(() => {
						uni.hideLoading();
						this.loginSuccess();
					}, 1500);
					break;
				case 'alipay':
					// 支付宝登录
					uni.showLoading({
						title: '登录中...'
					});
					
					// 模拟登录过程
					setTimeout(() => {
						uni.hideLoading();
						this.loginSuccess();
					}, 1500);
					break;
				case 'douyin':
					// 抖音登录
					uni.showLoading({
						title: '登录中...'
					});
					
					// 模拟登录过程
					setTimeout(() => {
						uni.hideLoading();
						this.loginSuccess();
					}, 1500);
					break;
			}
		},
		getVerificationCode() {
			if (!this.phone) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				});
				return;
			}
			
			if (!/^1\d{10}$/.test(this.phone)) {
				uni.showToast({
					title: '手机号格式不正确',
					icon: 'none'
				});
				return;
			}
			
			if (this.timer) {
				return;
			}
			
			// 发送验证码
			uni.showLoading({
				title: '发送中...'
			});
			
			// 模拟发送过程
			setTimeout(() => {
				uni.hideLoading();
				
				uni.showToast({
					title: '验证码已发送',
					icon: 'success'
				});
				
				// 开始倒计时
				this.startCountdown();
			}, 1000);
		},
		startCountdown() {
			this.countdown = 60;
			this.codeText = `${this.countdown}s后重新获取`;
			
			this.timer = setInterval(() => {
				this.countdown--;
				this.codeText = `${this.countdown}s后重新获取`;
				
				if (this.countdown <= 0) {
					clearInterval(this.timer);
					this.timer = null;
					this.codeText = '获取验证码';
				}
			}, 1000);
		},
		loginWithPhone() {
			if (!this.agreed) {
				this.showAgreementTip();
				return;
			}
			
			if (!this.phone) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				});
				return;
			}
			
			if (!/^1\d{10}$/.test(this.phone)) {
				uni.showToast({
					title: '手机号格式不正确',
					icon: 'none'
				});
				return;
			}
			
			if (!this.code) {
				uni.showToast({
					title: '请输入验证码',
					icon: 'none'
				});
				return;
			}
			
			// 登录
			uni.showLoading({
				title: '登录中...'
			});
			
			// 模拟登录过程
			setTimeout(() => {
				uni.hideLoading();
				this.loginSuccess();
			}, 1500);
		},
		toggleAgreement() {
			this.agreed = !this.agreed;
		},
		showAgreementTip() {
			uni.showToast({
				title: '请先同意用户协议和隐私政策',
				icon: 'none'
			});
		},
		loginSuccess() {
			// 保存登录状态
			uni.setStorageSync('token', 'mock_token');
			uni.setStorageSync('userInfo', JSON.stringify({
				avatar: '/static/images/default-avatar.png',
				nickname: '用户' + Math.floor(Math.random() * 10000)
			}));
			
			// 跳转到首次使用引导页或主页
			const isFirstUse = !uni.getStorageSync('hasUsed');
			
			if (isFirstUse) {
				uni.redirectTo({
					url: '/pages/onboarding/onboarding'
				});
			} else {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		}
	},
	onUnload() {
		// 清除定时器
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
}
</script>

<style>
.container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background: linear-gradient(135deg, #6E7FF3, #9D6EF3);
	padding: 40rpx;
}

.login-form {
	background-color: #fff;
	border-radius: 30rpx;
	padding: 40rpx;
	box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.1);
	margin-top: 60rpx;
}

.logo-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 60rpx;
}

.logo {
	width: 150rpx;
	height: 150rpx;
	margin-bottom: 20rpx;
}

.app-name {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.app-slogan {
	font-size: 28rpx;
	color: #666;
}

.login-title {
	margin-bottom: 30rpx;
}

.login-title text {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.platform-login {
	margin-bottom: 30rpx;
}

.platform-btn {
	height: 90rpx;
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
}

.platform-icon {
	font-size: 28rpx;
	margin-right: 10rpx;
}

.platform-text {
	font-size: 28rpx;
}

.wechat {
	background-color: #07C160;
}

.wechat text {
	color: #fff;
}

.alipay {
	background-color: #1677FF;
}

.alipay text {
	color: #fff;
}

.douyin {
	background-color: #000000;
}

.douyin text {
	color: #fff;
}

.divider {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 30rpx 0;
	position: relative;
}

.divider::before, .divider::after {
	content: '';
	position: absolute;
	top: 50%;
	width: 40%;
	height: 1rpx;
	background-color: #e0e0e0;
}

.divider::before {
	left: 0;
}

.divider::after {
	right: 0;
}

.divider text {
	font-size: 28rpx;
	color: #999;
	background-color: #fff;
	padding: 0 20rpx;
	z-index: 1;
}

.phone-login {
	margin-bottom: 30rpx;
}

.input-group {
	margin-bottom: 20rpx;
}

.input-label {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
	display: block;
}

.input-group input {
	width: 100%;
	height: 90rpx;
	background-color: #f5f5f5;
	border-radius: 45rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
}

.code-group {
	position: relative;
}

.code-btn {
	position: absolute;
	right: 20rpx;
	top: 50%;
	transform: translateY(-50%);
	padding: 10rpx 20rpx;
	border-left: 1rpx solid #e0e0e0;
}

.code-btn text {
	font-size: 24rpx;
	color: #8A6EF3;
}

.login-btn {
	height: 90rpx;
	background: linear-gradient(135deg, #6E7FF3, #9D6EF3);
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 30rpx;
}

.login-btn text {
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
}

.agreement {
	display: flex;
	align-items: center;
}

.agreement-text {
	font-size: 24rpx;
	color: #666;
	margin-left: 10rpx;
}

.link {
	color: #8A6EF3;
}
</style>
