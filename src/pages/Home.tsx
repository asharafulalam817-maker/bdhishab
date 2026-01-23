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

const Home = () => {
  const features = [
    {
      icon: Package,
      title: 'স্টক ম্যানেজমেন্ট',
      description: 'রিয়েল-টাইম স্টক ট্র্যাকিং, লো স্টক অ্যালার্ট এবং অটোমেটিক স্টক আপডেট।'
    },
    {
      icon: Shield,
      title: 'ওয়ারেন্টি ট্র্যাকিং',
      description: 'প্রোডাক্ট ওয়ারেন্টি ম্যানেজমেন্ট এবং QR কোড জেনারেশন।'
    },
    {
      icon: ShoppingCart,
      title: 'POS সিস্টেম',
      description: 'দ্রুত বিক্রয়, বারকোড স্ক্যানিং এবং মাল্টিপল পেমেন্ট মেথড সাপোর্ট।'
    },
    {
      icon: Users,
      title: 'কাস্টমার ম্যানেজমেন্ট',
      description: 'কাস্টমার প্রোফাইল, বাকি হিসাব এবং ক্রয় ইতিহাস ট্র্যাকিং।'
    },
    {
      icon: BarChart3,
      title: 'রিপোর্ট ও অ্যানালিটিক্স',
      description: 'বিক্রয়, লাভ-ক্ষতি এবং ব্যবসার সম্পূর্ণ বিশ্লেষণ।'
    },
    {
      icon: Smartphone,
      title: 'মোবাইল ফ্রেন্ডলি',
      description: 'যেকোনো ডিভাইসে কাজ করুন - ফোন, ট্যাবলেট বা কম্পিউটার।'
    }
  ];

  const packages = [
    {
      name: 'মাসিক',
      price: 77,
      duration: '১ মাস',
      popular: false,
      features: ['সব ফিচার অ্যাক্সেস', '৩টি ডিভাইস', 'ফ্রি সাপোর্ট', 'ডেটা ব্যাকআপ']
    },
    {
      name: '৩ মাস',
      price: 199,
      duration: '৩ মাস',
      popular: true,
      discount: '১৪% সাশ্রয়',
      features: ['সব ফিচার অ্যাক্সেস', '৩টি ডিভাইস', 'প্রায়োরিটি সাপোর্ট', 'ডেটা ব্যাকআপ']
    },
    {
      name: '৬ মাস',
      price: 380,
      duration: '৬ মাস',
      popular: false,
      discount: '১৮% সাশ্রয়',
      features: ['সব ফিচার অ্যাক্সেস', '৩টি ডিভাইস', 'প্রায়োরিটি সাপোর্ট', 'ডেটা ব্যাকআপ']
    },
    {
      name: '১ বছর',
      price: 550,
      duration: '১২ মাস',
      popular: false,
      discount: '৪০% সাশ্রয়',
      features: ['সব ফিচার অ্যাক্সেস', '৩টি ডিভাইস', 'VIP সাপোর্ট', 'ডেটা ব্যাকআপ', 'ফ্রি আপগ্রেড']
    }
  ];

  const benefits = [
    { icon: Clock, text: '৩ দিন ফ্রি ট্রায়াল' },
    { icon: Zap, text: 'সেটআপ ছাড়াই শুরু করুন' },
    { icon: TrendingUp, text: 'ব্যবসা বাড়ান সহজে' },
    { icon: FileText, text: 'অটোমেটিক ইনভয়েস' }
  ];

  return (
    // Force a premium dark look for the public landing page (dashboard keeps user-selected theme)
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl border border-border/60 bg-card/70 backdrop-blur flex items-center justify-center shadow-sm">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">ডিজিটাল বন্ধু</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-base font-bold">লগইন</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="text-base font-bold">ফ্রি ট্রায়াল</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Ambient background */}
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
                <span className="text-sm font-bold text-foreground/90">বাংলাদেশের #১ ইনভেন্টরি সফটওয়্যার</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08]">
                আপনার ব্যবসার হিসাব
                <span className="block text-primary">একদম স্মার্ট করুন</span>
              </h1>

              <p className="text-lg lg:text-2xl font-semibold text-muted-foreground mb-10 max-w-2xl">
                স্টক, বিক্রয়, ক্রয়, কাস্টমার ও রিপোর্ট—সবকিছু এক জায়গায়।
                বাংলায় সহজ UI, দ্রুত POS, আর প্রিমিয়াম এক্সপেরিয়েন্স।
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base font-bold">
                    ফ্রি ট্রায়াল শুরু করুন <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-bold bg-transparent">
                    সুবিধা দেখুন
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
                    <span className="text-sm font-bold text-foreground/90">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mock UI panel (no images, premium glass look) */}
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
                    <span className="text-sm font-bold text-muted-foreground">লাইভ ড্যাশবোর্ড</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                        <p className="text-sm font-bold text-muted-foreground">আজকের বিক্রয়</p>
                        <p className="mt-2 text-2xl font-extrabold">৳ ১২,৮৫০</p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                        <p className="text-sm font-bold text-muted-foreground">লো স্টক</p>
                        <p className="mt-2 text-2xl font-extrabold">৭ টি</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                      <p className="text-sm font-bold text-muted-foreground">দ্রুত অ্যাকশন</p>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        <div className="rounded-xl border border-border/60 bg-card/50 p-3 text-center">
                          <ShoppingCart className="h-5 w-5 text-primary mx-auto" />
                          <p className="mt-2 text-sm font-bold">POS</p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-card/50 p-3 text-center">
                          <Package className="h-5 w-5 text-primary mx-auto" />
                          <p className="mt-2 text-sm font-bold">স্টক</p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-card/50 p-3 text-center">
                          <BarChart3 className="h-5 w-5 text-primary mx-auto" />
                          <p className="mt-2 text-sm font-bold">রিপোর্ট</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                      <p className="text-sm font-bold text-muted-foreground">স্ট্যাটাস</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-bold">সিঙ্ক: অন</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary px-3 py-1 text-sm font-bold">
                          <span className="h-2 w-2 rounded-full bg-primary" /> লাইভ
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
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 tracking-tight">সুযোগ-সুবিধা</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
              আপনার ব্যবসা পরিচালনার জন্য প্রয়োজনীয় সব টুলস এক জায়গায়
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
                    <CardTitle className="text-2xl font-extrabold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-lg font-semibold text-muted-foreground">
                      {feature.description}
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
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 tracking-tight">কিভাবে কাজ করে?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
              মাত্র ৪টি সহজ ধাপে আপনার ব্যবসা ডিজিটাল করুন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold">
                ১
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/15 border border-border/60 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-extrabold mb-2">রেজিস্ট্রেশন করুন</h3>
              <p className="text-muted-foreground text-base font-semibold">
                ফোন নম্বর দিয়ে ফ্রি অ্যাকাউন্ট তৈরি করুন। কোনো ক্রেডিট কার্ড লাগবে না।
              </p>
              {/* Connector Line - Hidden on mobile */}
              <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-primary/30" />
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold">
                ২
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/15 border border-border/60 flex items-center justify-center mx-auto mb-4">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-extrabold mb-2">স্টোর সেটআপ করুন</h3>
              <p className="text-muted-foreground text-base font-semibold">
                আপনার দোকানের নাম ও তথ্য দিন। প্রোডাক্ট ও ক্যাটাগরি যোগ করুন।
              </p>
              <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-primary/30" />
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold">
                ৩
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/15 border border-border/60 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-extrabold mb-2">বিক্রয় শুরু করুন</h3>
              <p className="text-muted-foreground text-base font-semibold">
                POS থেকে বিক্রয় করুন, ইনভয়েস তৈরি করুন এবং স্টক অটো আপডেট হবে।
              </p>
              <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-primary/30" />
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold">
                ৪
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/15 border border-border/60 flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-extrabold mb-2">ব্যবসা বাড়ান</h3>
              <p className="text-muted-foreground text-base font-semibold">
                রিপোর্ট দেখুন, লাভ-ক্ষতি বিশ্লেষণ করুন এবং সিদ্ধান্ত নিন।
              </p>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link to="/signup">
              <Button size="lg" className="gap-2 text-base font-bold">
                এখনই শুরু করুন <ArrowRight className="h-5 w-5" />
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
                <span className="text-sm font-bold text-foreground/90">অ্যাপ ডেমো</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 tracking-tight">আমাদের প্রিমিয়াম ফিচার দেখুন</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
                ড্যাশবোর্ড থেকে শুরু করে POS, রিপোর্ট - সব কিছু এক নজরে
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
                        <span className="text-sm font-bold text-muted-foreground flex-1 text-center">ড্যাশবোর্ড - ডিজিটাল বন্ধু</span>
                      </div>
                      <div className="p-6 lg:p-8 space-y-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-4">
                            <p className="text-xs font-bold text-muted-foreground mb-1">ক্যাশ আছে</p>
                            <p className="text-2xl lg:text-3xl font-extrabold">৳ ৪,৯১,৪৩৫</p>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-green-500/20 to-green-500/5 p-4">
                            <p className="text-xs font-bold text-muted-foreground mb-1">স্টক মূল্য</p>
                            <p className="text-2xl lg:text-3xl font-extrabold">৳ ৬,৪১,৩৩৬</p>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-orange-500/20 to-orange-500/5 p-4">
                            <p className="text-xs font-bold text-muted-foreground mb-1">বাকি পাওনা</p>
                            <p className="text-2xl lg:text-3xl font-extrabold">৳ ২,৬১,৪৮২</p>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-purple-500/20 to-purple-500/5 p-4">
                            <p className="text-xs font-bold text-muted-foreground mb-1">মূলধন</p>
                            <p className="text-2xl lg:text-3xl font-extrabold">৳ ১৩,৯৪,২৫৩</p>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
                          <p className="text-sm font-bold mb-4">আজকের হিসেব 📊</p>
                          <div className="grid grid-cols-5 gap-3">
                            <div className="text-center p-3 rounded-xl border border-border/40">
                              <ShoppingCart className="h-5 w-5 mx-auto text-blue-400 mb-2" />
                              <p className="text-lg font-extrabold">৳ ১৮,৫০০</p>
                              <p className="text-xs text-muted-foreground">ক্রয়</p>
                            </div>
                            <div className="text-center p-3 rounded-xl border border-border/40">
                              <Receipt className="h-5 w-5 mx-auto text-purple-400 mb-2" />
                              <p className="text-lg font-extrabold">৳ ২৫,৬০০</p>
                              <p className="text-xs text-muted-foreground">বিক্রয়</p>
                            </div>
                            <div className="text-center p-3 rounded-xl border border-border/40">
                              <Wallet className="h-5 w-5 mx-auto text-orange-400 mb-2" />
                              <p className="text-lg font-extrabold">৳ ৪,২০০</p>
                              <p className="text-xs text-muted-foreground">বাকি</p>
                            </div>
                            <div className="text-center p-3 rounded-xl border border-border/40">
                              <TrendingUp className="h-5 w-5 mx-auto text-green-400 mb-2" />
                              <p className="text-lg font-extrabold">৳ ৪,৬০০</p>
                              <p className="text-xs text-muted-foreground">লাভ</p>
                            </div>
                            <div className="text-center p-3 rounded-xl border border-border/40">
                              <BarChart3 className="h-5 w-5 mx-auto text-red-400 mb-2" />
                              <p className="text-lg font-extrabold">৳ ২,৫০০</p>
                              <p className="text-xs text-muted-foreground">খরচ</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="rounded-xl border border-blue-500/30 bg-slate-900/80 p-4 text-center hover:scale-105 transition-transform cursor-pointer">
                            <ShoppingCart className="h-8 w-8 mx-auto text-blue-400 mb-2" />
                            <p className="text-lg font-extrabold">ক্রয়</p>
                          </div>
                          <div className="rounded-xl border border-purple-500/30 bg-slate-900/80 p-4 text-center hover:scale-105 transition-transform cursor-pointer">
                            <Receipt className="h-8 w-8 mx-auto text-purple-400 mb-2" />
                            <p className="text-lg font-extrabold">বিক্রয়</p>
                          </div>
                          <div className="rounded-xl border border-emerald-500/30 bg-slate-900/80 p-4 text-center hover:scale-105 transition-transform cursor-pointer">
                            <Package className="h-8 w-8 mx-auto text-emerald-400 mb-2" />
                            <p className="text-lg font-extrabold">স্টক</p>
                          </div>
                          <div className="rounded-xl border border-rose-500/30 bg-slate-900/80 p-4 text-center hover:scale-105 transition-transform cursor-pointer">
                            <Users className="h-8 w-8 mx-auto text-rose-400 mb-2" />
                            <p className="text-lg font-extrabold">গ্রাহক</p>
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
                        <span className="text-sm font-bold text-muted-foreground flex-1 text-center">POS সিস্টেম - দ্রুত বিক্রয়</span>
                      </div>
                      <div className="p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                          <div className="lg:col-span-3 space-y-4">
                            <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="flex-1 rounded-xl border border-border/60 bg-card/50 px-4 py-3 flex items-center gap-2">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">বারকোড স্ক্যান বা সার্চ করুন...</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {[
                                  { name: 'Samsung A54', price: '৳ ৩২,৫০০' },
                                  { name: 'iPhone Case', price: '৳ ৮৫০' },
                                  { name: 'Earbuds Pro', price: '৳ ২,৫০০' },
                                  { name: 'Power Bank', price: '৳ ১,৮০০' },
                                  { name: 'USB Cable', price: '৳ ২৫০' },
                                  { name: 'Charger 25W', price: '৳ ৯৫০' },
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
                                <p className="text-sm font-bold">কার্ট</p>
                                <span className="text-xs font-bold bg-primary/15 text-primary px-2 py-1 rounded-full">৩টি আইটেম</span>
                              </div>
                              <div className="space-y-3">
                                {[
                                  { name: 'Samsung A54', qty: 1, price: '৩২,৫০০' },
                                  { name: 'iPhone Case', qty: 2, price: '১,৭০০' },
                                  { name: 'USB Cable', qty: 3, price: '৭৫০' },
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
                                  <p className="text-lg font-extrabold">মোট</p>
                                  <p className="text-2xl font-extrabold text-primary">৳ ৩৪,৯৫০</p>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="rounded-lg border border-border/60 bg-card/50 p-2 text-center">
                                    <CreditCard className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                                    <p className="text-xs font-bold">bKash</p>
                                  </div>
                                  <div className="rounded-lg border border-primary/50 bg-primary/15 p-2 text-center">
                                    <Wallet className="h-4 w-4 text-primary mx-auto mb-1" />
                                    <p className="text-xs font-bold text-primary">ক্যাশ</p>
                                  </div>
                                  <div className="rounded-lg border border-border/60 bg-card/50 p-2 text-center">
                                    <Receipt className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                                    <p className="text-xs font-bold">বাকি</p>
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
                        <span className="text-sm font-bold text-muted-foreground flex-1 text-center">রিপোর্ট ও অ্যানালিটিক্স</span>
                      </div>
                      <div className="p-6 lg:p-8 space-y-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-green-500/15 to-green-500/5 p-4">
                            <p className="text-xs font-bold text-muted-foreground mb-1">মোট আয়</p>
                            <p className="text-xl lg:text-2xl font-extrabold text-green-500">৳ ৩,৪৫,০০০</p>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-red-500/15 to-red-500/5 p-4">
                            <p className="text-xs font-bold text-muted-foreground mb-1">মোট ব্যয়</p>
                            <p className="text-xl lg:text-2xl font-extrabold text-red-500">৳ ২,৮৫,০০০</p>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/15 to-primary/5 p-4">
                            <p className="text-xs font-bold text-muted-foreground mb-1">নিট লাভ</p>
                            <p className="text-xl lg:text-2xl font-extrabold text-primary">৳ ৬০,০০০</p>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                            <p className="text-xs font-bold text-muted-foreground mb-1">লাভের হার</p>
                            <p className="text-xl lg:text-2xl font-extrabold">১৭.৪%</p>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
                          <div className="flex items-center justify-between mb-6">
                            <p className="text-sm font-bold">মাসিক বিক্রয় চার্ট</p>
                            <div className="flex gap-2">
                              <span className="text-xs font-bold bg-card/60 px-3 py-1 rounded-full border border-border/60">জানুয়ারি ২০২৫</span>
                            </div>
                          </div>
                          <div className="flex items-end gap-2 h-32">
                            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 88].map((height, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div 
                                  className="w-full rounded-t-lg bg-gradient-to-t from-primary/80 to-primary/40"
                                  style={{ height: `${height}%` }}
                                />
                                <span className="text-[10px] text-muted-foreground">{i + 1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
                            <p className="text-sm font-bold mb-4">টপ সেলিং প্রোডাক্ট</p>
                            <div className="space-y-3">
                              {[
                                { name: 'Samsung Galaxy A54', sold: '৪৫টি', revenue: '৳ ১৪,৬২,৫০০' },
                                { name: 'iPhone 14 Pro Max', sold: '২৮টি', revenue: '৳ ৩৯,২০,০০০' },
                                { name: 'Xiaomi Redmi Note 12', sold: '৬২টি', revenue: '৳ ১৫,৫০,০০০' },
                              ].map((product, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                                  <div className="flex items-center gap-3">
                                    <span className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">{i + 1}</span>
                                    <div>
                                      <p className="text-sm font-bold">{product.name}</p>
                                      <p className="text-xs text-muted-foreground">{product.sold} বিক্রি</p>
                                    </div>
                                  </div>
                                  <p className="text-sm font-bold text-primary">{product.revenue}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
                            <p className="text-sm font-bold mb-4">পেমেন্ট মেথড</p>
                            <div className="flex items-center justify-center gap-6">
                              <div className="text-center">
                                <div className="relative h-24 w-24 mx-auto">
                                  <PieChart className="h-24 w-24 text-primary/20" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-extrabold">৬৫%</span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="h-3 w-3 rounded-full bg-primary" />
                                  <span className="text-sm font-bold">ক্যাশ (৬৫%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="h-3 w-3 rounded-full bg-pink-500" />
                                  <span className="text-sm font-bold">bKash (২৫%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="h-3 w-3 rounded-full bg-orange-500" />
                                  <span className="text-sm font-bold">Nagad (১০%)</span>
                                </div>
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
                ফ্রি ট্রায়াল শুরু করুন <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 tracking-tight">সাবস্ক্রিপশন প্যাকেজ</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
              আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন। সব প্যাকেজে ৩ দিন ফ্রি ট্রায়াল!
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
                        জনপ্রিয়
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-extrabold">{pkg.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-extrabold">৳{pkg.price}</span>
                      <span className="text-muted-foreground font-semibold">/{pkg.duration}</span>
                    </div>
                    {pkg.discount && (
                      <span className="inline-block mt-2 text-xs bg-primary/15 text-primary px-3 py-1 rounded-full font-bold">
                        {pkg.discount}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-base font-semibold">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/signup" className="block mt-6">
                      <Button 
                        className="w-full text-base font-bold" 
                        variant={pkg.popular ? 'default' : 'outline'}
                      >
                        শুরু করুন
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-8 text-base font-semibold">
            পেমেন্ট মেথড: bKash, Nagad, Rocket
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 tracking-tight">সাধারণ জিজ্ঞাসা</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
              আমাদের সার্ভিস সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border border-border/60 rounded-2xl px-4 bg-card/45 backdrop-blur">
                <AccordionTrigger className="text-left hover:no-underline">
                  ডিজিটাল বন্ধু কী ধরনের ব্যবসার জন্য উপযোগী?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base font-semibold">
                  ডিজিটাল বন্ধু সব ধরনের খুচরা দোকান, পাইকারি ব্যবসা, ইলেকট্রনিক্স শপ, মোবাইল শপ, 
                  হার্ডওয়্যার স্টোর, ফার্মেসি এবং অন্যান্য ছোট-মাঝারি ব্যবসার জন্য উপযোগী। 
                  যেকোনো ব্যবসা যেখানে স্টক, বিক্রয় এবং কাস্টমার হিসাব রাখতে হয়।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-border/60 rounded-2xl px-4 bg-card/45 backdrop-blur">
                <AccordionTrigger className="text-left hover:no-underline">
                  ফ্রি ট্রায়াল কিভাবে কাজ করে?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base font-semibold">
                  আপনি সাইন আপ করার পর ৩ দিন ফ্রি ট্রায়াল পাবেন। এই সময়ে আপনি সব ফিচার ব্যবহার করতে পারবেন। 
                  ট্রায়াল শেষে আপনার পছন্দমতো প্যাকেজ কিনতে পারবেন। কোনো ক্রেডিট কার্ড লাগবে না।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-border/60 rounded-2xl px-4 bg-card/45 backdrop-blur">
                <AccordionTrigger className="text-left hover:no-underline">
                  পেমেন্ট কিভাবে করব?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base font-semibold">
                  আপনি bKash, Nagad বা Rocket এর মাধ্যমে পেমেন্ট করতে পারবেন। পেমেন্ট করার পর 
                  ট্রানজেকশন আইডি জমা দিন, আমরা ভেরিফাই করে আপনার সাবস্ক্রিপশন একটিভ করে দেব।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border/60 rounded-2xl px-4 bg-card/45 backdrop-blur">
                <AccordionTrigger className="text-left hover:no-underline">
                  একটি অ্যাকাউন্টে কতগুলো ডিভাইসে ব্যবহার করা যাবে?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base font-semibold">
                  সব প্যাকেজে আপনি ৩টি ডিভাইসে একসাথে ব্যবহার করতে পারবেন। অর্থাৎ আপনি একই অ্যাকাউন্ট 
                  দিয়ে ফোন, ট্যাবলেট এবং কম্পিউটারে লগইন করতে পারবেন।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-border/60 rounded-2xl px-4 bg-card/45 backdrop-blur">
                <AccordionTrigger className="text-left hover:no-underline">
                  আমার ডেটা কি নিরাপদ?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base font-semibold">
                  হ্যাঁ, আপনার সব ডেটা এনক্রিপ্টেড এবং সুরক্ষিত ক্লাউড সার্ভারে সংরক্ষিত। 
                  আমরা নিয়মিত ব্যাকআপ রাখি এবং আপনার ডেটার নিরাপত্তা নিশ্চিত করি। 
                  শুধুমাত্র আপনি আপনার ডেটা দেখতে পারবেন।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-border/60 rounded-2xl px-4 bg-card/45 backdrop-blur">
                <AccordionTrigger className="text-left hover:no-underline">
                  ইন্টারনেট ছাড়া কি কাজ করবে?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base font-semibold">
                  ডিজিটাল বন্ধু অনলাইন ভিত্তিক সফটওয়্যার, তাই ইন্টারনেট সংযোগ প্রয়োজন। 
                  তবে খুব কম ইন্টারনেট স্পিডেও এটি ভালোভাবে কাজ করে। মোবাইল ডেটা দিয়েও ব্যবহার করা যায়।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border border-border/60 rounded-2xl px-4 bg-card/45 backdrop-blur">
                <AccordionTrigger className="text-left hover:no-underline">
                  সাপোর্ট কিভাবে পাব?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base font-semibold">
                  আমাদের ফোন নম্বর 01712-022987 এ কল করতে পারেন বা WhatsApp এ মেসেজ দিতে পারেন। 
                  এছাড়াও অ্যাপের ভেতরে সাপোর্ট চ্যাট অপশন আছে। আমরা সকাল ৯টা থেকে রাত ১০টা পর্যন্ত সাপোর্ট দিই।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border border-border/60 rounded-2xl px-4 bg-card/45 backdrop-blur">
                <AccordionTrigger className="text-left hover:no-underline">
                  সাবস্ক্রিপশন বাতিল করলে ডেটা কি হারিয়ে যাবে?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base font-semibold">
                  না, সাবস্ক্রিপশন শেষ হলেও আপনার ডেটা ৩০ দিন পর্যন্ত সংরক্ষিত থাকবে। 
                  এই সময়ের মধ্যে রিনিউ করলে সব ডেটা আগের মতোই পাবেন। শুধু নতুন এন্ট্রি করতে পারবেন না।
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 tracking-tight">যোগাযোগ করুন</h2>
            <p className="text-lg text-muted-foreground font-semibold">
              যেকোনো প্রশ্ন বা সাহায্যের জন্য আমাদের সাথে যোগাযোগ করুন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center border border-border/60 bg-card/45 backdrop-blur">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/15 border border-border/60 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-extrabold mb-2">ফোন</h3>
                <p className="text-muted-foreground text-base font-semibold">01712-022987</p>
              </CardContent>
            </Card>

            <Card className="text-center border border-border/60 bg-card/45 backdrop-blur">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/15 border border-border/60 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-extrabold mb-2">ইমেইল</h3>
                <p className="text-muted-foreground text-base font-semibold">support@digitalbondhu.com</p>
              </CardContent>
            </Card>

            <Card className="text-center border border-border/60 bg-card/45 backdrop-blur">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/15 border border-border/60 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-extrabold mb-2">ঠিকানা</h3>
                <p className="text-muted-foreground text-base font-semibold">ঢাকা, বাংলাদেশ</p>
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
                <span className="text-lg font-extrabold">ডিজিটাল বন্ধু</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                বাংলাদেশের সেরা ইনভেন্টরি ম্যানেজমেন্ট সফটওয়্যার। আপনার ব্যবসার 
                সম্পূর্ণ হিসাব রাখুন সহজে।
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-extrabold mb-4">দ্রুত লিংক</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">সুবিধাসমূহ</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">প্যাকেজ</a></li>
                <li><a href="#faq" className="hover:text-primary transition-colors">জিজ্ঞাসা</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">যোগাযোগ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-extrabold mb-4">অফিস</h4>
              <address className="text-muted-foreground not-italic space-y-2">
                <p>ডিজিটাল বন্ধু</p>
                <p>ঢাকা, বাংলাদেশ</p>
                <p>ফোন: 01712-022987</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-border/60 mt-8 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} ডিজিটাল বন্ধু। সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
