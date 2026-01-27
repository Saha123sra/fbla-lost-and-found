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
      activeUsers: "Active Users"
    },
    howItWorks: {
      title: "How It Works",
      step1Title: "Report or Search",
      step1Desc: "Found something? Report it. Lost something? Search our database or pre-register your item.",
      step2Title: "Get Matched",
      step2Desc: "Our system automatically matches found items with lost item requests and notifies you.",
      step3Title: "Claim & Pickup",
      step3Desc: "Verify ownership, get approved, and pick up your item from the main office."
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
    viewDetails: "View Details"
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
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    firstName: "First Name",
    lastName: "Last Name",
    gradeLevel: "Grade Level",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    adminLogin: "Admin Login",
    ownerLogin: "Owner Login",
    adminCode: "6-Digit Admin Code"
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
  }
};
