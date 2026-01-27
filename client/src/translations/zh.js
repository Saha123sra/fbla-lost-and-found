// Mandarin Chinese translations
export default {
  // Navigation
  nav: {
    home: "首页",
    browse: "浏览物品",
    reportFound: "报告找到物品",
    lostItem: "丢失物品",
    myClaims: "我的认领",
    myRequests: "我的请求",
    faq: "常见问题",
    admin: "管理员",
    owner: "所有者",
    login: "登录",
    signUp: "注册",
    logout: "退出"
  },

  // Home page
  home: {
    hero: {
      title: "丢失了东西？",
      tagline: "我们会帮助您找到它。",
      subtitle: "我们的智能平台帮助丹麦高中的学生找回丢失的物品。找到东西了？报告它。丢失东西了？搜索它。我们在这里互相帮助。",
      browseCta: "浏览找到的物品",
      reportCta: "报告找到的物品"
    },
    stats: {
      itemsFound: "找到的物品",
      itemsReturned: "归还的物品",
      activeUsers: "活跃用户"
    },
    howItWorks: {
      title: "如何使用",
      step1Title: "报告或搜索",
      step1Desc: "找到东西了？报告它。丢失东西了？搜索我们的数据库或预先登记您的物品。",
      step2Title: "匹配",
      step2Desc: "我们的系统会自动将找到的物品与丢失物品请求进行匹配，并通知您。",
      step3Title: "认领并取回",
      step3Desc: "验证所有权，获得批准，然后从主办公室取回您的物品。"
    }
  },

  // Browse page
  browse: {
    title: "找到的物品",
    subtitle: "浏览在丹麦高中找到的物品",
    search: "搜索物品...",
    filter: {
      all: "所有类别",
      category: "类别",
      location: "位置",
      date: "发现日期",
      duration: "时间范围",
      anyTime: "任何时间",
      lastWeek: "上周",
      last2Weeks: "过去两周",
      lastMonth: "上个月",
      olderThanMonth: "超过一个月",
      priority: "优先级",
      anyPriority: "任何优先级",
      highPriority: "高优先级",
      lowPriority: "低优先级",
      availability: "可用性",
      availableOnly: "仅显示可用",
      available: "可用",
      pendingClaim: "待认领",
      claimed: "已认领",
      allItems: "所有物品"
    },
    noItems: "未找到物品",
    claim: "认领",
    viewDetails: "查看详情"
  },

  // Report page
  report: {
    title: "报告找到的物品",
    subtitle: "帮助丢失物品的主人找回它",
    form: {
      photo: "物品照片（可选）",
      photoHelp: "上传照片帮助主人识别物品",
      name: "物品名称",
      namePlaceholder: "例如：蓝色耐克背包、iPhone 14、TI-84计算器",
      category: "类别",
      selectCategory: "选择类别...",
      location: "发现地点",
      selectLocation: "选择地点...",
      specificLocation: "具体位置",
      specificLocationPlaceholder: "例如：204室附近、饮水机旁边",
      dateFound: "发现日期",
      description: "描述",
      descriptionPlaceholder: "详细描述物品：颜色、尺寸、品牌、独特特征...",
      submit: "提交找到的物品"
    },
    success: {
      title: "物品报告成功！",
      message: "感谢您帮助其他同学！物品已添加到我们的数据库。",
      reference: "参考编号",
      reportAnother: "报告另一个",
      viewItems: "查看物品"
    }
  },

  // Request page (Lost Item)
  request: {
    title: "预登记丢失物品",
    subtitle: "当您的物品被找到时获得通知",
    howItWorks: "如何使用：",
    howItWorksDesc: "描述您丢失的物品。如果有人报告了匹配的物品，您将收到电子邮件通知。这有助于更快地找回您的物品！",
    form: {
      name: "物品名称",
      namePlaceholder: "例如：蓝色北面夹克",
      description: "描述",
      descriptionPlaceholder: "详细描述您的物品：\n- 尺寸、颜色、品牌\n- 独特标记、贴纸或损坏\n- 内容（如适用）\n- 任何识别特征",
      descriptionMin: "最少字符数",
      photo: "物品照片（可选）",
      photoHelp: "上传您丢失物品的照片。这有助于我们系统在找到时更准确地匹配。",
      category: "类别",
      location: "最后看到的位置",
      dateLost: "丢失日期",
      submit: "提交请求"
    },
    success: {
      title: "请求已提交！",
      message: "我们已记录您丢失的物品。如果找到匹配的物品，您将自动收到通知。",
      viewRequests: "查看我的请求",
      browseItems: "浏览物品"
    }
  },

  // Claims
  claims: {
    title: "我的认领",
    noClaims: "您还没有提交任何认领",
    status: {
      pending: "待处理",
      approved: "已批准",
      denied: "已拒绝",
      cancelled: "已取消"
    },
    pickup: "取件详情",
    cancel: "取消认领"
  },

  // Common
  common: {
    loading: "加载中...",
    error: "出现问题",
    tryAgain: "重试",
    back: "返回",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    edit: "编辑",
    view: "查看",
    submit: "提交",
    required: "必填",
    optional: "可选",
    dragDrop: "拖放图片到这里",
    orClick: "或点击浏览",
    maxSize: "最大5MB",
    loginRequired: "需要登录",
    loginRequiredDesc: "请登录以访问此功能"
  },

  // Auth
  auth: {
    login: "登录",
    register: "注册",
    studentId: "学生ID",
    email: "电子邮箱",
    password: "密码",
    confirmPassword: "确认密码",
    firstName: "名字",
    lastName: "姓氏",
    gradeLevel: "年级",
    forgotPassword: "忘记密码？",
    noAccount: "没有账户？",
    hasAccount: "已有账户？",
    adminLogin: "管理员登录",
    ownerLogin: "所有者登录",
    adminCode: "6位管理员代码"
  },

  // Footer
  footer: {
    description: "丹麦高中官方失物招领系统。",
    quickLinks: "快速链接",
    contact: "联系方式",
    hours: "工作时间：上午7:30 - 下午4:00",
    copyright: "丹麦高中失物招领"
  },

  // Language names
  languages: {
    en: "英语",
    es: "西班牙语",
    hi: "印地语",
    fr: "法语",
    zh: "中文"
  }
};
