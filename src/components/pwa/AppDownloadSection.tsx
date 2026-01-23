import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Smartphone, Monitor, Apple, Share2, PlusSquare, CheckCircle2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface AppDownloadSectionProps {
  variant?: 'full' | 'compact';
}

export const AppDownloadSection = ({ variant = 'full' }: AppDownloadSectionProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const android = /android/.test(userAgent);
    const desktop = !ios && !android;
    
    setIsIOS(ios);
    setIsAndroid(android);
    setIsDesktop(desktop);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        toast.success('অ্যাপ সফলভাবে ইনস্টল হয়েছে!');
      }
      setDeferredPrompt(null);
    } else {
      // Show manual instructions
      toast.info('ব্রাউজারের মেনু থেকে "Install App" বা "Add to Home Screen" সিলেক্ট করুন');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    toast.success('লিংক কপি হয়েছে! মোবাইলে পেস্ট করে ওপেন করুন');
  };

  if (isInstalled) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <div>
            <p className="font-bold text-foreground">অ্যাপ ইনস্টল করা আছে!</p>
            <p className="text-sm text-muted-foreground">আপনি ইতিমধ্যে ডিজিটাল বন্ধু অ্যাপ ইনস্টল করেছেন।</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className="border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-lg">📱 অ্যাপ ডাউনলোড করুন</h3>
              <p className="text-sm text-muted-foreground mt-1">
                মোবাইলে দ্রুত অ্যাক্সেসের জন্য হোম স্ক্রিনে যোগ করুন
              </p>
              
              {isIOS ? (
                <div className="mt-3 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-semibold mb-2 flex items-center gap-2">
                    <Apple className="h-4 w-4" /> iPhone/iPad এ ইনস্টল:
                  </p>
                  <ol className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">১</span>
                      Safari এর <Share2 className="h-3 w-3 inline mx-1" /> Share বাটনে ট্যাপ করুন
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">২</span>
                      <PlusSquare className="h-3 w-3 inline" /> "Add to Home Screen" ট্যাপ করুন
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">৩</span>
                      "Add" বাটনে ট্যাপ করুন
                    </li>
                  </ol>
                </div>
              ) : isAndroid ? (
                <div className="mt-3 space-y-2">
                  {deferredPrompt ? (
                    <Button onClick={handleInstall} className="w-full gap-2" size="sm">
                      <Download className="h-4 w-4" />
                      এখনই ইনস্টল করুন
                    </Button>
                  ) : (
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      <p className="font-semibold mb-2 flex items-center gap-2">
                        <Smartphone className="h-4 w-4" /> Android এ ইনস্টল:
                      </p>
                      <ol className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">১</span>
                          Chrome মেনু (⋮) ট্যাপ করুন
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">২</span>
                          "Install App" বা "Add to Home Screen" ট্যাপ করুন
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-semibold mb-2 flex items-center gap-2">
                      <Monitor className="h-4 w-4" /> ডেস্কটপে ইনস্টল:
                    </p>
                    <p className="text-muted-foreground mb-2">
                      Chrome/Edge এড্রেস বারের ডানদিকে <Download className="h-3 w-3 inline mx-1" /> আইকনে ক্লিক করুন
                    </p>
                    <p className="text-xs text-muted-foreground">
                      অথবা মেনু থেকে "Install ডিজিটাল বন্ধু" সিলেক্ট করুন
                    </p>
                  </div>
                  <Button onClick={copyLink} variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    মোবাইলে পাঠাতে লিংক কপি করুন
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant for Home page
  return (
    <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl mb-4">
              <Download className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">📱 অ্যাপ ডাউনলোড করুন</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
              ওয়েবসাইট থেকেই আপনার মোবাইলে অ্যাপ ইনস্টল করুন - Play Store বা App Store এ যেতে হবে না!
            </p>
            
            {/* Quick Install Button for supported browsers */}
            {deferredPrompt && (
              <Button onClick={handleInstall} size="lg" className="mt-6 gap-2">
                <Download className="h-5 w-5" />
                এখনই ইনস্টল করুন
              </Button>
            )}
            
            {/* Copy Link for Desktop users */}
            {isDesktop && !deferredPrompt && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <p className="text-sm text-muted-foreground">মোবাইলে ইনস্টল করতে এই লিংক শেয়ার করুন:</p>
                <Button onClick={copyLink} variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  লিংক কপি করুন
                </Button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Android Instructions */}
            <Card className="border-border/60 bg-card/45 backdrop-blur hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Android ফোনে</h3>
                    <p className="text-sm text-muted-foreground">Chrome ব্রাউজার ব্যবহার করুন</p>
                  </div>
                </div>
                
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">১</span>
                    <span className="text-muted-foreground">Chrome এ এই ওয়েবসাইট ওপেন করুন</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">২</span>
                    <span className="text-muted-foreground">উপরের ডানদিকে মেনু (⋮) ট্যাপ করুন</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">৩</span>
                    <span className="text-muted-foreground">"Install App" বা "Add to Home Screen" ট্যাপ করুন</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">৪</span>
                    <span className="text-muted-foreground">"Install" বা "Add" বাটনে ট্যাপ করুন</span>
                  </li>
                </ol>

                {isAndroid && deferredPrompt && (
                  <Button onClick={handleInstall} className="w-full mt-4 gap-2">
                    <Download className="h-4 w-4" />
                    এখনই ইনস্টল করুন
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* iOS Instructions */}
            <Card className="border-border/60 bg-card/45 backdrop-blur hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center">
                    <Apple className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">iPhone/iPad এ</h3>
                    <p className="text-sm text-muted-foreground">Safari ব্রাউজার ব্যবহার করুন</p>
                  </div>
                </div>
                
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">১</span>
                    <span className="text-muted-foreground">Safari এ এই ওয়েবসাইট ওপেন করুন</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">২</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      নিচের Share বাটনে <Share2 className="h-4 w-4 inline" /> ট্যাপ করুন
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">৩</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <PlusSquare className="h-4 w-4 inline" /> "Add to Home Screen" সিলেক্ট করুন
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">৪</span>
                    <span className="text-muted-foreground">উপরের ডানদিকে "Add" ট্যাপ করুন</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Smartphone, text: 'হোম স্ক্রিনে আইকন' },
              { icon: CheckCircle2, text: 'দ্রুত অ্যাক্সেস' },
              { icon: Monitor, text: 'ফুল স্ক্রিন মোড' },
              { icon: Download, text: 'কোনো স্টোর লাগবে না' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <item.icon className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
