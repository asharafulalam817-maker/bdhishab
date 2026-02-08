import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Shield, 
  Smartphone,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
  Zap,
  TrendingUp,
  FileText,
  UserPlus,
  Store,
  Rocket,
  CreditCard,
  Receipt,
  Wallet,
  PieChart
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { motion } from 'framer-motion';
import { AppDownloadSection } from '@/components/pwa/AppDownloadSection';
import { useLanguage } from '@/contexts/LanguageContext';

const Home = () => {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: Package,
      titleKey: 'home.feature1Title',
      descKey: 'home.feature1Desc'
    },
    {
      icon: Shield,
      titleKey: 'home.feature2Title',
      descKey: 'home.feature2Desc'
    },
    {
      icon: ShoppingCart,
      titleKey: 'home.feature3Title',
      descKey: 'home.feature3Desc'
    },
    {
      icon: Users,
      titleKey: 'home.feature4Title',
      descKey: 'home.feature4Desc'
    },
    {
      icon: BarChart3,
      titleKey: 'home.feature5Title',
      descKey: 'home.feature5Desc'
    },
    {
      icon: Smartphone,
      titleKey: 'home.feature6Title',
      descKey: 'home.feature6Desc'
    }
  ];

  const packages = [
    {
      nameKey: 'home.monthly',
      price: 77,
      durationKey: 'home.month',
      popular: false,
      featuresKeys: ['home.allFeatures', 'home.threeDevices', 'home.freeSupport', 'home.dataBackup']
    },
    {
      nameKey: 'home.threeMonths',
      price: 199,
      durationKey: 'home.threeMonths',
      popular: true,
      discountKey: 'home.save14',
      featuresKeys: ['home.allFeatures', 'home.threeDevices', 'home.prioritySupport', 'home.dataBackup']
    },
    {
      nameKey: 'home.sixMonths',
      price: 380,
      durationKey: 'home.sixMonths',
      popular: false,
      discountKey: 'home.save18',
      featuresKeys: ['home.allFeatures', 'home.threeDevices', 'home.prioritySupport', 'home.dataBackup']
    },
    {
      nameKey: 'home.oneYear',
      price: 550,
      durationKey: 'home.oneYear',
      popular: false,
      discountKey: 'home.save40',
      featuresKeys: ['home.allFeatures', 'home.threeDevices', 'home.vipSupport', 'home.dataBackup', 'home.freeUpgrade']
    }
  ];

  const benefits = [
    { icon: Clock, textKey: 'home.benefit1' },
    { icon: Zap, textKey: 'home.benefit2' },
    { icon: TrendingUp, textKey: 'home.benefit3' },
    { icon: FileText, textKey: 'home.benefit4' }
  ];

  const faqItems = [
    { qKey: 'home.faq1Q', aKey: 'home.faq1A' },
    { qKey: 'home.faq2Q', aKey: 'home.faq2A' },
    { qKey: 'home.faq3Q', aKey: 'home.faq3A' },
    { qKey: 'home.faq4Q', aKey: 'home.faq4A' },
    { qKey: 'home.faq5Q', aKey: 'home.faq5A' },
    { qKey: 'home.faq6Q', aKey: 'home.faq6A' },
    { qKey: 'home.faq7Q', aKey: 'home.faq7A' },
    { qKey: 'home.faq8Q', aKey: 'home.faq8A' },
  ];

  const steps = [
    { icon: UserPlus, titleKey: 'home.step1Title', descKey: 'home.step1Desc', num: language === 'bn' ? '১' : '1' },
    { icon: Store, titleKey: 'home.step2Title', descKey: 'home.step2Desc', num: language === 'bn' ? '২' : '2' },
    { icon: ShoppingCart, titleKey: 'home.step3Title', descKey: 'home.step3Desc', num: language === 'bn' ? '৩' : '3' },
    { icon: Rocket, titleKey: 'home.step4Title', descKey: 'home.step4Desc', num: language === 'bn' ? '৪' : '4' },
  ];

  // Demo data with translations
  const demoStats = language === 'bn' ? {
    cash: '৳ ৪,৯১,৪৩৫',
    stock: '৳ ৬,৪১,৩৩৬',
    due: '৳ ২,৬১,৪৮২',
    capital: '৳ ১৩,৯৪,২৫৩',
  } : {
    cash: '৳ 4,91,435',
    stock: '৳ 6,41,336',
    due: '৳ 2,61,482',
    capital: '৳ 13,94,253',
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl border border-border/60 bg-card/70 backdrop-blur flex items-center justify-center shadow-sm">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">{t('app.name')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-base font-bold">{t('home.login')}</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="text-base font-bold">{t('home.freeTrial')}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
          <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-48 right-[-120px] h-[520px] w-[520px] rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.18),_transparent_55%)]" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 backdrop-blur mb-6">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground/90">{t('home.topSoftware')}</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08]">
                {t('home.heroTitle1')}
                <span className="block text-primary">{t('home.heroTitle2')}</span>
              </h1>

              <p className="text-lg lg:text-2xl font-semibold text-muted-foreground mb-10 max-w-2xl">
                {t('home.heroDescription')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base font-bold">
                    {t('home.startFreeTrial')} <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-bold bg-transparent">
                    {t('home.viewFeatures')}
                  </Button>
                </a>
              </div>

              {/* Quick Benefits */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-3 py-3 backdrop-blur"
                  >
                    <benefit.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold text-foreground/90">{t(benefit.textKey)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mock UI panel */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="lg:col-span-5"
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-3xl bg-primary/20 blur-2xl" />
                <div className="relative rounded-3xl border border-border/60 bg-card/50 backdrop-blur-xl shadow-lg overflow-hidden">
                  <div className="p-5 border-b border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-muted" />
                      <div className="h-2.5 w-2.5 rounded-full bg-muted" />
                      <div className="h-2.5 w-2.5 rounded-full bg-muted" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">{t('home.liveDashboard')}</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-blue-500/15 to-blue-500/5 p-3">
                        <p className="text-xs font-bold text-muted-foreground">{t('dashboard.totalCash')}</p>
                        <p className="mt-1 text-lg font-extrabold">{demoStats.cash}</p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-green-500/15 to-green-500/5 p-3">
                        <p className="text-xs font-bold text-muted-foreground">{t('dashboard.totalStockValue')}</p>
                        <p className="mt-1 text-lg font-extrabold">{demoStats.stock}</p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-orange-500/15 to-orange-500/5 p-3">
                        <p className="text-xs font-bold text-muted-foreground">{t('dashboard.totalReceivables')}</p>
                        <p className="mt-1 text-lg font-extrabold">{demoStats.due}</p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-purple-500/15 to-purple-500/5 p-3">
                        <p className="text-xs font-bold text-muted-foreground">{t('dashboard.totalCapital')}</p>
                        <p className="mt-1 text-lg font-extrabold">{demoStats.capital}</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                      <p className="text-sm font-bold text-muted-foreground">{t('home.quickAction')}</p>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        <div className="rounded-xl border border-border/60 bg-card/50 p-3 text-center">
                          <ShoppingCart className="h-5 w-5 text-primary mx-auto" />
                          <p className="mt-2 text-sm font-bold">POS</p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-card/50 p-3 text-center">
                          <Package className="h-5 w-5 text-primary mx-auto" />
                          <p className="mt-2 text-sm font-bold">{t('quickAction.stock')}</p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-card/50 p-3 text-center">
                          <BarChart3 className="h-5 w-5 text-primary mx-auto" />
                          <p className="mt-2 text-sm font-bold">{t('nav.reports')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                      <p className="text-sm font-bold text-muted-foreground">{t('common.status')}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-bold">{t('home.sync')}</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary px-3 py-1 text-sm font-bold">
                          <span className="h-2 w-2 rounded-full bg-primary" /> {t('home.live')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 tracking-tight">{t('home.featuresTitle')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
              {t('home.featuresDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border border-border/60 bg-card/40 backdrop-blur hover:bg-card/55 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4 border border-border/60">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-extrabold">{t(feature.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-lg font-semibold text-muted-foreground">
                      {t(feature.descKey)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 tracking-tight">{t('home.howItWorksTitle')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
              {t('home.howItWorksDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold">
                  {step.num}
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/15 border border-border/60 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-extrabold mb-2">{t(step.titleKey)}</h3>
                <p className="text-muted-foreground text-base font-semibold">
                  {t(step.descKey)}
                </p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-primary/30" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/signup">
              <Button size="lg" className="gap-2 text-base font-bold">
                {t('home.startNow')} <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* App Demo Carousel Section */}
      <section id="demo" className="py-20 bg-muted/20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 backdrop-blur mb-4">
                <Smartphone className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground/90">{t('home.appDemo')}</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 tracking-tight">{t('home.seePremiumFeatures')}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
                {t('home.demoDescription')}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {/* Dashboard Demo */}
                <CarouselItem className="pl-2 md:pl-4 md:basis-4/5 lg:basis-3/4">
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-3xl bg-primary/15 blur-2xl" />
                    <div className="relative rounded-3xl border border-border/60 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                      <div className="p-4 border-b border-border/60 flex items-center gap-3 bg-background/40">
                        <div className="flex gap-1.5">
                          <div className="h-3 w-3 rounded-full bg-red-500/80" />
                          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                          <div className="h-3 w-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-sm font-bold text-muted-foreground flex-1 text-center">{t('nav.dashboard')} - {t('app.name')}</span>
                      </div>
                      <div className="p-6 lg:p-8 space-y-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-4">
                            <p className="text-xs font-bold text-muted-foreground mb-1">{t('dashboard.totalCash')}</p>
                            <p className="text-2xl lg:text-3xl font-extrabold">{demoStats.cash}</p>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-green-500/20 to-green-500/5 p-4">
                            <p className="text-xs font-bold text-muted-foreground mb-1">{t('dashboard.totalStockValue')}</p>
                            <p className="text-2xl lg:text-3xl font-extrabold">{demoStats.stock}</p>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-orange-500/20 to-orange-500/5 p-4">
                            <p className="text-xs font-bold text-muted-foreground mb-1">{t('dashboard.totalReceivables')}</p>
                            <p className="text-2xl lg:text-3xl font-extrabold">{demoStats.due}</p>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-purple-500/20 to-purple-500/5 p-4">
                            <p className="text-xs font-bold text-muted-foreground mb-1">{t('dashboard.totalCapital')}</p>
                            <p className="text-2xl lg:text-3xl font-extrabold">{demoStats.capital}</p>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
                          <p className="text-sm font-bold mb-4">{t('home.todaysAccount')}</p>
                          <div className="grid grid-cols-5 gap-3">
                            <div className="text-center p-3 rounded-xl border border-border/40">
                              <ShoppingCart className="h-5 w-5 mx-auto text-blue-400 mb-2" />
                              <p className="text-lg font-extrabold">{language === 'bn' ? '৳ ১৮,৫০০' : '৳ 18,500'}</p>
                              <p className="text-xs text-muted-foreground">{t('quickAction.purchase')}</p>
                            </div>
                            <div className="text-center p-3 rounded-xl border border-border/40">
                              <Receipt className="h-5 w-5 mx-auto text-purple-400 mb-2" />
                              <p className="text-lg font-extrabold">{language === 'bn' ? '৳ ২৫,৬০০' : '৳ 25,600'}</p>
                              <p className="text-xs text-muted-foreground">{t('quickAction.sale')}</p>
                            </div>
                            <div className="text-center p-3 rounded-xl border border-border/40">
                              <Wallet className="h-5 w-5 mx-auto text-orange-400 mb-2" />
                              <p className="text-lg font-extrabold">{language === 'bn' ? '৳ ৪,২০০' : '৳ 4,200'}</p>
                              <p className="text-xs text-muted-foreground">{t('common.due')}</p>
                            </div>
                            <div className="text-center p-3 rounded-xl border border-border/40">
                              <TrendingUp className="h-5 w-5 mx-auto text-green-400 mb-2" />
                              <p className="text-lg font-extrabold">{language === 'bn' ? '৳ ৪,৬০০' : '৳ 4,600'}</p>
                              <p className="text-xs text-muted-foreground">{t('dashboard.profit')}</p>
                            </div>
                            <div className="text-center p-3 rounded-xl border border-border/40">
                              <BarChart3 className="h-5 w-5 mx-auto text-red-400 mb-2" />
                              <p className="text-lg font-extrabold">{language === 'bn' ? '৳ ২,৫০০' : '৳ 2,500'}</p>
                              <p className="text-xs text-muted-foreground">{t('dashboard.expenses')}</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="rounded-xl border border-blue-500/30 bg-slate-900/80 p-4 text-center hover:scale-105 transition-transform cursor-pointer">
                            <ShoppingCart className="h-8 w-8 mx-auto text-blue-400 mb-2" />
                            <p className="text-lg font-extrabold">{t('quickAction.purchase')}</p>
                          </div>
                          <div className="rounded-xl border border-purple-500/30 bg-slate-900/80 p-4 text-center hover:scale-105 transition-transform cursor-pointer">
                            <Receipt className="h-8 w-8 mx-auto text-purple-400 mb-2" />
                            <p className="text-lg font-extrabold">{t('quickAction.sale')}</p>
                          </div>
                          <div className="rounded-xl border border-emerald-500/30 bg-slate-900/80 p-4 text-center hover:scale-105 transition-transform cursor-pointer">
                            <Package className="h-8 w-8 mx-auto text-emerald-400 mb-2" />
                            <p className="text-lg font-extrabold">{t('quickAction.stock')}</p>
                          </div>
                          <div className="rounded-xl border border-rose-500/30 bg-slate-900/80 p-4 text-center hover:scale-105 transition-transform cursor-pointer">
                            <Users className="h-8 w-8 mx-auto text-rose-400 mb-2" />
                            <p className="text-lg font-extrabold">{t('quickAction.customer')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>

                {/* POS Demo */}
                <CarouselItem className="pl-2 md:pl-4 md:basis-4/5 lg:basis-3/4">
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-3xl bg-primary/15 blur-2xl" />
                    <div className="relative rounded-3xl border border-border/60 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                      <div className="p-4 border-b border-border/60 flex items-center gap-3 bg-background/40">
                        <div className="flex gap-1.5">
                          <div className="h-3 w-3 rounded-full bg-red-500/80" />
                          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                          <div className="h-3 w-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-sm font-bold text-muted-foreground flex-1 text-center">{t('home.posSystem')}</span>
                      </div>
                      <div className="p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                          <div className="lg:col-span-3 space-y-4">
                            <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="flex-1 rounded-xl border border-border/60 bg-card/50 px-4 py-3 flex items-center gap-2">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">{t('home.barcodeSearch')}</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {[
                                  { name: 'Samsung A54', price: language === 'bn' ? '৳ ৩২,৫০০' : '৳ 32,500' },
                                  { name: 'iPhone Case', price: language === 'bn' ? '৳ ৮৫০' : '৳ 850' },
                                  { name: 'Earbuds Pro', price: language === 'bn' ? '৳ ২,৫০০' : '৳ 2,500' },
                                  { name: 'Power Bank', price: language === 'bn' ? '৳ ১,৮০০' : '৳ 1,800' },
                                  { name: 'USB Cable', price: language === 'bn' ? '৳ ২৫০' : '৳ 250' },
                                  { name: 'Charger 25W', price: language === 'bn' ? '৳ ৯৫০' : '৳ 950' },
                                ].map((product, i) => (
                                  <div key={i} className="rounded-xl border border-border/60 bg-card/50 p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                    <div className="h-10 w-10 rounded-lg bg-primary/15 mx-auto mb-2 flex items-center justify-center">
                                      <Package className="h-5 w-5 text-primary" />
                                    </div>
                                    <p className="text-sm font-bold truncate">{product.name}</p>
                                    <p className="text-xs text-primary font-bold mt-1">{product.price}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="lg:col-span-2">
                            <div className="rounded-xl border border-border/60 bg-background/40 p-5 space-y-4">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-bold">{t('pos.cart')}</p>
                                <span className="text-xs font-bold bg-primary/15 text-primary px-2 py-1 rounded-full">3{t('home.xItems')}</span>
                              </div>
                              <div className="space-y-3">
                                {[
                                  { name: 'Samsung A54', qty: 1, price: language === 'bn' ? '৩২,৫০০' : '32,500' },
                                  { name: 'iPhone Case', qty: 2, price: language === 'bn' ? '১,৭০০' : '1,700' },
                                  { name: 'USB Cable', qty: 3, price: language === 'bn' ? '৭৫০' : '750' },
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                                    <div>
                                      <p className="text-sm font-bold">{item.name}</p>
                                      <p className="text-xs text-muted-foreground">x{item.qty}</p>
                                    </div>
                                    <p className="text-sm font-bold">৳ {item.price}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="pt-3 border-t border-border/60">
                                <div className="flex items-center justify-between mb-4">
                                  <p className="text-lg font-extrabold">{t('common.total')}</p>
                                  <p className="text-2xl font-extrabold text-primary">{language === 'bn' ? '৳ ৩৪,৯৫০' : '৳ 34,950'}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="rounded-lg border border-border/60 bg-card/50 p-2 text-center">
                                    <CreditCard className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                                    <p className="text-xs font-bold">bKash</p>
                                  </div>
                                  <div className="rounded-lg border border-primary/50 bg-primary/15 p-2 text-center">
                                    <Wallet className="h-4 w-4 text-primary mx-auto mb-1" />
                                    <p className="text-xs font-bold text-primary">{t('pos.cash')}</p>
                                  </div>
                                  <div className="rounded-lg border border-border/60 bg-card/50 p-2 text-center">
                                    <Receipt className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                                    <p className="text-xs font-bold">{t('pos.due')}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>

                {/* Reports Demo */}
                <CarouselItem className="pl-2 md:pl-4 md:basis-4/5 lg:basis-3/4">
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-3xl bg-primary/15 blur-2xl" />
                    <div className="relative rounded-3xl border border-border/60 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                      <div className="p-4 border-b border-border/60 flex items-center gap-3 bg-background/40">
                        <div className="flex gap-1.5">
                          <div className="h-3 w-3 rounded-full bg-red-500/80" />
                          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                          <div className="h-3 w-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-sm font-bold text-muted-foreground flex-1 text-center">{t('home.reports')}</span>
                      </div>
                      <div className="p-6 lg:p-8 space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-extrabold">{t('home.monthlyReport')}</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-4 text-center">
                            <p className="text-xs font-bold text-muted-foreground mb-1">{t('home.totalSales')}</p>
                            <p className="text-2xl font-extrabold">{language === 'bn' ? '৳ ৪,৮৫,৬০০' : '৳ 4,85,600'}</p>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-purple-500/20 to-purple-500/5 p-4 text-center">
                            <p className="text-xs font-bold text-muted-foreground mb-1">{t('home.totalPurchase')}</p>
                            <p className="text-2xl font-extrabold">{language === 'bn' ? '৳ ৩,৪২,০০০' : '৳ 3,42,000'}</p>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-green-500/20 to-green-500/5 p-4 text-center">
                            <p className="text-xs font-bold text-muted-foreground mb-1">{t('home.grossProfit')}</p>
                            <p className="text-2xl font-extrabold">{language === 'bn' ? '৳ ১,৪৩,৬০০' : '৳ 1,43,600'}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="rounded-xl border border-border/60 bg-background/40 p-4 text-center">
                            <p className="text-2xl font-extrabold text-primary">{language === 'bn' ? '২৯.৫%' : '29.5%'}</p>
                            <p className="text-xs text-muted-foreground">{t('home.profitMargin')}</p>
                          </div>
                          <div className="rounded-xl border border-border/60 bg-background/40 p-4 text-center">
                            <p className="text-2xl font-extrabold text-primary">{language === 'bn' ? '১৫৬' : '156'}</p>
                            <p className="text-xs text-muted-foreground">{t('home.invoiceCount')}</p>
                          </div>
                          <div className="rounded-xl border border-border/60 bg-background/40 p-4 text-center">
                            <p className="text-2xl font-extrabold text-primary">{language === 'bn' ? '৳ ৩,১১৩' : '৳ 3,113'}</p>
                            <p className="text-xs text-muted-foreground">{t('home.averageSale')}</p>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
                          <p className="text-sm font-bold mb-4">{t('home.paymentSummary')}</p>
                          <div className="flex items-center gap-6">
                            <div className="relative h-24 w-24">
                              <div className="absolute inset-0 rounded-full border-8 border-primary/20" />
                              <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary border-r-primary rotate-45" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-extrabold">{language === 'bn' ? '৬৫%' : '65%'}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-primary" />
                                <span className="text-sm font-bold">{t('pos.cash')} ({language === 'bn' ? '৬৫%' : '65%'})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-pink-500" />
                                <span className="text-sm font-bold">bKash ({language === 'bn' ? '২৫%' : '25%'})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-orange-500" />
                                <span className="text-sm font-bold">Nagad ({language === 'bn' ? '১০%' : '10%'})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              
              <div className="flex items-center justify-center gap-4 mt-8">
                <CarouselPrevious className="static translate-y-0 h-12 w-12 border-border/60 bg-card/50 backdrop-blur hover:bg-card/70" />
                <CarouselNext className="static translate-y-0 h-12 w-12 border-border/60 bg-card/50 backdrop-blur hover:bg-card/70" />
              </div>
            </Carousel>
          </motion.div>

          <div className="text-center mt-12">
            <Link to="/signup">
              <Button size="lg" className="gap-2 text-base font-bold">
                {t('home.startFreeTrial')} <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 tracking-tight">{t('home.pricingTitle')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
              {t('home.pricingDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`h-full relative border border-border/60 bg-card/45 backdrop-blur transition-all hover:shadow-lg hover:bg-card/60 ${
                    pkg.popular ? 'ring-1 ring-primary/40 shadow-lg lg:scale-[1.03]' : ''
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-bold">
                        {t('home.popular')}
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-extrabold">{t(pkg.nameKey)}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-extrabold">৳{pkg.price}</span>
                      <span className="text-muted-foreground font-semibold">/{t(pkg.durationKey)}</span>
                    </div>
                    {pkg.discountKey && (
                      <span className="inline-block mt-2 text-xs bg-primary/15 text-primary px-3 py-1 rounded-full font-bold">
                        {t(pkg.discountKey)}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {pkg.featuresKeys.map((featureKey, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-base font-semibold">{t(featureKey)}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/signup" className="block mt-6">
                      <Button 
                        className="w-full text-base font-bold" 
                        variant={pkg.popular ? 'default' : 'outline'}
                      >
                        {t('home.getStarted')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-8 text-base font-semibold">
            {t('home.paymentMethods')}
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 tracking-tight">{t('home.faqTitle')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
              {t('home.faqDescription')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`} className="border border-border/60 rounded-2xl px-4 bg-card/45 backdrop-blur">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {t(faq.qKey)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base font-semibold">
                    {t(faq.aKey)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <AppDownloadSection variant="full" />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 tracking-tight">{t('home.contactTitle')}</h2>
            <p className="text-lg text-muted-foreground font-semibold">
              {t('home.contactDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center border border-border/60 bg-card/45 backdrop-blur">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/15 border border-border/60 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-extrabold mb-2">{t('home.phone')}</h3>
                <p className="text-muted-foreground text-base font-semibold">01712-022987</p>
              </CardContent>
            </Card>

            <Card className="text-center border border-border/60 bg-card/45 backdrop-blur">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/15 border border-border/60 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-extrabold mb-2">{t('home.email')}</h3>
                <p className="text-muted-foreground text-base font-semibold">support@digitalbondhu.com</p>
              </CardContent>
            </Card>

            <Card className="text-center border border-border/60 bg-card/45 backdrop-blur">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/15 border border-border/60 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-extrabold mb-2">{t('home.address')}</h3>
                <p className="text-muted-foreground text-base font-semibold">{t('home.addressValue')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-6 w-6 text-primary" />
                <span className="text-lg font-extrabold">{t('app.name')}</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                {t('home.footerDescription')}
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-extrabold mb-4">{t('home.quickLinks')}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">{t('home.features')}</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">{t('home.packages')}</a></li>
                <li><a href="#faq" className="hover:text-primary transition-colors">{t('home.faq')}</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">{t('home.contact')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-extrabold mb-4">{t('home.legal')}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">{t('home.terms')}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t('home.privacy')}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t('home.refund')}</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {t('home.copyright')}
            </p>
            <p className="text-muted-foreground text-sm">
              {t('home.madeWithLove')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
