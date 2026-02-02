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
      activeUsers: "活跃用户",
      returnRate: "归还率",
      avgReturnTime: "平均归还时间"
    },
    howItWorks: {
      title: "如何使用",
      subtitle: "我们简单的3步流程让找到丢失物品比以往更容易",
      step1Title: "报告或搜索",
      step1Desc: "找到东西了？报告它。丢失东西了？搜索我们的数据库或预先登记您的物品。",
      step2Title: "匹配",
      step2Desc: "我们的系统会自动将找到的物品与丢失物品请求进行匹配，并通知您。",
      step3Title: "认领并取回",
      step3Desc: "验证所有权，获得批准，然后从主办公室取回您的物品。"
    },
    testimonials: {
      title: "Danes的评价"
    },
    cta: {
      title: "找到东西了？",
      subtitle: "通过报告来帮助其他Dane。只需要一分钟！"
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
    viewDetails: "查看详情",
    tryAdjusting: "尝试调整您的搜索或筛选条件",
    clearFilters: "清除所有筛选",
    clearAll: "清除全部",
    uncategorized: "未分类",
    page: "第",
    of: "页，共"
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
    claimedOn: "认领于",
    reason: "原因",
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
    adminId: "管理员ID",
    email: "电子邮箱",
    password: "密码",
    confirmPassword: "确认密码",
    passwordPlaceholder: "至少6个字符",
    confirmPasswordPlaceholder: "再次输入您的密码",
    firstName: "名字",
    lastName: "姓氏",
    gradeLevel: "年级",
    forgotPassword: "忘记密码？",
    noAccount: "没有账户？",
    hasAccount: "已有账户？",
    adminLogin: "管理员登录",
    ownerLogin: "所有者登录",
    adminCode: "6位管理员代码",
    siteOwner: "站点所有者",
    studentLogin: "学生登录",
    enterPassword: "输入您的密码",
    enterAdminId: "输入您的管理员ID",
    enterStudentId: "输入您的学生ID",
    createAccount: "创建账户",
    registerAsAdmin: "注册成为管理员",
    select: "选择..."
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
  },

  // Admin Dashboard
  admin: {
    title: "管理员仪表板",
    stats: {
      activeItems: "活跃物品",
      pendingClaims: "待处理认领",
      returnedItems: "已归还物品",
      successRate: "成功率"
    },
    tabs: {
      overview: "概览",
      claims: "认领",
      items: "物品",
      students: "学生"
    },
    overview: {
      welcome: "欢迎，管理员！",
      pendingReview: "您有 {count} 个待审核的认领。",
      reviewClaims: "审核认领"
    },
    claims: {
      title: "待处理认领",
      noPending: "没有待处理的认领！一切都已处理完毕。",
      claimedBy: "认领人",
      studentId: "学生ID",
      proofOfOwnership: "所有权证明",
      approve: "批准",
      deny: "拒绝",
      approveClaim: "批准认领",
      denyClaim: "拒绝认领",
      pickupDate: "取件日期",
      pickupTime: "取件时间",
      pickupLocation: "取件地点",
      denialReason: "拒绝原因",
      denialPlaceholder: "证据不足，描述不符...",
      confirm: "确认",
      actionSuccess: "认领已{status}！",
      loadError: "加载认领失败",
      actionError: "操作失败"
    },
    students: {
      title: "学生目录",
      searchPlaceholder: "搜索学生...",
      noMatch: "没有学生与您的搜索匹配",
      noStudents: "目前还没有学生注册",
      loadingStudents: "正在加载学生...",
      loadError: "加载学生失败",
      columns: {
        name: "姓名",
        studentId: "学生ID",
        email: "邮箱",
        grade: "年级",
        claims: "认领",
        itemsReported: "报告的物品",
        joined: "加入时间"
      }
    },
    items: {
      comingSoon: "物品管理即将推出..."
    }
  },

  // Owner Dashboard
  owner: {
    title: "站点所有者仪表板",
    siteAdmin: "站点管理",
    adminId: "管理员ID",
    lastLogin: "上次登录",
    actions: "操作",
    never: "从未",
    stats: {
      pendingAdmins: "待审核管理员",
      activeAdmins: "活跃管理员"
    },
    tabs: {
      pendingAdmins: "待审核管理员",
      allAdmins: "所有管理员",
      settings: "设置"
    },
    pendingAdmins: {
      title: "待审核的管理员请求",
      noPending: "没有待审核的管理员请求",
      approve: "批准",
      deny: "拒绝",
      requestedOn: "请求时间"
    },
    allAdmins: {
      title: "所有管理员",
      active: "活跃",
      deactivated: "已停用",
      reactivate: "重新激活",
      deactivate: "停用",
      regenerateCode: "重新生成代码",
      noAdmins: "未找到管理员"
    },
    denyModal: {
      title: "拒绝管理员注册",
      denyingFor: "正在拒绝注册",
      reasonLabel: "原因",
      reasonPlaceholder: "输入拒绝原因...",
      denyButton: "拒绝注册"
    }
  },

  // Item Detail page
  itemDetail: {
    category: "类别",
    location: "位置",
    dateFound: "发现日期",
    reportedBy: "报告人",
    description: "描述",
    status: "状态",
    claimItem: "认领此物品",
    backToBrowse: "返回浏览",
    notFound: "未找到物品",
    alreadyClaimed: "此物品已被认领",
    pendingClaim: "此物品有待处理的认领"
  },

  // Claim form
  claimForm: {
    title: "认领此物品",
    subtitle: "请提供所有权证明",
    proofLabel: "描述您如何证明这是您的物品",
    proofPlaceholder: "描述只有物主才知道的独特特征、标记或内容。请具体说明 - 这有助于我们验证您的所有权。",
    proofHelp: "包括以下详细信息：特定划痕、贴纸、内容、序列号或任何独特的识别特征。",
    contactEmail: "联系邮箱",
    contactPhone: "联系电话（可选）",
    confirmationSentTo: "确认将发送至：",
    importantLabel: "重要",
    disclaimer: "提交此认领即表示您确认此物品属于您。虚假认领可能导致纪律处分。",
    submit: "提交认领",
    success: {
      title: "认领已提交！",
      message: "您的认领已提交，正在等待审核。处理完成后您将收到电子邮件。",
      viewClaims: "查看我的认领"
    }
  },

  // FAQ page
  faq: {
    title: "常见问题",
    subtitle: "查找有关 Lost Dane Found 的常见问题答案",
    searchPlaceholder: "搜索问题...",
    categories: {
      general: "一般",
      reporting: "报告物品",
      claiming: "认领物品",
      account: "账户"
    },
    noResults: "没有问题与您的搜索匹配",
    stillNeedHelp: "仍需帮助？",
    contactUs: "联系主办公室",
    visitOffice: "或在上课时间访问主办公室"
  },

  // OTP / Verification
  otp: {
    title: "输入验证码",
    subtitle: "我们已向您的邮箱发送了6位验证码",
    placeholder: "输入6位验证码",
    submit: "验证",
    resend: "重新发送验证码",
    resendIn: "{seconds}秒后重新发送",
    invalid: "验证码无效。请重试。",
    expired: "验证码已过期。请重新请求。"
  },

  // Password Reset
  resetPassword: {
    forgotTitle: "忘记密码",
    forgotSubtitle: "输入您的邮箱，我们将发送重置链接",
    sendLink: "发送重置链接",
    linkSent: "重置链接已发送！请检查您的邮箱。",
    resetTitle: "重置您的密码",
    newPassword: "新密码",
    confirmNewPassword: "确认新密码",
    resetButton: "重置密码",
    success: "密码重置成功！您现在可以登录了。"
  },

  // My Requests page
  myRequests: {
    title: "我的丢失物品请求",
    subtitle: "跟踪您预先登记为丢失的物品",
    noRequests: "您还没有提交任何丢失物品请求",
    noRequestsDesc: "预先登记丢失物品，以便在找到时收到通知",
    createNew: "报告丢失物品",
    newRequest: "新请求",
    viewMatch: "查看匹配",
    howMatchingWorks: "匹配如何工作",
    howMatchingWorksDesc: "我们的系统会自动将您丢失物品的描述与最近报告的找到物品进行比较。当有潜在匹配时，您将收到电子邮件通知。",
    status: {
      active: "活跃",
      matched: "已匹配",
      cancelled: "已取消",
      expired: "已过期"
    },
    dateLost: "丢失日期",
    cancel: "取消请求"
  },

  // ChatBot
  chatbot: {
    title: "Lost Dane Found 助手",
    alwaysAvailable: "随时可用",
    typing: "助手正在输入...",
    placeholder: "问我任何问题...",
    suggestionsLabel: "快速问题",
    greeting: "你好！我在这里帮助您使用 Lost Dane Found。今天我能为您做什么？",
    suggestions: [
      "如何报告找到的物品？",
      "如何认领物品？",
      "失物招领处在哪里？",
      "物品保留多长时间？"
    ],
    responses: {
      greeting: "你好！👋 您是在寻找丢失的物品还是想报告找到的东西？",
      search: "搜索物品：\n\n1️⃣ 在菜单中点击浏览物品\n2️⃣ 使用筛选器（类别、日期、位置）\n3️⃣ 找到匹配？提交认领！",
      lost: "很抱歉听到这个！😟\n\n以下是您应该做的：\n\n1️⃣ 查看浏览物品，看看是否已被找到\n2️⃣ 提交丢失物品请求，以便在找到时通知您",
      found: "感谢您的帮助！🐕\n\n在菜单中点击报告找到，上传照片并添加详细信息。剩下的我们来处理！",
      claim: "认领流程：\n\n1️⃣ 在浏览物品中找到您的物品\n2️⃣ 点击'认领'并提供所有权证明\n3️⃣ 管理员24小时内审核\n4️⃣ 通过邮件获取取件说明\n5️⃣ 携带学生证取件",
      location: "📍 失物招领处\n主办公室，101室\n\n🕐 工作时间\n周一至周五：上午7:30 – 下午4:00",
      howItWorks: "Lost Dane Found 如何工作：\n\n🔍 丢失了东西？\n浏览物品或提交丢失物品请求\n\n📦 找到了东西？\n报告它，让失主能够找到\n\n✅ 认领\n提交证明，验证，取回！",
      thanks: "不客气！🎉 如果还需要什么，请告诉我。",
      default: "我可以帮助您：\n\n🔍 搜索丢失物品\n📦 报告找到物品\n✅ 认领流程\n📍 办公室位置和时间\n\n您想了解什么？"
    }
  },

  // Toasts / Notifications
  toast: {
    success: "成功！",
    error: "错误",
    claimSubmitted: "认领提交成功",
    itemReported: "物品报告成功",
    requestSubmitted: "请求提交成功",
    loginSuccess: "登录成功",
    logoutSuccess: "退出成功",
    profileUpdated: "个人资料更新成功"
  }
};
