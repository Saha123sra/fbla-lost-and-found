// English translations (default)
export default {
  // Navigation
  nav: {
    home: "Home",
    browse: "Browse Items",
    reportFound: "Report Found",
    lostItem: "Lost Item",
    myClaims: "My Claims",
    myRequests: "My Requests",
    faq: "FAQ",
    admin: "Admin",
    owner: "Owner",
    login: "Login",
    signUp: "Sign Up",
    logout: "Logout"
  },

  // Home page
  home: {
    hero: {
      title: "Lost Something?",
      tagline: "We'll Help You Find It.",
      subtitle: "Our AI-powered platform helps Danes reunite with their lost belongings. Found something? Report it. Lost something? Search for it. We're here to help each other out.",
      browseCta: "Browse Found Items",
      reportCta: "Report Found Item"
    },
    stats: {
      itemsFound: "Items Found",
      itemsReturned: "Items Returned",
      activeUsers: "Active Users",
      returnRate: "Return Rate",
      avgReturnTime: "Avg. Return Time"
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "Our simple 3-step process makes finding lost items easier than ever",
      step1Title: "Report or Search",
      step1Desc: "Found something? Report it. Lost something? Search our database or pre-register your item.",
      step2Title: "Get Matched",
      step2Desc: "Our system automatically matches found items with lost item requests and notifies you.",
      step3Title: "Claim & Pickup",
      step3Desc: "Verify ownership, get approved, and pick up your item from the main office."
    },
    testimonials: {
      title: "What Danes Are Saying"
    },
    cta: {
      title: "Found Something?",
      subtitle: "Help a fellow Dane by reporting it. It only takes a minute!"
    }
  },

  // Browse page
  browse: {
    title: "Found Items",
    subtitle: "Browse items that have been found at Denmark High School",
    search: "Search items...",
    filter: {
      all: "All Categories",
      category: "Category",
      location: "Location",
      date: "Date Found",
      duration: "Duration",
      anyTime: "Any Time",
      lastWeek: "Last Week",
      last2Weeks: "Last 2 Weeks",
      lastMonth: "Last Month",
      olderThanMonth: "Older than 1 Month",
      priority: "Priority",
      anyPriority: "Any Priority",
      highPriority: "High Priority",
      lowPriority: "Low Priority",
      availability: "Availability",
      availableOnly: "Available Only",
      available: "Available",
      pendingClaim: "Pending Claim",
      claimed: "Claimed",
      allItems: "All Items"
    },
    noItems: "No items found",
    claim: "Claim",
    viewDetails: "View Details",
    tryAdjusting: "Try adjusting your search or filters",
    clearFilters: "Clear all filters",
    clearAll: "Clear all",
    uncategorized: "Uncategorized",
    page: "Page",
    of: "of"
  },

  // Report page
  report: {
    title: "Report a Found Item",
    subtitle: "Help reunite a lost item with its owner",
    form: {
      photo: "Photo of Item (Optional)",
      photoHelp: "Upload a photo to help owners identify their item",
      name: "Item Name",
      namePlaceholder: "e.g., Blue Nike Backpack, iPhone 14, TI-84 Calculator",
      category: "Category",
      selectCategory: "Select category...",
      location: "Location Found",
      selectLocation: "Select location...",
      specificLocation: "Specific Location",
      specificLocationPlaceholder: "e.g., Near room 204, by the water fountain",
      dateFound: "Date Found",
      description: "Description",
      descriptionPlaceholder: "Describe the item in detail: color, size, brand, distinguishing features...",
      submit: "Submit Found Item"
    },
    success: {
      title: "Item Reported Successfully!",
      message: "Thank you for helping a fellow Dane! The item has been added to our database.",
      reference: "Reference Number",
      reportAnother: "Report Another",
      viewItems: "View Items"
    }
  },

  // Request page (Lost Item)
  request: {
    title: "Pre-Register Lost Item",
    subtitle: "Get notified when your item is found",
    howItWorks: "How it works:",
    howItWorksDesc: "Describe the item you lost. If someone reports a matching item, you'll receive an email notification. This helps reunite you with your belongings faster!",
    form: {
      name: "Item Name",
      namePlaceholder: "e.g., Blue North Face Jacket",
      description: "Description",
      descriptionPlaceholder: "Describe your item in detail:\n- Size, color, brand\n- Unique marks, stickers, or damage\n- Contents (if applicable)\n- Any identifying features",
      descriptionMin: "characters minimum",
      photo: "Photo of Item (Optional)",
      photoHelp: "Upload a photo of the item you lost. This helps our system match it more accurately when found.",
      category: "Category",
      location: "Last Seen Location",
      dateLost: "Date Lost",
      submit: "Submit Request"
    },
    success: {
      title: "Request Submitted!",
      message: "We've recorded your lost item. If a matching item is found, you'll be notified automatically.",
      viewRequests: "View My Requests",
      browseItems: "Browse Items"
    }
  },

  // Claims
  claims: {
    title: "My Claims",
    noClaims: "You haven't made any claims yet",
    claimedOn: "Claimed on",
    reason: "Reason",
    status: {
      pending: "Pending",
      approved: "Approved",
      denied: "Denied",
      cancelled: "Cancelled"
    },
    pickup: "Pickup Details",
    cancel: "Cancel Claim"
  },

  // Common
  common: {
    loading: "Loading...",
    error: "Something went wrong",
    tryAgain: "Try Again",
    back: "Back",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    submit: "Submit",
    required: "Required",
    optional: "Optional",
    dragDrop: "Drag & drop an image here",
    orClick: "or click to browse",
    maxSize: "max 5MB",
    loginRequired: "Login Required",
    loginRequiredDesc: "Please log in to access this feature"
  },

  // Auth
  auth: {
    login: "Login",
    register: "Sign Up",
    studentId: "Student ID",
    adminId: "Admin ID",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    passwordPlaceholder: "At least 6 characters",
    confirmPasswordPlaceholder: "Re-enter your password",
    firstName: "First Name",
    lastName: "Last Name",
    gradeLevel: "Grade Level",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    adminLogin: "Admin Login",
    ownerLogin: "Owner Login",
    adminCode: "6-Digit Admin Code",
    siteOwner: "Site Owner",
    studentLogin: "Student Login",
    enterPassword: "Enter your password",
    enterAdminId: "Enter your admin ID",
    enterStudentId: "Enter your student ID",
    createAccount: "Create Account",
    registerAsAdmin: "Register as Admin",
    select: "Select..."
  },

  // Footer
  footer: {
    description: "Denmark High School's official lost and found system.",
    quickLinks: "Quick Links",
    contact: "Contact",
    hours: "Hours: 7:30 AM - 4:00 PM",
    copyright: "Denmark High School Lost & Found"
  },

  // Language names
  languages: {
    en: "English",
    es: "Spanish",
    hi: "Hindi",
    fr: "French",
    zh: "Mandarin"
  },

  // Admin Dashboard
  admin: {
    title: "Admin Dashboard",
    stats: {
      activeItems: "Active Items",
      pendingClaims: "Pending Claims",
      returnedItems: "Returned Items",
      successRate: "Success Rate"
    },
    tabs: {
      overview: "Overview",
      claims: "Claims",
      items: "Items",
      students: "Students"
    },
    overview: {
      welcome: "Welcome, Admin!",
      pendingReview: "You have {count} pending claims to review.",
      reviewClaims: "Review Claims"
    },
    claims: {
      title: "Pending Claims",
      noPending: "No pending claims! All caught up.",
      claimedBy: "Claimed by",
      studentId: "Student ID",
      proofOfOwnership: "Proof of Ownership",
      approve: "Approve",
      deny: "Deny",
      approveClaim: "Approve Claim",
      denyClaim: "Deny Claim",
      pickupDate: "Pickup Date",
      pickupTime: "Pickup Time",
      pickupLocation: "Pickup Location",
      denialReason: "Reason for Denial",
      denialPlaceholder: "Insufficient proof, description doesn't match...",
      confirm: "Confirm",
      actionSuccess: "Claim {status}!",
      loadError: "Failed to load claims",
      actionError: "Action failed"
    },
    students: {
      title: "Student Directory",
      searchPlaceholder: "Search students...",
      noMatch: "No students match your search",
      noStudents: "No students registered yet",
      loadingStudents: "Loading students...",
      loadError: "Failed to load students",
      columns: {
        name: "Name",
        studentId: "Student ID",
        email: "Email",
        grade: "Grade",
        claims: "Claims",
        itemsReported: "Items Reported",
        joined: "Joined"
      }
    },
    items: {
      comingSoon: "Item management coming soon..."
    }
  },

  // Owner Dashboard
  owner: {
    title: "Site Owner Dashboard",
    siteAdmin: "Site Administration",
    adminId: "Admin ID",
    lastLogin: "Last Login",
    actions: "Actions",
    never: "Never",
    stats: {
      pendingAdmins: "Pending Admins",
      activeAdmins: "Active Admins"
    },
    tabs: {
      pendingAdmins: "Pending Admins",
      allAdmins: "All Admins",
      settings: "Settings"
    },
    pendingAdmins: {
      title: "Pending Admin Requests",
      noPending: "No pending admin requests",
      approve: "Approve",
      deny: "Deny",
      requestedOn: "Requested on"
    },
    allAdmins: {
      title: "All Administrators",
      active: "Active",
      deactivated: "Deactivated",
      reactivate: "Reactivate",
      deactivate: "Deactivate",
      regenerateCode: "Regenerate Code",
      noAdmins: "No administrators found"
    },
    denyModal: {
      title: "Deny Admin Registration",
      denyingFor: "Denying registration for",
      reasonLabel: "Reason",
      reasonPlaceholder: "Enter reason for denial...",
      denyButton: "Deny Registration"
    }
  },

  // Item Detail page
  itemDetail: {
    category: "Category",
    location: "Location",
    dateFound: "Date Found",
    reportedBy: "Reported by",
    description: "Description",
    status: "Status",
    claimItem: "Claim This Item",
    backToBrowse: "Back to Browse",
    notFound: "Item not found",
    alreadyClaimed: "This item has already been claimed",
    pendingClaim: "This item has a pending claim"
  },

  // Claim form
  claimForm: {
    title: "Claim This Item",
    subtitle: "Please provide proof of ownership",
    proofLabel: "Describe how you can prove this is yours",
    proofPlaceholder: "Describe unique features, marks, or contents that only the owner would know. Be specific - this helps us verify your ownership.",
    proofHelp: "Include details like: specific scratches, stickers, contents, serial numbers, or any unique identifying features.",
    contactEmail: "Contact Email",
    contactPhone: "Contact Phone (Optional)",
    confirmationSentTo: "Confirmation will be sent to:",
    importantLabel: "Important",
    disclaimer: "By submitting this claim, you confirm that this item belongs to you. False claims may result in disciplinary action.",
    submit: "Submit Claim",
    success: {
      title: "Claim Submitted!",
      message: "Your claim has been submitted and is pending review. You'll receive an email once it's processed.",
      viewClaims: "View My Claims"
    }
  },

  // FAQ page
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about Lost Dane Found",
    searchPlaceholder: "Search questions...",
    categories: {
      general: "General",
      reporting: "Reporting Items",
      claiming: "Claiming Items",
      account: "Account"
    },
    noResults: "No questions match your search",
    stillNeedHelp: "Still need help?",
    contactUs: "Contact the main office",
    visitOffice: "Or visit the Main Office during school hours"
  },

  // OTP / Verification
  otp: {
    title: "Enter Verification Code",
    subtitle: "We've sent a 6-digit code to your email",
    placeholder: "Enter 6-digit code",
    submit: "Verify",
    resend: "Resend Code",
    resendIn: "Resend code in {seconds}s",
    invalid: "Invalid code. Please try again.",
    expired: "Code expired. Please request a new one."
  },

  // Password Reset
  resetPassword: {
    forgotTitle: "Forgot Password",
    forgotSubtitle: "Enter your email and we'll send you a reset link",
    sendLink: "Send Reset Link",
    linkSent: "Reset link sent! Check your email.",
    resetTitle: "Reset Your Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    resetButton: "Reset Password",
    success: "Password reset successfully! You can now log in."
  },

  // My Requests page
  myRequests: {
    title: "My Lost Item Requests",
    subtitle: "Track items you've pre-registered as lost",
    noRequests: "You haven't submitted any lost item requests yet",
    noRequestsDesc: "Pre-register lost items to get notified when they're found",
    createNew: "Report a Lost Item",
    newRequest: "New Request",
    viewMatch: "View Match",
    howMatchingWorks: "How matching works",
    howMatchingWorksDesc: "Our system automatically compares your lost item description with newly reported found items. When there's a potential match, you'll receive an email notification.",
    status: {
      active: "Active",
      matched: "Matched",
      cancelled: "Cancelled",
      expired: "Expired"
    },
    dateLost: "Date Lost",
    cancel: "Cancel Request"
  },

  // ChatBot
  chatbot: {
    title: "Lost Dane Found Assistant",
    alwaysAvailable: "Always available",
    typing: "Assistant is typing...",
    placeholder: "Ask me anything...",
    suggestionsLabel: "Quick questions",
    greeting: "Hi! I'm here to help you with Lost Dane Found. How can I assist you today?",
    suggestions: [
      "How do I report a found item?",
      "How do I claim an item?",
      "Where is the lost and found?",
      "How long are items kept?"
    ],
    responses: {
      greeting: "Hello! 👋 Are you looking for a lost item or reporting something you found?",
      search: "To search for items:\n\n1️⃣ Go to Browse Items in the menu\n2️⃣ Use filters (category, date, location)\n3️⃣ Found a match? Submit a claim!",
      lost: "Sorry to hear that! 😟\n\nHere's what to do:\n\n1️⃣ Check Browse Items to see if it's been found\n2️⃣ Submit a Lost Item Request so we can notify you if it turns up",
      found: "Thanks for helping! 🐕\n\nGo to Report Found in the menu, upload a photo, and add details. We'll handle the rest!",
      claim: "Claim process:\n\n1️⃣ Find your item in Browse Items\n2️⃣ Click 'Claim' and provide proof of ownership\n3️⃣ Admin reviews within 24 hours\n4️⃣ Get pickup instructions by email\n5️⃣ Bring your student ID to collect",
      location: "📍 Lost & Found Office\nMain Office, Room 101\n\n🕐 Hours\nMonday - Friday: 7:30 AM – 4:00 PM",
      howItWorks: "Here's how Lost Dane Found works:\n\n🔍 Lost something?\nBrowse items or submit a lost item request\n\n📦 Found something?\nReport it so the owner can find it\n\n✅ Claiming\nSubmit proof, get verified, pick up!",
      thanks: "You're welcome! 🎉 Let me know if you need anything else.",
      default: "I can help with:\n\n🔍 Searching for lost items\n📦 Reporting found items\n✅ Claim process\n📍 Office location & hours\n\nWhat would you like to know?"
    }
  },

  // Toasts / Notifications
  toast: {
    success: "Success!",
    error: "Error",
    claimSubmitted: "Claim submitted successfully",
    itemReported: "Item reported successfully",
    requestSubmitted: "Request submitted successfully",
    loginSuccess: "Logged in successfully",
    logoutSuccess: "Logged out successfully",
    profileUpdated: "Profile updated successfully"
  }
};
