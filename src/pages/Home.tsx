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
  Rocket
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';

const Home = () => {
  const features = [
    {
      icon: Package,
      title: 'স্টক ম্যানেজমেন্ট',
      description: 'রিয়েল-টাইম স্টক ট্র্যাকিং, লো স্টক অ্যালার্ট এবং অটোমেটিক স্টক আপডেট।'
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
      icon: Shield,
      title: 'ওয়ারেন্টি ট্র্যাকিং',
      description: 'প্রোডাক্ট ওয়ারেন্টি ম্যানেজমেন্ট এবং QR কোড জেনারেশন।'
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">ডিজিটাল বন্ধু</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">লগইন</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">ফ্রি ট্রায়াল</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">বাংলাদেশের #১ ইনভেন্টরি সফটওয়্যার</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              আপনার ব্যবসার হিসাব <br />
              <span className="text-primary">সহজ করুন</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              স্টক, বিক্রয়, ক্রয় এবং কাস্টমার ম্যানেজমেন্ট - সব এক জায়গায়। 
              বাংলায় সম্পূর্ণ ফ্রি ট্রায়াল নিন।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  ফ্রি ট্রায়াল শুরু করুন <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  বিস্তারিত দেখুন
                </Button>
              </a>
            </div>
            
            {/* Quick Benefits */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <benefit.icon className="h-5 w-5 text-primary" />
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">সুযোগ-সুবিধা</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
                <Card className="h-full hover:shadow-lg transition-shadow border-0 bg-card">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">কিভাবে কাজ করে?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                ১
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">রেজিস্ট্রেশন করুন</h3>
              <p className="text-muted-foreground text-sm">
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
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                ২
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">স্টোর সেটআপ করুন</h3>
              <p className="text-muted-foreground text-sm">
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
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                ৩
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">বিক্রয় শুরু করুন</h3>
              <p className="text-muted-foreground text-sm">
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
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                ৪
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ব্যবসা বাড়ান</h3>
              <p className="text-muted-foreground text-sm">
                রিপোর্ট দেখুন, লাভ-ক্ষতি বিশ্লেষণ করুন এবং সিদ্ধান্ত নিন।
              </p>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                এখনই শুরু করুন <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">সাবস্ক্রিপশন প্যাকেজ</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
                <Card className={`h-full relative ${pkg.popular ? 'border-primary shadow-lg scale-105' : 'border'}`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                        জনপ্রিয়
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">৳{pkg.price}</span>
                      <span className="text-muted-foreground">/{pkg.duration}</span>
                    </div>
                    {pkg.discount && (
                      <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {pkg.discount}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/signup" className="block mt-6">
                      <Button 
                        className="w-full" 
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

          <p className="text-center text-muted-foreground mt-8">
            পেমেন্ট মেথড: bKash, Nagad, Rocket
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">সাধারণ জিজ্ঞাসা</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              আমাদের সার্ভিস সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-left hover:no-underline">
                  ডিজিটাল বন্ধু কী ধরনের ব্যবসার জন্য উপযোগী?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  ডিজিটাল বন্ধু সব ধরনের খুচরা দোকান, পাইকারি ব্যবসা, ইলেকট্রনিক্স শপ, মোবাইল শপ, 
                  হার্ডওয়্যার স্টোর, ফার্মেসি এবং অন্যান্য ছোট-মাঝারি ব্যবসার জন্য উপযোগী। 
                  যেকোনো ব্যবসা যেখানে স্টক, বিক্রয় এবং কাস্টমার হিসাব রাখতে হয়।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-left hover:no-underline">
                  ফ্রি ট্রায়াল কিভাবে কাজ করে?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  আপনি সাইন আপ করার পর ৩ দিন ফ্রি ট্রায়াল পাবেন। এই সময়ে আপনি সব ফিচার ব্যবহার করতে পারবেন। 
                  ট্রায়াল শেষে আপনার পছন্দমতো প্যাকেজ কিনতে পারবেন। কোনো ক্রেডিট কার্ড লাগবে না।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-left hover:no-underline">
                  পেমেন্ট কিভাবে করব?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  আপনি bKash, Nagad বা Rocket এর মাধ্যমে পেমেন্ট করতে পারবেন। পেমেন্ট করার পর 
                  ট্রানজেকশন আইডি জমা দিন, আমরা ভেরিফাই করে আপনার সাবস্ক্রিপশন একটিভ করে দেব।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-left hover:no-underline">
                  একটি অ্যাকাউন্টে কতগুলো ডিভাইসে ব্যবহার করা যাবে?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  সব প্যাকেজে আপনি ৩টি ডিভাইসে একসাথে ব্যবহার করতে পারবেন। অর্থাৎ আপনি একই অ্যাকাউন্ট 
                  দিয়ে ফোন, ট্যাবলেট এবং কম্পিউটারে লগইন করতে পারবেন।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-left hover:no-underline">
                  আমার ডেটা কি নিরাপদ?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  হ্যাঁ, আপনার সব ডেটা এনক্রিপ্টেড এবং সুরক্ষিত ক্লাউড সার্ভারে সংরক্ষিত। 
                  আমরা নিয়মিত ব্যাকআপ রাখি এবং আপনার ডেটার নিরাপত্তা নিশ্চিত করি। 
                  শুধুমাত্র আপনি আপনার ডেটা দেখতে পারবেন।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-left hover:no-underline">
                  ইন্টারনেট ছাড়া কি কাজ করবে?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  ডিজিটাল বন্ধু অনলাইন ভিত্তিক সফটওয়্যার, তাই ইন্টারনেট সংযোগ প্রয়োজন। 
                  তবে খুব কম ইন্টারনেট স্পিডেও এটি ভালোভাবে কাজ করে। মোবাইল ডেটা দিয়েও ব্যবহার করা যায়।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-left hover:no-underline">
                  সাপোর্ট কিভাবে পাব?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  আমাদের ফোন নম্বর 01712-022987 এ কল করতে পারেন বা WhatsApp এ মেসেজ দিতে পারেন। 
                  এছাড়াও অ্যাপের ভেতরে সাপোর্ট চ্যাট অপশন আছে। আমরা সকাল ৯টা থেকে রাত ১০টা পর্যন্ত সাপোর্ট দিই।
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-left hover:no-underline">
                  সাবস্ক্রিপশন বাতিল করলে ডেটা কি হারিয়ে যাবে?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  না, সাবস্ক্রিপশন শেষ হলেও আপনার ডেটা ৩০ দিন পর্যন্ত সংরক্ষিত থাকবে। 
                  এই সময়ের মধ্যে রিনিউ করলে সব ডেটা আগের মতোই পাবেন। শুধু নতুন এন্ট্রি করতে পারবেন না।
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">যোগাযোগ করুন</h2>
            <p className="text-muted-foreground">
              যেকোনো প্রশ্ন বা সাহায্যের জন্য আমাদের সাথে যোগাযোগ করুন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">ফোন</h3>
                <p className="text-muted-foreground">01712-022987</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">ইমেইল</h3>
                <p className="text-muted-foreground">support@digitalbondhu.com</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">ঠিকানা</h3>
                <p className="text-muted-foreground">ঢাকা, বাংলাদেশ</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">ডিজিটাল বন্ধু</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                বাংলাদেশের সেরা ইনভেন্টরি ম্যানেজমেন্ট সফটওয়্যার। আপনার ব্যবসার 
                সম্পূর্ণ হিসাব রাখুন সহজে।
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">দ্রুত লিংক</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">সুবিধাসমূহ</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">প্যাকেজ</a></li>
                <li><a href="#faq" className="hover:text-primary transition-colors">জিজ্ঞাসা</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">যোগাযোগ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">অফিস</h4>
              <address className="text-muted-foreground not-italic space-y-2">
                <p>ডিজিটাল বন্ধু</p>
                <p>ঢাকা, বাংলাদেশ</p>
                <p>ফোন: 01712-022987</p>
              </address>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} ডিজিটাল বন্ধু। সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
