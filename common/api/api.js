// API接口封装
const baseURL = 'https://api.example.com'; // 实际应用中替换为真实API地址

// 请求封装
const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    // 获取token
    const token = uni.getStorageSync('token');
    
    uni.request({
      url: baseURL + url,
      method,
      data,
      header: {
        'content-type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        // 模拟API响应
        // 实际应用中应该根据后端API的响应格式进行处理
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

// 模拟API接口
const mockAPI = {
  // 用户相关
  login(data) {
    // 模拟登录
    return Promise.resolve({
      code: 0,
      message: '登录成功',
      data: {
        token: 'mock_token_' + Date.now(),
        userInfo: {
          id: 'user_' + Date.now(),
          nickname: data.nickname || '用户' + Math.floor(Math.random() * 10000),
          avatar: data.avatar || '/static/images/default-avatar.png',
          healthIndex: 85
        }
      }
    });
  },
  
  // 记录相关
  saveRecord(data) {
    // 模拟保存记录
    return Promise.resolve({
      code: 0,
      message: '保存成功',
      data: {
        id: 'record_' + Date.now(),
        ...data,
        createdAt: Date.now()
      }
    });
  },
  
  getRecords(date) {
    // 模拟获取记录
    // 实际应用中应该从服务器获取
    const recordsStr = uni.getStorageSync(`records_${date}`);
    let records = [];
    
    if (recordsStr) {
      records = JSON.parse(recordsStr);
    }
    
    return Promise.resolve({
      code: 0,
      message: '获取成功',
      data: records
    });
  },
  
  // 目标相关
  saveGoals(data) {
    // 模拟保存目标
    return Promise.resolve({
      code: 0,
      message: '保存成功',
      data
    });
  },
  
  // 徽章相关
  getBadges() {
    // 模拟获取徽章
    const badgesStr = uni.getStorageSync('badges');
    let badges = [];
    
    if (badgesStr) {
      badges = JSON.parse(badgesStr);
    }
    
    return Promise.resolve({
      code: 0,
      message: '获取成功',
      data: badges
    });
  },
  
  // 健康里程碑相关
  getHealthMilestones() {
    // 模拟获取健康里程碑
    const milestonesStr = uni.getStorageSync('healthMilestones');
    let milestones = [];
    
    if (milestonesStr) {
      milestones = JSON.parse(milestonesStr);
    }
    
    return Promise.resolve({
      code: 0,
      message: '获取成功',
      data: milestones
    });
  },
  
  // 社交相关
  getFriends() {
    // 模拟获取好友列表
    const friendsStr = uni.getStorageSync('friends');
    let friends = [];
    
    if (friendsStr) {
      friends = JSON.parse(friendsStr);
    }
    
    return Promise.resolve({
      code: 0,
      message: '获取成功',
      data: friends
    });
  },
  
  getInteractions() {
    // 模拟获取互动消息
    const interactionsStr = uni.getStorageSync('interactions');
    let interactions = [];
    
    if (interactionsStr) {
      interactions = JSON.parse(interactionsStr);
    }
    
    return Promise.resolve({
      code: 0,
      message: '获取成功',
      data: interactions
    });
  },
  
  likeFriend(friendId, isLike) {
    // 模拟点赞好友
    return Promise.resolve({
      code: 0,
      message: isLike ? '点赞成功' : '取消点赞成功',
      data: {
        friendId,
        isLike
      }
    });
  },
  
  sendEncouragement(friendId, message) {
    // 模拟发送鼓励
    return Promise.resolve({
      code: 0,
      message: '发送成功',
      data: {
        id: 'encourage_' + Date.now(),
        friendId,
        message,
        createdAt: Date.now()
      }
    });
  },
  
  sendChallenge(data) {
    // 模拟发起挑战
    return Promise.resolve({
      code: 0,
      message: '发起成功',
      data: {
        id: 'challenge_' + Date.now(),
        ...data,
        createdAt: Date.now()
      }
    });
  },
  
  respondChallenge(challengeId, accept) {
    // 模拟响应挑战
    return Promise.resolve({
      code: 0,
      message: accept ? '已接受挑战' : '已婉拒挑战',
      data: {
        challengeId,
        accept
      }
    });
  }
};

// 导出API接口
export default {
  // 用户相关
  login(data) {
    // return request('/user/login', 'POST', data);
    return mockAPI.login(data);
  },
  
  // 记录相关
  saveRecord(data) {
    // return request('/record/save', 'POST', data);
    return mockAPI.saveRecord(data);
  },
  
  getRecords(date) {
    // return request(`/record/list?date=${date}`, 'GET');
    return mockAPI.getRecords(date);
  },
  
  // 目标相关
  saveGoals(data) {
    // return request('/user/goals', 'POST', data);
    return mockAPI.saveGoals(data);
  },
  
  // 徽章相关
  getBadges() {
    // return request('/user/badges', 'GET');
    return mockAPI.getBadges();
  },
  
  // 健康里程碑相关
  getHealthMilestones() {
    // return request('/user/health-milestones', 'GET');
    return mockAPI.getHealthMilestones();
  },
  
  // 社交相关
  getFriends() {
    // return request('/social/friends', 'GET');
    return mockAPI.getFriends();
  },
  
  getInteractions() {
    // return request('/social/interactions', 'GET');
    return mockAPI.getInteractions();
  },
  
  likeFriend(friendId, isLike) {
    // return request('/social/like', 'POST', { friendId, isLike });
    return mockAPI.likeFriend(friendId, isLike);
  },
  
  sendEncouragement(friendId, message) {
    // return request('/social/encourage', 'POST', { friendId, message });
    return mockAPI.sendEncouragement(friendId, message);
  },
  
  sendChallenge(data) {
    // return request('/social/challenge', 'POST', data);
    return mockAPI.sendChallenge(data);
  },
  
  respondChallenge(challengeId, accept) {
    // return request('/social/respond-challenge', 'POST', { challengeId, accept });
    return mockAPI.respondChallenge(challengeId, accept);
  }
}
