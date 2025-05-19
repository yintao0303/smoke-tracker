export default {
  // 基础配置
  baseConfig: {
    appName: '戒烟助手',
    version: '1.0.0',
    defaultAvatar: '/static/images/default-avatar.png',
    cigarettePrice: 0.5, // 单支烟价格，用于计算节省金额
  },
  
  // 颜色配置
  colors: {
    primary: '#8A6EF3',
    primaryGradient: 'linear-gradient(135deg, #6E7FF3, #9D6EF3)',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
    info: '#2196F3',
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: {
      primary: '#333333',
      secondary: '#666666',
      hint: '#999999',
      white: '#FFFFFF'
    }
  },
  
  // 存储键名
  storageKeys: {
    token: 'token',
    userInfo: 'userInfo',
    dailyGoal: 'dailyGoal',
    weeklyGoal: 'weeklyGoal',
    goalType: 'goalType',
    hasUsed: 'hasUsed',
    recordsPrefix: 'records_',
    badges: 'badges',
    healthMilestones: 'healthMilestones',
    friends: 'friends',
    interactions: 'interactions'
  },
  
  // 默认目标设置
  defaultGoals: {
    daily: 10,
    weekly: 60,
    type: '控制'
  },
  
  // 心情选项
  moods: [
    { emoji: '😀', text: '很好' },
    { emoji: '🙂', text: '好' },
    { emoji: '😐', text: '一般' },
    { emoji: '😕', text: '不好' },
    { emoji: '😞', text: '很差' }
  ],
  
  // 场景选项
  scenes: ['工作压力', '社交活动', '饭后', '休息时间', '其他'],
  
  // 特殊状态阈值
  thresholds: {
    dailyWarning: 20, // 单日超过多少支显示警告
    continuousIncreaseDays: 3, // 连续增长多少天显示高危预警
    healthLevels: {
      low: 5, // 低于5支为绿色
      medium: 10 // 5-10支为橙色，超过10支为红色
    }
  },
  
  // 徽章解锁条件
  badgeConditions: {
    firstRecord: {
      name: '初次记录',
      condition: '完成第一次记录'
    },
    threeDayStreak: {
      name: '三日连续',
      condition: '连续三天记录',
      requiredDays: 3
    },
    dataExpert: {
      name: '数据达人',
      condition: '查看所有数据图表',
      requiredViews: 4
    },
    firstReduction: {
      name: '首次减量',
      condition: '单日消耗量首次低于目标值'
    },
    sevenDayStreak: {
      name: '七日坚持',
      condition: '连续七天记录',
      requiredDays: 7
    },
    weeklyReduction: {
      name: '周减量王',
      condition: '单周减量超过30%',
      requiredPercentage: 30
    },
    nightGuardian: {
      name: '深夜守护者',
      condition: '连续5天无夜间记录',
      requiredDays: 5
    },
    newLife: {
      name: '新生',
      condition: '连续30天控制在目标以内',
      requiredDays: 30
    },
    willpower: {
      name: '意志力',
      condition: '使用替代方案10次',
      requiredCount: 10
    }
  },
  
  // 健康里程碑
  healthMilestones: [
    {
      time: '20分钟',
      title: '血压恢复正常',
      description: '血压和脉搏恢复到正常水平'
    },
    {
      time: '8小时',
      title: '一氧化碳水平下降',
      description: '血液中的一氧化碳水平下降到正常值'
    },
    {
      time: '24小时',
      title: '心脏病发作风险降低',
      description: '心脏病发作的风险开始降低'
    },
    {
      time: '48小时',
      title: '嗅觉和味觉增强',
      description: '嗅觉和味觉神经开始恢复'
    },
    {
      time: '72小时',
      title: '呼吸更顺畅',
      description: '支气管放松，呼吸更加顺畅'
    },
    {
      time: '2-12周',
      title: '循环改善',
      description: '全身循环改善，肺功能增加30%'
    },
    {
      time: '1-9个月',
      title: '咳嗽减少',
      description: '咳嗽和呼吸短促明显减少'
    },
    {
      time: '1年',
      title: '冠心病风险减半',
      description: '冠心病风险降低到吸烟者的一半'
    }
  ],
  
  // 紧急替代方案
  emergencyTips: [
    '深呼吸：慢慢吸气5秒，屏住2秒，慢慢呼气7秒，重复3次',
    '喝一杯水：缓慢喝一整杯水，感受水流过喉咙',
    '短暂散步：离开当前环境，散步5分钟',
    '嚼口香糖或吃薄荷糖',
    '双手活动：玩指尖陀螺或捏压力球'
  ],
  
  // 鼓励消息
  encourageMessages: [
    '加油！你已经做得很棒了！',
    '坚持就是胜利，继续加油！',
    '每一天都是新的开始，你可以的！',
    '看到你的进步，真为你感到骄傲！',
    '健康生活，从现在开始！'
  ]
}
