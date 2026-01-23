import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Smartphone, Monitor, Apple, Share2, PlusSquare, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

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

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

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
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
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
              <h3 className="font-bold text-foreground text-lg">অ্যাপ ডাউনলোড করুন</h3>
              <p className="text-sm text-muted-foreground mt-1">
                মোবাইলে দ্রুত অ্যাক্সেসের জন্য হোম স্ক্রিনে যোগ করুন
              </p>
              
              {isIOS ? (
                <div className="mt-3 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <Apple className="h-4 w-4" /> iPhone/iPad এ ইনস্টল:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Share2 className="h-3 w-3 inline" /> Safari এর Share বাটনে ট্যাপ করুন
                    </li>
                    <li className="flex items-center gap-2">
                      <PlusSquare className="h-3 w-3 inline" /> "Add to Home Screen" সিলেক্ট করুন
                    </li>
                    <li>"Add" ট্যাপ করুন</li>
                  </ol>
                </div>
              ) : deferredPrompt ? (
                <Button onClick={handleInstall} className="mt-3 gap-2" size="sm">
                  <Download className="h-4 w-4" />
                  এখনই ইনস্টল করুন
                </Button>
              ) : (
                <div className="mt-3 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <Monitor className="h-4 w-4" /> ইনস্টল করতে:
                  </p>
                  <p className="text-muted-foreground">
                    Chrome/Edge ব্রাউজারের মেনু থেকে "Install App" বা "Add to Home Screen" সিলেক্ট করুন
                  </p>
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
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">অ্যাপ ডাউনলোড করুন</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
              ওয়েবসাইট থেকেই আপনার মোবাইলে অ্যাপ ইনস্টল করুন - Play Store বা App Store এ যেতে হবে না!
            </p>
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

                {deferredPrompt && !isIOS && (
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
