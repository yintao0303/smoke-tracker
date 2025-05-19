import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {
      avatar: '',
      nickname: '',
      healthIndex: 85
    },
    dailyGoal: 10,
    weeklyGoal: 60,
    goalType: '控制',
    todayRecords: [],
    todayCount: 0,
    weeklyProgress: 0,
    badges: [],
    healthMilestones: [],
    friends: [],
    interactions: []
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setGoals(state, { dailyGoal, weeklyGoal, goalType }) {
      state.dailyGoal = dailyGoal
      state.weeklyGoal = weeklyGoal
      state.goalType = goalType
    },
    setTodayRecords(state, records) {
      state.todayRecords = records
      state.todayCount = records.reduce((sum, record) => sum + record.quantity, 0)
    },
    addRecord(state, record) {
      state.todayRecords.push(record)
      state.todayCount += record.quantity
      state.weeklyProgress += record.quantity
    },
    updateRecord(state, { index, record }) {
      const oldQuantity = state.todayRecords[index].quantity
      state.todayRecords[index] = record
      state.todayCount = state.todayCount - oldQuantity + record.quantity
      state.weeklyProgress = state.weeklyProgress - oldQuantity + record.quantity
    },
    deleteRecord(state, index) {
      const oldQuantity = state.todayRecords[index].quantity
      state.todayRecords.splice(index, 1)
      state.todayCount -= oldQuantity
      state.weeklyProgress -= oldQuantity
    },
    setWeeklyProgress(state, progress) {
      state.weeklyProgress = progress
    },
    setBadges(state, badges) {
      state.badges = badges
    },
    unlockBadge(state, badge) {
      const index = state.badges.findIndex(b => b.name === badge.name)
      if (index !== -1) {
        state.badges[index].unlocked = true
        state.badges[index].unlockedDate = new Date().toISOString().split('T')[0]
      } else {
        state.badges.push({
          ...badge,
          unlocked: true,
          unlockedDate: new Date().toISOString().split('T')[0]
        })
      }
    },
    setHealthMilestones(state, milestones) {
      state.healthMilestones = milestones
    },
    updateHealthMilestone(state, { index, milestone }) {
      state.healthMilestones[index] = milestone
    },
    setFriends(state, friends) {
      state.friends = friends
    },
    updateFriend(state, { index, friend }) {
      state.friends[index] = friend
    },
    setInteractions(state, interactions) {
      state.interactions = interactions
    },
    addInteraction(state, interaction) {
      state.interactions.unshift(interaction)
    },
    removeInteraction(state, id) {
      const index = state.interactions.findIndex(i => i.id === id)
      if (index !== -1) {
        state.interactions.splice(index, 1)
      }
    }
  },
  actions: {
    // 初始化用户数据
    initUserData({ commit }) {
      // 从本地存储获取用户信息
      const userInfoStr = uni.getStorageSync('userInfo')
      if (userInfoStr) {
        commit('setUserInfo', JSON.parse(userInfoStr))
      }
      
      // 获取用户目标设置
      const dailyGoal = uni.getStorageSync('dailyGoal')
      const weeklyGoal = uni.getStorageSync('weeklyGoal')
      const goalType = uni.getStorageSync('goalType')
      
      if (dailyGoal && weeklyGoal && goalType) {
        commit('setGoals', {
          dailyGoal: parseInt(dailyGoal),
          weeklyGoal: parseInt(weeklyGoal),
          goalType
        })
      }
      
      // 获取今日记录
      const today = new Date().toISOString().split('T')[0]
      const recordsStr = uni.getStorageSync(`records_${today}`)
      if (recordsStr) {
        commit('setTodayRecords', JSON.parse(recordsStr))
      }
      
      // 获取本周进度
      this.dispatch('calculateWeeklyProgress')
      
      // 获取徽章状态
      this.dispatch('loadBadges')
      
      // 获取健康里程碑状态
      this.dispatch('loadHealthMilestones')
      
      // 获取好友列表
      this.dispatch('loadFriends')
      
      // 获取互动消息
      this.dispatch('loadInteractions')
    },
    
    // 保存记录
    saveRecord({ commit, state }, record) {
      // 添加记录到状态
      commit('addRecord', record)
      
      // 保存到本地存储
      const today = new Date().toISOString().split('T')[0]
      uni.setStorageSync(`records_${today}`, JSON.stringify(state.todayRecords))
      
      // 检查是否需要解锁徽章
      this.dispatch('checkBadges')
      
      // 检查是否需要更新健康里程碑
      this.dispatch('checkHealthMilestones')
      
      // 检查是否需要显示警告
      this.dispatch('checkWarnings')
    },
    
    // 更新记录
    updateRecord({ commit, state }, { index, record }) {
      // 更新状态中的记录
      commit('updateRecord', { index, record })
      
      // 保存到本地存储
      const today = new Date().toISOString().split('T')[0]
      uni.setStorageSync(`records_${today}`, JSON.stringify(state.todayRecords))
    },
    
    // 删除记录
    deleteRecord({ commit, state }, index) {
      // 从状态中删除记录
      commit('deleteRecord', index)
      
      // 保存到本地存储
      const today = new Date().toISOString().split('T')[0]
      uni.setStorageSync(`records_${today}`, JSON.stringify(state.todayRecords))
    },
    
    // 计算本周进度
    calculateWeeklyProgress({ commit }) {
      const today = new Date()
      const dayOfWeek = today.getDay()
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - dayOfWeek)
      
      let total = 0
      
      for (let i = 0; i <= dayOfWeek; i++) {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        const dateStr = date.toISOString().split('T')[0]
        const recordsStr = uni.getStorageSync(`records_${dateStr}`)
        
        if (recordsStr) {
          const records = JSON.parse(recordsStr)
          total += records.reduce((sum, record) => sum + record.quantity, 0)
        }
      }
      
      commit('setWeeklyProgress', total)
    },
    
    // 加载徽章状态
    loadBadges({ commit }) {
      // 从本地存储获取徽章状态
      const badgesStr = uni.getStorageSync('badges')
      if (badgesStr) {
        commit('setBadges', JSON.parse(badgesStr))
      } else {
        // 初始化默认徽章
        const defaultBadges = [
          {
            icon: '🌟',
            name: '初次记录',
            description: '完成第一次记录',
            condition: '完成第一次记录',
            unlocked: false,
            progress: '0/1'
          },
          {
            icon: '🔥',
            name: '三日连续',
            description: '连续三天记录',
            condition: '连续三天记录',
            unlocked: false,
            progress: '0/3'
          },
          {
            icon: '📊',
            name: '数据达人',
            description: '查看所有数据图表',
            condition: '查看所有数据图表',
            unlocked: false,
            progress: '0/4'
          },
          {
            icon: '📉',
            name: '首次减量',
            description: '单日消耗量首次低于目标值',
            condition: '单日消耗量首次低于目标值',
            unlocked: false,
            progress: '0/1'
          },
          {
            icon: '🌈',
            name: '七日坚持',
            description: '连续七天记录',
            condition: '连续七天记录',
            unlocked: false,
            progress: '0/7'
          },
          {
            icon: '🏆',
            name: '周减量王',
            description: '单周减量超过30%',
            condition: '单周减量超过30%',
            unlocked: false,
            progress: '0%/30%'
          },
          {
            icon: '🌙',
            name: '深夜守护者',
            description: '连续5天无夜间记录',
            condition: '连续5天无夜间记录',
            unlocked: false,
            progress: '0/5'
          },
          {
            icon: '🌱',
            name: '新生',
            description: '连续30天控制在目标以内',
            condition: '连续30天控制在目标以内',
            unlocked: false,
            progress: '0/30'
          },
          {
            icon: '💪',
            name: '意志力',
            description: '使用替代方案10次',
            condition: '使用替代方案10次',
            unlocked: false,
            progress: '0/10'
          }
        ]
        
        commit('setBadges', defaultBadges)
        uni.setStorageSync('badges', JSON.stringify(defaultBadges))
      }
    },
    
    // 检查徽章解锁条件
    checkBadges({ commit, state }) {
      // 检查"初次记录"徽章
      if (state.todayRecords.length > 0) {
        const firstRecordBadge = state.badges.find(b => b.name === '初次记录')
        if (firstRecordBadge && !firstRecordBadge.unlocked) {
          commit('unlockBadge', firstRecordBadge)
          
          // 显示徽章解锁提示
          uni.showToast({
            title: '解锁成就：初次记录',
            icon: 'success',
            duration: 2000
          })
        }
      }
      
      // 检查"首次减量"徽章
      if (state.todayCount < state.dailyGoal) {
        const firstReduceBadge = state.badges.find(b => b.name === '首次减量')
        if (firstReduceBadge && !firstReduceBadge.unlocked) {
          commit('unlockBadge', firstReduceBadge)
          
          // 显示徽章解锁提示
          uni.showToast({
            title: '解锁成就：首次减量',
            icon: 'success',
            duration: 2000
          })
        }
      }
      
      // 保存更新后的徽章状态
      uni.setStorageSync('badges', JSON.stringify(state.badges))
    },
    
    // 加载健康里程碑状态
    loadHealthMilestones({ commit }) {
      // 从本地存储获取健康里程碑状态
      const milestonesStr = uni.getStorageSync('healthMilestones')
      if (milestonesStr) {
        commit('setHealthMilestones', JSON.parse(milestonesStr))
      } else {
        // 初始化默认健康里程碑
        const defaultMilestones = [
          {
            time: '20分钟',
            title: '血压恢复正常',
            description: '血压和脉搏恢复到正常水平',
            reached: false,
            prediction: '开始记录后计算'
          },
          {
            time: '8小时',
            title: '一氧化碳水平下降',
            description: '血液中的一氧化碳水平下降到正常值',
            reached: false,
            prediction: '开始记录后计算'
          },
          {
            time: '24小时',
            title: '心脏病发作风险降低',
            description: '心脏病发作的风险开始降低',
            reached: false,
            prediction: '开始记录后计算'
          },
          {
            time: '48小时',
            title: '嗅觉和味觉增强',
            description: '嗅觉和味觉神经开始恢复',
            reached: false,
            prediction: '开始记录后计算'
          },
          {
            time: '72小时',
            title: '呼吸更顺畅',
            description: '支气管放松，呼吸更加顺畅',
            reached: false,
            prediction: '开始记录后计算'
          },
          {
            time: '2-12周',
            title: '循环改善',
            description: '全身循环改善，肺功能增加30%',
            reached: false,
            prediction: '开始记录后计算'
          },
          {
            time: '1-9个月',
            title: '咳嗽减少',
            description: '咳嗽和呼吸短促明显减少',
            reached: false,
            prediction: '开始记录后计算'
          },
          {
            time: '1年',
            title: '冠心病风险减半',
            description: '冠心病风险降低到吸烟者的一半',
            reached: false,
            prediction: '开始记录后计算'
          }
        ]
        
        commit('setHealthMilestones', defaultMilestones)
        uni.setStorageSync('healthMilestones', JSON.stringify(defaultMilestones))
      }
    },
    
    // 检查健康里程碑状态
    checkHealthMilestones({ commit, state }) {
      // 根据记录情况更新健康里程碑状态
      // 实际应用中应该根据用户的记录历史和减量趋势来计算
      // 这里使用简化的逻辑
      
      // 保存更新后的健康里程碑状态
      uni.setStorageSync('healthMilestones', JSON.stringify(state.healthMilestones))
    },
    
    // 检查是否需要显示警告
    checkWarnings({ state }) {
      // 检查单日超过20支的情况
      if (state.todayCount > 20) {
        // 显示数据异常警告
        setTimeout(() => {
          uni.showModal({
            title: '健康提醒',
            content: '今日记录已超过20支，请注意控制，关爱健康。',
            confirmText: '我会注意',
            showCancel: false
          })
        }, 500)
      }
      
      // 检查连续3日增长的情况
      // 实际应用中应该查询历史记录进行判断
      // 这里使用简化的逻辑
    },
    
    // 加载好友列表
    loadFriends({ commit }) {
      // 从本地存储获取好友列表
      const friendsStr = uni.getStorageSync('friends')
      if (friendsStr) {
        commit('setFriends', JSON.parse(friendsStr))
      } else {
        // 初始化默认好友列表
        const defaultFriends = [
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
        ]
        
        commit('setFriends', defaultFriends)
        uni.setStorageSync('friends', JSON.stringify(defaultFriends))
      }
    },
    
    // 加载互动消息
    loadInteractions({ commit }) {
      // 从本地存储获取互动消息
      const interactionsStr = uni.getStorageSync('interactions')
      if (interactionsStr) {
        commit('setInteractions', JSON.parse(interactionsStr))
      } else {
        // 初始化默认互动消息
        const defaultInteractions = [
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
        ]
        
        commit('setInteractions', defaultInteractions)
        uni.setStorageSync('interactions', JSON.stringify(defaultInteractions))
      }
    }
  }
})

export default store
