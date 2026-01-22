// Bengali translations
export const bn = {
  // App
  appName: 'ডিজিটাল বন্ধু ইনভেন্টরি',
  appTagline: 'আপনার ব্যবসার সম্পূর্ণ সমাধান',
  
  // Navigation
  nav: {
    dashboard: 'ড্যাশবোর্ড',
    products: 'পণ্য',
    inventory: 'স্টক',
    suppliers: 'সরবরাহকারী',
    purchases: 'ক্রয়',
    customers: 'গ্রাহক',
    sales: 'বিক্রয়',
    pos: 'পস বিক্রয়',
    invoices: 'চালান',
    warranty: 'ওয়ারেন্টি',
    reports: 'রিপোর্ট',
    settings: 'সেটিংস',
    users: 'ব্যবহারকারী',
    logout: 'লগআউট',
    profile: 'প্রোফাইল',
  },

  // Dashboard
  dashboard: {
    welcome: 'স্বাগতম',
    todaySales: 'আজকের বিক্রয়',
    monthSales: 'এই মাসের বিক্রয়',
    totalDue: 'মোট বকেয়া',
    lowStock: 'কম স্টক',
    warrantyExpiring: 'ওয়ারেন্টি মেয়াদ',
    quickActions: 'দ্রুত কাজ',
    newSale: 'নতুন বিক্রয়',
    newPurchase: 'নতুন ক্রয়',
    addProduct: 'পণ্য যোগ করুন',
    printLastInvoice: 'শেষ চালান প্রিন্ট',
    invoiceCount: 'টি চালান',
    items: 'টি আইটেম',
    next7Days: 'আগামী ৭ দিন',
    next30Days: 'আগামী ৩০ দিন',
  },

  // Products
  products: {
    title: 'পণ্য তালিকা',
    addNew: 'নতুন পণ্য',
    name: 'পণ্যের নাম',
    sku: 'এসকেইউ',
    barcode: 'বারকোড',
    category: 'ক্যাটাগরি',
    subcategory: 'সাব-ক্যাটাগরি',
    brand: 'ব্র্যান্ড',
    unit: 'একক',
    purchaseCost: 'ক্রয় মূল্য',
    salePrice: 'বিক্রয় মূল্য',
    currentStock: 'বর্তমান স্টক',
    lowStockThreshold: 'নিম্ন স্টক সীমা',
    image: 'ছবি',
    warranty: 'ওয়ারেন্টি',
    warrantyType: 'ওয়ারেন্টির ধরন',
    warrantyDuration: 'ওয়ারেন্টি সময়কাল',
    warrantyNotes: 'ওয়ারেন্টি শর্তাবলী',
    serialRequired: 'সিরিয়াল নম্বর প্রয়োজন',
    batchNumber: 'ব্যাচ নম্বর',
    expiryDate: 'মেয়াদ শেষ',
  },

  // Inventory
  inventory: {
    title: 'স্টক ব্যবস্থাপনা',
    stockLedger: 'স্টক লেজার',
    stockIn: 'স্টক ইন',
    stockOut: 'স্টক আউট',
    adjustment: 'স্টক সমন্বয়',
    lowStockAlerts: 'কম স্টক সতর্কতা',
    valuation: 'স্টক মূল্যায়ন',
    history: 'স্টক ইতিহাস',
  },

  // Suppliers
  suppliers: {
    title: 'সরবরাহকারী',
    addNew: 'নতুন সরবরাহকারী',
    name: 'নাম',
    phone: 'ফোন',
    address: 'ঠিকানা',
    totalDue: 'মোট বকেয়া',
  },

  // Purchases
  purchases: {
    title: 'ক্রয় তালিকা',
    addNew: 'নতুন ক্রয়',
    invoiceNo: 'চালান নং',
    supplier: 'সরবরাহকারী',
    date: 'তারিখ',
    total: 'মোট',
    paid: 'পরিশোধিত',
    due: 'বাকি',
    return: 'ক্রয় ফেরত',
  },

  // Customers
  customers: {
    title: 'গ্রাহক তালিকা',
    addNew: 'নতুন গ্রাহক',
    name: 'নাম',
    phone: 'ফোন',
    address: 'ঠিকানা',
    totalDue: 'মোট বকেয়া',
    purchaseHistory: 'ক্রয়ের ইতিহাস',
  },

  // Sales
  sales: {
    title: 'বিক্রয় তালিকা',
    newSale: 'নতুন বিক্রয়',
    selectCustomer: 'গ্রাহক নির্বাচন',
    quickAdd: 'দ্রুত যোগ',
    addProduct: 'পণ্য যোগ করুন',
    discount: 'ছাড়',
    vat: 'ভ্যাট',
    subtotal: 'সাবটোটাল',
    grandTotal: 'সর্বমোট',
    paidAmount: 'পরিশোধিত',
    dueAmount: 'বাকি',
    paymentMethod: 'পেমেন্ট পদ্ধতি',
    cash: 'নগদ',
    bkash: 'বিকাশ',
    nagad: 'নগদ',
    bank: 'ব্যাংক',
    due: 'বাকি',
    notes: 'নোট',
    insufficientStock: 'অপর্যাপ্ত স্টক!',
    return: 'বিক্রয় ফেরত',
  },

  // Invoices
  invoices: {
    title: 'চালান তালিকা',
    view: 'দেখুন',
    print: 'প্রিন্ট',
    download: 'ডাউনলোড',
    share: 'শেয়ার',
    invoiceNo: 'চালান নং',
    date: 'তারিখ',
    customer: 'গ্রাহক',
    total: 'মোট',
    thermalLayout: 'থার্মাল লেআউট',
    a4Layout: 'A4 লেআউট',
  },

  // Warranty
  warranty: {
    title: 'ওয়ারেন্টি ট্র্যাকিং',
    search: 'ওয়ারেন্টি খুঁজুন',
    searchByInvoice: 'চালান নম্বর দিয়ে খুঁজুন',
    searchByPhone: 'ফোন নম্বর দিয়ে খুঁজুন',
    searchBySku: 'SKU/সিরিয়াল দিয়ে খুঁজুন',
    expiryReport: 'মেয়াদ রিপোর্ট',
    claimLog: 'ক্লেইম লগ',
    status: 'স্ট্যাটাস',
    active: 'সক্রিয়',
    expired: 'মেয়াদ শেষ',
    startDate: 'শুরুর তারিখ',
    expiryDate: 'মেয়াদ শেষ',
    product: 'পণ্য',
    customer: 'গ্রাহক',
  },

  // Reports
  reports: {
    title: 'রিপোর্ট',
    dailySales: 'দৈনিক বিক্রয়',
    monthlySales: 'মাসিক বিক্রয়',
    profit: 'লাভ রিপোর্ট',
    stock: 'স্টক রিপোর্ট',
    lowStock: 'কম স্টক',
    topSelling: 'সেরা বিক্রিত',
    customerReport: 'গ্রাহক রিপোর্ট',
    supplierDue: 'সরবরাহকারী বকেয়া',
    warrantyExpiry: 'ওয়ারেন্টি মেয়াদ',
    export: 'এক্সপোর্ট',
    dateRange: 'তারিখ সীমা',
    from: 'থেকে',
    to: 'পর্যন্ত',
  },

  // Settings
  settings: {
    title: 'সেটিংস',
    store: 'স্টোর সেটিংস',
    storeName: 'স্টোরের নাম',
    logo: 'লোগো',
    phone: 'ফোন',
    email: 'ইমেইল',
    address: 'ঠিকানা',
    invoiceHeader: 'চালান হেডার',
    invoiceFooter: 'চালান ফুটার',
    defaultWarranty: 'ডিফল্ট ওয়ারেন্টি',
    lowStockThreshold: 'নিম্ন স্টক সীমা',
    taxEnabled: 'ভ্যাট/ট্যাক্স সক্রিয়',
    invoicePrefix: 'চালান প্রিফিক্স',
    users: 'ব্যবহারকারী ব্যবস্থাপনা',
    activityLog: 'কার্যকলাপ লগ',
  },

  // Auth
  auth: {
    login: 'লগইন',
    signup: 'সাইন আপ',
    email: 'ইমেইল',
    password: 'পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    createStore: 'স্টোর তৈরি করুন',
    storeName: 'স্টোরের নাম',
    ownerName: 'মালিকের নাম',
    alreadyHaveAccount: 'ইতিমধ্যে একাউন্ট আছে?',
    dontHaveAccount: "একাউন্ট নেই?",
  },

  // Common
  common: {
    save: 'সংরক্ষণ',
    cancel: 'বাতিল',
    delete: 'মুছুন',
    edit: 'সম্পাদনা',
    view: 'দেখুন',
    search: 'খুঁজুন...',
    filter: 'ফিল্টার',
    actions: 'অ্যাকশন',
    status: 'স্ট্যাটাস',
    date: 'তারিখ',
    loading: 'লোড হচ্ছে...',
    noData: 'কোন তথ্য নেই',
    confirm: 'নিশ্চিত করুন',
    confirmDelete: 'আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?',
    success: 'সফল!',
    error: 'ত্রুটি!',
    all: 'সব',
    active: 'সক্রিয়',
    inactive: 'নিষ্ক্রিয়',
    yes: 'হ্যাঁ',
    no: 'না',
    add: 'যোগ করুন',
    update: 'আপডেট',
    create: 'তৈরি করুন',
    close: 'বন্ধ',
    back: 'পিছনে',
    next: 'পরবর্তী',
    previous: 'পূর্ববর্তী',
    total: 'মোট',
    qty: 'পরিমাণ',
    price: 'মূল্য',
    amount: 'টাকা',
  },

  // Units
  units: {
    pcs: 'পিস',
    kg: 'কেজি',
    liter: 'লিটার',
    box: 'বক্স',
    meter: 'মিটার',
    dozen: 'ডজন',
  },

  // Warranty Types
  warrantyTypes: {
    none: 'কোন ওয়ারেন্টি নেই',
    warranty: 'ওয়ারেন্টি',
    guarantee: 'গ্যারান্টি',
  },

  // Duration Units
  durationUnits: {
    days: 'দিন',
    months: 'মাস',
    years: 'বছর',
  },

  // Roles
  roles: {
    owner: 'মালিক',
    manager: 'ম্যানেজার',
    staff: 'স্টাফ',
  },
};

// Format currency in BDT
export const formatBDT = (amount: number): string => {
  return `৳ ${amount.toLocaleString('bn-BD')}`;
};

// Format date in Bengali
export const formatDateBn = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format number in Bengali
export const formatNumberBn = (num: number): string => {
  return num.toLocaleString('bn-BD');
};
