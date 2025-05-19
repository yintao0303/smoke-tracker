export default {
  // 格式化日期
  formatDate(date) {
    if (!date) return '';
    if (typeof date === 'string') {
      date = new Date(date);
    }
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  },
  
  // 格式化时间
  formatTime(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  },
  
  // 格式化相对时间
  formatRelativeTime(timestamp) {
    if (!timestamp) return '';
    
    const now = new Date();
    const date = new Date(timestamp);
    const diff = Math.floor((now - date) / 1000); // 秒数差
    
    if (diff < 60) {
      return '刚刚';
    } else if (diff < 3600) {
      return Math.floor(diff / 60) + '分钟前';
    } else if (diff < 86400) {
      return Math.floor(diff / 3600) + '小时前';
    } else if (diff < 604800) {
      return Math.floor(diff / 86400) + '天前';
    } else {
      return this.formatDate(date);
    }
  },
  
  // 生成唯一ID
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  // 计算健康指数
  calculateHealthIndex(records, dailyGoal) {
    if (!records || records.length === 0) return 85; // 默认值
    
    // 基础分数
    let baseScore = 85;
    
    // 根据记录数量与目标的比例调整分数
    const totalCount = records.reduce((sum, record) => sum + record.quantity, 0);
    const ratio = totalCount / dailyGoal;
    
    if (ratio <= 0.5) {
      // 低于目标一半，加分
      baseScore += 15;
    } else if (ratio <= 0.8) {
      // 低于目标80%，加分
      baseScore += 10;
    } else if (ratio <= 1) {
      // 低于或等于目标，加分
      baseScore += 5;
    } else if (ratio <= 1.2) {
      // 超出目标20%以内，减分
      baseScore -= 5;
    } else if (ratio <= 1.5) {
      // 超出目标50%以内，减分
      baseScore -= 10;
    } else {
      // 超出目标50%以上，减分
      baseScore -= 20;
    }
    
    // 确保分数在0-100之间
    return Math.max(0, Math.min(100, baseScore));
  },
  
  // 计算节省金额
  calculateSavedMoney(reducedCount, pricePerCigarette = 0.5) {
    if (!reducedCount || reducedCount <= 0) return 0;
    
    return (reducedCount * pricePerCigarette).toFixed(2);
  },
  
  // 获取颜色等级
  getLevelColor(count) {
    if (count < 5) {
      return 'green';
    } else if (count <= 10) {
      return 'orange';
    } else {
      return 'red';
    }
  },
  
  // 检查是否需要显示高危预警
  checkHighRiskWarning(records, days = 3) {
    if (!records || records.length < days) return false;
    
    // 检查最近几天的记录是否连续增长
    let isIncreasing = true;
    
    for (let i = 1; i < days; i++) {
      if (records[i].count <= records[i-1].count) {
        isIncreasing = false;
        break;
      }
    }
    
    return isIncreasing;
  },
  
  // 深拷贝对象
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj);
    }
    
    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item));
    }
    
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = this.deepClone(obj[key]);
      }
    }
    
    return clonedObj;
  },
  
  // 防抖函数
  debounce(func, wait = 300) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  },
  
  // 节流函数
  throttle(func, wait = 300) {
    let lastTime = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastTime >= wait) {
        func.apply(this, args);
        lastTime = now;
      }
    };
  }
}
