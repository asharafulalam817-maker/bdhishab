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
    'dashboard.todaySales': 'আজকের বিক্রয়',
    'dashboard.todayPurchases': 'আজকের ক্রয়',
    'dashboard.totalProducts': 'মোট পণ্য',
    'dashboard.lowStock': 'স্টক কম',
    'dashboard.totalCustomers': 'মোট গ্রাহক',
    'dashboard.totalDue': 'মোট বাকি',
    'dashboard.recentSales': 'সাম্প্রতিক বিক্রয়',
    'dashboard.quickActions': 'দ্রুত কাজ',
    
    // Products
    'products.title': 'পণ্য তালিকা',
    'products.addProduct': 'নতুন পণ্য',
    'products.name': 'পণ্যের নাম',
    'products.sku': 'SKU',
    'products.barcode': 'বারকোড',
    'products.category': 'ক্যাটাগরি',
    'products.brand': 'ব্র্যান্ড',
    'products.purchaseCost': 'ক্রয় মূল্য',
    'products.salePrice': 'বিক্রয় মূল্য',
    'products.stock': 'স্টক',
    'products.unit': 'একক',
    
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
    'common.actions': 'কাজ',
    'common.status': 'স্ট্যাটাস',
    'common.date': 'তারিখ',
    'common.total': 'মোট',
    'common.amount': 'পরিমাণ',
    'common.paid': 'পরিশোধিত',
    'common.due': 'বাকি',
    'common.yes': 'হ্যাঁ',
    'common.no': 'না',
    'common.loading': 'লোড হচ্ছে...',
    'common.noData': 'কোন ডাটা নেই',
    'common.success': 'সফল',
    'common.error': 'ত্রুটি',
    'common.bengali': 'বাংলা',
    'common.english': 'English',
    'common.goToDashboard': 'ড্যাশবোর্ডে যান',
    'common.notifications': 'বিজ্ঞপ্তি',
    
    // Roles
    'roles.owner': 'মালিক',
    'roles.manager': 'ম্যানেজার',
    'roles.staff': 'স্টাফ',
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
    'dashboard.todaySales': "Today's Sales",
    'dashboard.todayPurchases': "Today's Purchases",
    'dashboard.totalProducts': 'Total Products',
    'dashboard.lowStock': 'Low Stock',
    'dashboard.totalCustomers': 'Total Customers',
    'dashboard.totalDue': 'Total Due',
    'dashboard.recentSales': 'Recent Sales',
    'dashboard.quickActions': 'Quick Actions',
    
    // Products
    'products.title': 'Products',
    'products.addProduct': 'Add Product',
    'products.name': 'Product Name',
    'products.sku': 'SKU',
    'products.barcode': 'Barcode',
    'products.category': 'Category',
    'products.brand': 'Brand',
    'products.purchaseCost': 'Purchase Cost',
    'products.salePrice': 'Sale Price',
    'products.stock': 'Stock',
    'products.unit': 'Unit',
    
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
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.total': 'Total',
    'common.amount': 'Amount',
    'common.paid': 'Paid',
    'common.due': 'Due',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.loading': 'Loading...',
    'common.noData': 'No data',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.bengali': 'বাংলা',
    'common.english': 'English',
    'common.goToDashboard': 'Go to Dashboard',
    'common.notifications': 'Notifications',
    
    // Roles
    'roles.owner': 'Owner',
    'roles.manager': 'Manager',
    'roles.staff': 'Staff',
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
