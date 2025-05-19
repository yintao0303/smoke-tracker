<template>
	<view class="container">
		<view class="popup-content">
			<view class="popup-header" v-if="showHeader">
				<text class="popup-title">{{title}}</text>
				<text v-if="showClose" class="close" @click="close">×</text>
			</view>
			
			<view class="popup-body">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'uni-popup',
	props: {
		// 弹出层类型
		type: {
			type: String,
			default: 'center'
		},
		// 是否显示标题
		showHeader: {
			type: Boolean,
			default: false
		},
		// 标题
		title: {
			type: String,
			default: ''
		},
		// 是否显示关闭按钮
		showClose: {
			type: Boolean,
			default: true
		},
		// 是否点击遮罩关闭
		maskClick: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			isShow: false,
			ani: {
				in: '',
				out: ''
			},
			showTrans: false
		}
	},
	created() {
		// 设置动画类型
		this.setAni();
	},
	methods: {
		setAni() {
			// 根据弹出方向设置动画
			switch(this.type) {
				case 'top':
					this.ani.in = 'slide-top-in';
					this.ani.out = 'slide-top-out';
					break;
				case 'bottom':
					this.ani.in = 'slide-bottom-in';
					this.ani.out = 'slide-bottom-out';
					break;
				case 'left':
					this.ani.in = 'slide-left-in';
					this.ani.out = 'slide-left-out';
					break;
				case 'right':
					this.ani.in = 'slide-right-in';
					this.ani.out = 'slide-right-out';
					break;
				default:
					this.ani.in = 'fade-in';
					this.ani.out = 'fade-out';
					break;
			}
		},
		// 打开弹窗
		open() {
			this.isShow = true;
			this.showTrans = true;
			this.$nextTick(() => {
				setTimeout(() => {
					this.showTrans = false;
				}, 300);
			});
		},
		// 关闭弹窗
		close() {
			this.showTrans = true;
			this.$nextTick(() => {
				setTimeout(() => {
					this.isShow = false;
					this.showTrans = false;
					this.$emit('close');
				}, 300);
			});
		},
		// 点击遮罩关闭
		onMaskClick() {
			if (this.maskClick) {
				this.close();
			}
		}
	}
}
</script>

<style>
.container {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 999;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
}

.popup-content {
	background-color: #fff;
	border-radius: 16rpx;
	overflow: hidden;
	max-height: 80vh;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.close {
	font-size: 48rpx;
	color: #999;
	line-height: 1;
}

.popup-body {
	padding: 30rpx;
}

/* 动画样式 */
@keyframes fade-in {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

@keyframes fade-out {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}

@keyframes slide-top-in {
	0% {
		transform: translateY(-100%);
	}
	100% {
		transform: translateY(0);
	}
}

@keyframes slide-top-out {
	0% {
		transform: translateY(0);
	}
	100% {
		transform: translateY(-100%);
	}
}

@keyframes slide-bottom-in {
	0% {
		transform: translateY(100%);
	}
	100% {
		transform: translateY(0);
	}
}

@keyframes slide-bottom-out {
	0% {
		transform: translateY(0);
	}
	100% {
		transform: translateY(100%);
	}
}

@keyframes slide-left-in {
	0% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(0);
	}
}

@keyframes slide-left-out {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(-100%);
	}
}

@keyframes slide-right-in {
	0% {
		transform: translateX(100%);
	}
	100% {
		transform: translateX(0);
	}
}

@keyframes slide-right-out {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(100%);
	}
}

.fade-in {
	animation: fade-in 0.3s ease-in-out;
}

.fade-out {
	animation: fade-out 0.3s ease-in-out;
}

.slide-top-in {
	animation: slide-top-in 0.3s ease-in-out;
}

.slide-top-out {
	animation: slide-top-out 0.3s ease-in-out;
}

.slide-bottom-in {
	animation: slide-bottom-in 0.3s ease-in-out;
}

.slide-bottom-out {
	animation: slide-bottom-out 0.3s ease-in-out;
}

.slide-left-in {
	animation: slide-left-in 0.3s ease-in-out;
}

.slide-left-out {
	animation: slide-left-out 0.3s ease-in-out;
}

.slide-right-in {
	animation: slide-right-in 0.3s ease-in-out;
}

.slide-right-out {
	animation: slide-right-out 0.3s ease-in-out;
}
</style>
