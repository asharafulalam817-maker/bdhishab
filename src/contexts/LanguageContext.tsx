import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'bn' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    // App
    'app.name': 'ডিজিটাল অন্ডু',
    'app.tagline': 'আপনার ব্যবসা ব্যবস্থাপনা সহজ করুন',
    
    // Navigation
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.products': 'পণ্য',
    'nav.inventory': 'ইনভেন্টরি',
    'nav.suppliers': 'সরবরাহকারী',
    'nav.purchases': 'ক্রয়',
    'nav.customers': 'গ্রাহক',
    'nav.pos': 'বিক্রয় (POS)',
    'nav.sales': 'বিক্রয়',
    'nav.salesList': 'বিক্রয় তালিকা',
    'nav.invoices': 'চালান',
    'nav.warranty': 'ওয়ারেন্টি',
    'nav.reports': 'রিপোর্ট',
    'nav.settings': 'সেটিংস',
    'nav.admin': 'এডমিন প্যানেল',
    
    // Inventory
    'inventory.stockLedger': 'স্টক লেজার',
    'inventory.stockIn': 'স্টক ইন',
    'inventory.stockOut': 'স্টক আউট',
    'inventory.adjustment': 'সমন্বয়',
    'inventory.lowStockAlerts': 'কম স্টক সতর্কতা',
    
    // Reports
    'reports.dailySales': 'দৈনিক বিক্রয়',
    'reports.monthlySales': 'মাসিক বিক্রয়',
    'reports.profit': 'লাভ-ক্ষতি',
    'reports.stock': 'স্টক রিপোর্ট',
    'reports.topSelling': 'সর্বাধিক বিক্রিত',
    'reports.customerReport': 'গ্রাহক রিপোর্ট',
    'reports.supplierDue': 'সরবরাহকারী বাকি',
    
    // Dashboard
    'dashboard.title': 'ড্যাশবোর্ড',
    'dashboard.welcome': 'স্বাগতম',
    'dashboard.todayStats': 'আজকের হিসেব',
    'dashboard.sales': 'বিক্রয়',
    'dashboard.purchasesShort': 'ক্রয়',
    'dashboard.due': 'বাকি',
    'dashboard.profit': 'লাভ',
    'dashboard.expenses': 'খরচ',
    'dashboard.todaySales': 'আজকের বিক্রয়',
    'dashboard.todayPurchases': 'আজকের ক্রয়',
    'dashboard.todayDue': 'আজকের বাকি',
    'dashboard.todayProfit': 'আজকের লাভ',
    'dashboard.todayExpenses': 'আজকের খরচ',
    'dashboard.totalProducts': 'মোট পণ্য',
    'dashboard.lowStock': 'কম স্টক',
    'dashboard.totalCustomers': 'মোট গ্রাহক',
    'dashboard.totalDue': 'মোট বাকি',
    'dashboard.recentSales': 'সাম্প্রতিক বিক্রয়',
    'dashboard.quickActions': 'দ্রুত কাজ',
    'dashboard.totalCash': 'ক্যাশ আছে',
    'dashboard.cashOnHand': 'হাতে নগদ',
    'dashboard.totalStockValue': 'স্টক মূল্য',
    'dashboard.allProductsValue': 'সব পণ্যের মূল্য',
    'dashboard.totalReceivables': 'বাকি পাওনা',
    'dashboard.customerDues': 'গ্রাহকদের বকেয়া',
    'dashboard.totalCapital': 'মূলধন',
    'dashboard.combined': 'সব মিলিয়ে',
    'dashboard.invoices': 'ইনভয়েস',
    'dashboard.purchases': 'পার্চেজ',
    'dashboard.salesDue': 'বিক্রয় বাকি',
    'dashboard.netProfit': 'নেট প্রফিট',
    'dashboard.totalExpense': 'মোট ব্যয়',
    'dashboard.alerts': 'সতর্কতা',
    'dashboard.warrantyExpiring': 'ওয়ারেন্টি শেষ',
    'dashboard.noSalesToday': 'আজ কোন বিক্রয় হয়নি',
    'dashboard.newSale': 'নতুন বিক্রয় করুন',
    'dashboard.allStockOk': 'সব পণ্যের স্টক পর্যাপ্ত',
    'dashboard.pieces': 'পিস',
    'dashboard.viewAll': 'সব দেখুন',
    'dashboard.refresh': 'রিফ্রেশ',
    
    // Quick Actions
    'quickAction.newSale': 'নতুন বিক্রয়',
    'quickAction.newPurchase': 'নতুন ক্রয়',
    'quickAction.quickStock': 'দ্রুত স্টক',
    'quickAction.customers': 'গ্রাহক',
    'quickAction.sale': 'বিক্রয়',
    'quickAction.purchase': 'ক্রয়',
    'quickAction.stock': 'স্টক',
    'quickAction.customer': 'গ্রাহক',
    
    // Products
    'products.title': 'পণ্য তালিকা',
    'products.description': 'আপনার সব পণ্য এখানে দেখুন এবং পরিচালনা করুন',
    'products.addProduct': 'নতুন পণ্য',
    'products.name': 'পণ্যের নাম',
    'products.sku': 'SKU',
    'products.barcode': 'বারকোড',
    'products.category': 'ক্যাটাগরি',
    'products.brand': 'ব্র্যান্ড',
    'products.purchaseCost': 'ক্রয় মূল্য',
    'products.salePrice': 'বিক্রয় মূল্য',
    'products.stock': 'স্টক',
    'products.currentStock': 'বর্তমান স্টক',
    'products.unit': 'একক',
    'products.warranty': 'ওয়ারেন্টি',
    'products.totalProducts': 'মোট পণ্য',
    'products.lowStock': 'কম স্টক',
    'products.outOfStock': 'স্টক শেষ',
    'products.stockValue': 'স্টক মূল্য',
    'products.searchPlaceholder': 'পণ্যের নাম, SKU বা বারকোড দিয়ে খুঁজুন...',
    'products.categoryBrand': 'ক্যাটাগরি/ব্র্যান্ড',
    'products.allCategories': 'সব ক্যাটাগরি',
    'products.allStock': 'সব স্টক',
    'products.noProducts': 'কোনো পণ্য পাওয়া যায়নি',
    'products.barcodeScanned': 'বারকোড স্ক্যান হয়েছে',
    'products.deleted': 'মুছে ফেলা হয়েছে',
    'products.updated': 'পণ্য আপডেট হয়েছে',
    'products.added': 'নতুন পণ্য যোগ হয়েছে',
    'products.warrantyNone': 'নেই',
    'products.days': 'দিন',
    'products.months': 'মাস',
    'products.years': 'বছর',
    
    // POS / Sales
    'pos.title': 'বিক্রয় (POS)',
    'pos.searchPlaceholder': 'পণ্যের নাম, SKU বা বারকোড দিয়ে খুঁজুন...',
    'pos.scanBarcode': 'বারকোড স্ক্যান করুন',
    'pos.cart': 'কার্ট',
    'pos.items': 'আইটেম',
    'pos.emptyCart': 'কার্ট খালি',
    'pos.selectCustomer': 'গ্রাহক নির্বাচন করুন',
    'pos.subtotal': 'সাবটোটাল',
    'pos.discount': 'ডিসকাউন্ট',
    'pos.grandTotal': 'সর্বমোট',
    'pos.paymentMethod': 'পেমেন্ট মেথড',
    'pos.paidAmount': 'পরিশোধ',
    'pos.dueAmount': 'বাকি',
    'pos.notes': 'নোট',
    'pos.notesOptional': 'নোট (ঐচ্ছিক)',
    'pos.checkout': 'বিক্রয় সম্পন্ন করুন',
    'pos.insufficientStock': 'স্টক অপর্যাপ্ত',
    'pos.onlyXInStock': 'মাত্র {count} পিস স্টক আছে',
    'pos.saleSuccess': 'বিক্রয় সফল!',
    'pos.invoiceNo': 'চালান নং',
    'pos.addedToBalance': 'ব্যালেন্সে যোগ হয়েছে',
    'pos.productAdded': 'যোগ হয়েছে',
    'pos.productNotFound': 'পণ্য পাওয়া যায়নি',
    'pos.cash': 'নগদ',
    'pos.bkash': 'বিকাশ',
    'pos.nagad': 'নগদ',
    'pos.bank': 'ব্যাংক',
    'pos.due': 'বাকি',
    
    // Sales List
    'sales.title': 'বিক্রয় তালিকা',
    'sales.description': 'সব বিক্রয় এবং চালান দেখুন',
    'sales.todaySales': 'আজকের বিক্রয়',
    'sales.monthlySales': 'এই মাসের বিক্রয়',
    'sales.totalDue': 'মোট বাকি',
    'sales.totalInvoices': 'মোট চালান',
    'sales.invoices': 'টি চালান',
    'sales.searchPlaceholder': 'চালান নং, গ্রাহক বা ফোন দিয়ে খুঁজুন...',
    'sales.allStatus': 'সব স্ট্যাটাস',
    'sales.paid': 'পরিশোধিত',
    'sales.partial': 'আংশিক',
    'sales.walkIn': 'ওয়াক-ইন',
    'sales.payDue': 'বাকি পরিশোধ',
    'sales.print': 'প্রিন্ট',
    'sales.printing': 'প্রিন্ট হচ্ছে',
    'sales.noSales': 'কোনো বিক্রয় পাওয়া যায়নি',
    'sales.duePaymentSuccess': 'বাকি পরিশোধ সফল হয়েছে!',
    'sales.invoiceDeleted': 'মুছে ফেলা হয়েছে',
    
    // Invoices
    'invoices.invoiceNo': 'চালান নং',
    'invoices.date': 'তারিখ',
    'invoices.customer': 'গ্রাহক',
    'invoices.total': 'মোট',
    
    // Settings
    'settings.title': 'সেটিংস',
    'settings.store': 'স্টোর',
    'settings.subscription': 'সাবস্ক্রিপশন',
    'settings.invoice': 'চালান',
    'settings.warranty': 'ওয়ারেন্টি',
    'settings.notifications': 'নোটিফিকেশন',
    'settings.users': 'ব্যবহারকারী',
    'settings.language': 'ভাষা',
    'settings.theme': 'থিম',
    'settings.darkMode': 'ডার্ক মোড',
    'settings.lightMode': 'লাইট মোড',
    'settings.system': 'সিস্টেম',
    'settings.appearance': 'এপিয়ারেন্স',
    'settings.languageAndTheme': 'ভাষা ও থিম',
    
    // Common
    'common.save': 'সংরক্ষণ',
    'common.cancel': 'বাতিল',
    'common.delete': 'মুছুন',
    'common.edit': 'সম্পাদনা',
    'common.view': 'দেখুন',
    'common.search': 'সার্চ...',
    'common.filter': 'ফিল্টার',
    'common.add': 'যোগ করুন',
    'common.addNew': 'নতুন যোগ করুন',
    'common.actions': 'কাজ',
    'common.status': 'স্ট্যাটাস',
    'common.date': 'তারিখ',
    'common.total': 'মোট',
    'common.amount': 'পরিমাণ',
    'common.paid': 'পরিশোধিত',
    'common.due': 'বাকি',
    'common.yes': 'হ্যাঁ',
    'common.no': 'না',
    'common.all': 'সব',
    'common.loading': 'লোড হচ্ছে...',
    'common.noData': 'কোন ডাটা নেই',
    'common.success': 'সফল',
    'common.error': 'ত্রুটি',
    'common.bengali': 'বাংলা',
    'common.english': 'English',
    'common.goToDashboard': 'ড্যাশবোর্ডে যান',
    'common.notifications': 'বিজ্ঞপ্তি',
    'common.clickHere': 'ক্লিক করুন',
    
    // Roles
    'roles.owner': 'মালিক',
    'roles.manager': 'ম্যানেজার',
    'roles.staff': 'স্টাফ',
    
    // Customers
    'customers.title': 'গ্রাহক',
    'customers.description': 'গ্রাহক তালিকা পরিচালনা করুন',
    'customers.totalCustomers': 'মোট গ্রাহক',
    'customers.totalDue': 'মোট বাকি',
    'customers.withDue': 'বাকিধারী',
    
    // Suppliers
    'suppliers.title': 'সরবরাহকারী',
    'suppliers.description': 'সরবরাহকারী তালিকা পরিচালনা করুন',
    
    // Purchases
    'purchases.title': 'ক্রয়',
    'purchases.description': 'সব ক্রয় দেখুন এবং পরিচালনা করুন',
  },
  en: {
    // App
    'app.name': 'Digital Ondu',
    'app.tagline': 'Simplify your business management',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.inventory': 'Inventory',
    'nav.suppliers': 'Suppliers',
    'nav.purchases': 'Purchases',
    'nav.customers': 'Customers',
    'nav.pos': 'POS',
    'nav.sales': 'Sales',
    'nav.salesList': 'Sales List',
    'nav.invoices': 'Invoices',
    'nav.warranty': 'Warranty',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.admin': 'Admin Panel',
    
    // Inventory
    'inventory.stockLedger': 'Stock Ledger',
    'inventory.stockIn': 'Stock In',
    'inventory.stockOut': 'Stock Out',
    'inventory.adjustment': 'Adjustment',
    'inventory.lowStockAlerts': 'Low Stock Alerts',
    
    // Reports
    'reports.dailySales': 'Daily Sales',
    'reports.monthlySales': 'Monthly Sales',
    'reports.profit': 'Profit & Loss',
    'reports.stock': 'Stock Report',
    'reports.topSelling': 'Top Selling',
    'reports.customerReport': 'Customer Report',
    'reports.supplierDue': 'Supplier Due',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.todayStats': "Today's Stats",
    'dashboard.sales': 'Sales',
    'dashboard.purchasesShort': 'Purchases',
    'dashboard.due': 'Due',
    'dashboard.profit': 'Profit',
    'dashboard.expenses': 'Expenses',
    'dashboard.todaySales': "Today's Sales",
    'dashboard.todayPurchases': "Today's Purchases",
    'dashboard.todayDue': "Today's Due",
    'dashboard.todayProfit': "Today's Profit",
    'dashboard.todayExpenses': "Today's Expenses",
    'dashboard.totalProducts': 'Total Products',
    'dashboard.lowStock': 'Low Stock',
    'dashboard.totalCustomers': 'Total Customers',
    'dashboard.totalDue': 'Total Due',
    'dashboard.recentSales': 'Recent Sales',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.totalCash': 'Total Cash',
    'dashboard.cashOnHand': 'Cash on hand',
    'dashboard.totalStockValue': 'Total Stock Value',
    'dashboard.allProductsValue': 'All products value',
    'dashboard.totalReceivables': 'Total Receivables',
    'dashboard.customerDues': 'Customer dues',
    'dashboard.totalCapital': 'Total Capital',
    'dashboard.combined': 'Combined',
    'dashboard.invoices': 'invoices',
    'dashboard.purchases': 'purchases',
    'dashboard.salesDue': 'Sales due',
    'dashboard.netProfit': 'Net profit',
    'dashboard.totalExpense': 'Total expense',
    'dashboard.alerts': 'Alerts',
    'dashboard.warrantyExpiring': 'Warranty Expiring',
    'dashboard.noSalesToday': 'No sales today',
    'dashboard.newSale': 'Make new sale',
    'dashboard.allStockOk': 'All products have adequate stock',
    'dashboard.pieces': 'pcs',
    'dashboard.viewAll': 'View all',
    'dashboard.refresh': 'Refresh',
    
    // Quick Actions
    'quickAction.newSale': 'New Sale',
    'quickAction.newPurchase': 'New Purchase',
    'quickAction.quickStock': 'Quick Stock',
    'quickAction.customers': 'Customers',
    'quickAction.sale': 'Sale',
    'quickAction.purchase': 'Purchase',
    'quickAction.stock': 'Stock',
    'quickAction.customer': 'Customer',
    
    // Products
    'products.title': 'Products',
    'products.description': 'View and manage all your products here',
    'products.addProduct': 'Add Product',
    'products.name': 'Product Name',
    'products.sku': 'SKU',
    'products.barcode': 'Barcode',
    'products.category': 'Category',
    'products.brand': 'Brand',
    'products.purchaseCost': 'Purchase Cost',
    'products.salePrice': 'Sale Price',
    'products.stock': 'Stock',
    'products.currentStock': 'Current Stock',
    'products.unit': 'Unit',
    'products.warranty': 'Warranty',
    'products.totalProducts': 'Total Products',
    'products.lowStock': 'Low Stock',
    'products.outOfStock': 'Out of Stock',
    'products.stockValue': 'Stock Value',
    'products.searchPlaceholder': 'Search by name, SKU or barcode...',
    'products.categoryBrand': 'Category/Brand',
    'products.allCategories': 'All Categories',
    'products.allStock': 'All Stock',
    'products.noProducts': 'No products found',
    'products.barcodeScanned': 'Barcode scanned',
    'products.deleted': 'deleted',
    'products.updated': 'Product updated',
    'products.added': 'New product added',
    'products.warrantyNone': 'None',
    'products.days': 'days',
    'products.months': 'months',
    'products.years': 'years',
    
    // POS / Sales
    'pos.title': 'Point of Sale',
    'pos.searchPlaceholder': 'Search by name, SKU or barcode...',
    'pos.scanBarcode': 'Scan barcode',
    'pos.cart': 'Cart',
    'pos.items': 'items',
    'pos.emptyCart': 'Cart is empty',
    'pos.selectCustomer': 'Select Customer',
    'pos.subtotal': 'Subtotal',
    'pos.discount': 'Discount',
    'pos.grandTotal': 'Grand Total',
    'pos.paymentMethod': 'Payment Method',
    'pos.paidAmount': 'Paid Amount',
    'pos.dueAmount': 'Due Amount',
    'pos.notes': 'Notes',
    'pos.notesOptional': 'Notes (optional)',
    'pos.checkout': 'Complete Sale',
    'pos.insufficientStock': 'Insufficient Stock',
    'pos.onlyXInStock': 'Only {count} in stock',
    'pos.saleSuccess': 'Sale successful!',
    'pos.invoiceNo': 'Invoice No',
    'pos.addedToBalance': 'added to balance',
    'pos.productAdded': 'added',
    'pos.productNotFound': 'Product not found',
    'pos.cash': 'Cash',
    'pos.bkash': 'bKash',
    'pos.nagad': 'Nagad',
    'pos.bank': 'Bank',
    'pos.due': 'Due',
    
    // Sales List
    'sales.title': 'Sales List',
    'sales.description': 'View all sales and invoices',
    'sales.todaySales': "Today's Sales",
    'sales.monthlySales': "This Month's Sales",
    'sales.totalDue': 'Total Due',
    'sales.totalInvoices': 'Total Invoices',
    'sales.invoices': 'invoices',
    'sales.searchPlaceholder': 'Search by invoice, customer or phone...',
    'sales.allStatus': 'All Status',
    'sales.paid': 'Paid',
    'sales.partial': 'Partial',
    'sales.walkIn': 'Walk-in',
    'sales.payDue': 'Pay Due',
    'sales.print': 'Print',
    'sales.printing': 'Printing',
    'sales.noSales': 'No sales found',
    'sales.duePaymentSuccess': 'Due payment successful!',
    'sales.invoiceDeleted': 'deleted',
    
    // Invoices
    'invoices.invoiceNo': 'Invoice No',
    'invoices.date': 'Date',
    'invoices.customer': 'Customer',
    'invoices.total': 'Total',
    
    // Settings
    'settings.title': 'Settings',
    'settings.store': 'Store',
    'settings.subscription': 'Subscription',
    'settings.invoice': 'Invoice',
    'settings.warranty': 'Warranty',
    'settings.notifications': 'Notifications',
    'settings.users': 'Users',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.darkMode': 'Dark Mode',
    'settings.lightMode': 'Light Mode',
    'settings.system': 'System',
    'settings.appearance': 'Appearance',
    'settings.languageAndTheme': 'Language & Theme',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search...',
    'common.filter': 'Filter',
    'common.add': 'Add',
    'common.addNew': 'Add New',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.total': 'Total',
    'common.amount': 'Amount',
    'common.paid': 'Paid',
    'common.due': 'Due',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.all': 'All',
    'common.loading': 'Loading...',
    'common.noData': 'No data',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.bengali': 'বাংলা',
    'common.english': 'English',
    'common.goToDashboard': 'Go to Dashboard',
    'common.notifications': 'Notifications',
    'common.clickHere': 'Click here',
    
    // Roles
    'roles.owner': 'Owner',
    'roles.manager': 'Manager',
    'roles.staff': 'Staff',
    
    // Customers
    'customers.title': 'Customers',
    'customers.description': 'Manage customer list',
    'customers.totalCustomers': 'Total Customers',
    'customers.totalDue': 'Total Due',
    'customers.withDue': 'With Due',
    
    // Suppliers
    'suppliers.title': 'Suppliers',
    'suppliers.description': 'Manage supplier list',
    
    // Purchases
    'purchases.title': 'Purchases',
    'purchases.description': 'View and manage all purchases',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
