import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Smartphone, Monitor, Apple, Share2, PlusSquare, CheckCircle2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface AppDownloadSectionProps {
  variant?: 'full' | 'compact';
}

export const AppDownloadSection = ({ variant = 'full' }: AppDownloadSectionProps) => {
  const { t, language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const android = /android/.test(userAgent);
    const desktop = !ios && !android;
    
    setIsIOS(ios);
    setIsAndroid(android);
    setIsDesktop(desktop);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

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
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          setIsInstalled(true);
          toast.success(language === 'bn' ? 'অ্যাপ সফলভাবে ইনস্টল হয়েছে!' : 'App installed successfully!');
        }
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Install prompt error:', error);
        showManualInstructions();
      }
    } else {
      showManualInstructions();
    }
  };

  const showManualInstructions = () => {
    if (isIOS) {
      toast.info(
        language === 'bn' 
          ? 'Safari এ Share বাটন (□↑) ট্যাপ করে "Add to Home Screen" সিলেক্ট করুন' 
          : 'Tap Share button (□↑) in Safari and select "Add to Home Screen"',
        { duration: 5000 }
      );
    } else if (isAndroid) {
      toast.info(
        language === 'bn' 
          ? 'Chrome মেনু (⋮) ট্যাপ করে "Install App" বা "Add to Home Screen" সিলেক্ট করুন' 
          : 'Tap Chrome menu (⋮) and select "Install App" or "Add to Home Screen"',
        { duration: 5000 }
      );
    } else {
      toast.info(
        language === 'bn' 
          ? 'এড্রেস বারের ডানদিকে ইনস্টল আইকনে ক্লিক করুন অথবা মেনু থেকে "Install" সিলেক্ট করুন' 
          : 'Click install icon in address bar or select "Install" from menu',
        { duration: 5000 }
      );
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    toast.success(t('pwa.linkCopied'));
  };

  if (isInstalled) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <div>
            <p className="font-bold text-foreground">{t('pwa.alreadyInstalled')}</p>
            <p className="text-sm text-muted-foreground">
              {language === 'bn' ? 'আপনি ইতিমধ্যে ডিজিটাল বন্ধু অ্যাপ ইনস্টল করেছেন।' : 'You have already installed Digital Bondhu app.'}
            </p>
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
              <h3 className="font-bold text-foreground text-lg">📱 {t('pwa.downloadTitle')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'bn' ? 'মোবাইলে দ্রুত অ্যাক্সেসের জন্য হোম স্ক্রিনে যোগ করুন' : 'Add to home screen for quick mobile access'}
              </p>
              
              {isIOS ? (
                <div className="mt-3 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-semibold mb-2 flex items-center gap-2">
                    <Apple className="h-4 w-4" /> {t('pwa.iosTitle')} {language === 'bn' ? 'এ ইনস্টল:' : ' Install:'}
                  </p>
                  <ol className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{language === 'bn' ? '১' : '1'}</span>
                      Safari {language === 'bn' ? 'এর' : ''} <Share2 className="h-3 w-3 inline mx-1" /> Share {language === 'bn' ? 'বাটনে ট্যাপ করুন' : 'button'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{language === 'bn' ? '২' : '2'}</span>
                      <PlusSquare className="h-3 w-3 inline" /> "Add to Home Screen" {language === 'bn' ? 'ট্যাপ করুন' : 'tap'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{language === 'bn' ? '৩' : '3'}</span>
                      "Add" {language === 'bn' ? 'বাটনে ট্যাপ করুন' : 'button tap'}
                    </li>
                  </ol>
                </div>
              ) : isAndroid ? (
                <div className="mt-3 space-y-2">
                  <Button onClick={handleInstall} className="w-full gap-2" size="sm">
                    <Download className="h-4 w-4" />
                    {t('pwa.installButton')}
                  </Button>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-semibold mb-2 flex items-center gap-2">
                      <Smartphone className="h-4 w-4" /> {language === 'bn' ? 'ম্যানুয়াল ইনস্টল:' : 'Manual Install:'}
                    </p>
                    <ol className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{language === 'bn' ? '১' : '1'}</span>
                        Chrome {language === 'bn' ? 'মেনু (⋮) ট্যাপ করুন' : 'menu (⋮) tap'}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{language === 'bn' ? '২' : '2'}</span>
                        "Install App" {language === 'bn' ? 'বা' : 'or'} "Add to Home Screen" {language === 'bn' ? 'ট্যাপ করুন' : 'tap'}
                      </li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-semibold mb-2 flex items-center gap-2">
                      <Monitor className="h-4 w-4" /> {t('pwa.desktopTitle')} {language === 'bn' ? 'এ ইনস্টল:' : ' Install:'}
                    </p>
                    <p className="text-muted-foreground mb-2">
                      Chrome/Edge {language === 'bn' ? 'এড্রেস বারের ডানদিকে' : 'address bar right side'} <Download className="h-3 w-3 inline mx-1" /> {language === 'bn' ? 'আইকনে ক্লিক করুন' : 'icon click'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'bn' ? `অথবা মেনু থেকে "Install ${t('app.name')}" সিলেক্ট করুন` : `Or select "Install ${t('app.name')}" from menu`}
                    </p>
                  </div>
                  <Button onClick={copyLink} variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    {language === 'bn' ? 'মোবাইলে পাঠাতে লিংক কপি করুন' : 'Copy link to share on mobile'}
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
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">📱 {t('pwa.downloadTitle')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
              {language === 'bn' 
                ? 'ওয়েবসাইট থেকেই আপনার মোবাইলে অ্যাপ ইনস্টল করুন - Play Store বা App Store এ যেতে হবে না!'
                : 'Install the app on your mobile from the website - no need to go to Play Store or App Store!'}
            </p>
            
            <Button onClick={handleInstall} size="lg" className="mt-6 gap-2">
              <Download className="h-5 w-5" />
              {t('pwa.installButton')}
            </Button>
            
            {isDesktop && !deferredPrompt && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'মোবাইলে ইনস্টল করতে এই লিংক শেয়ার করুন:' : 'Share this link to install on mobile:'}
                </p>
                <Button onClick={copyLink} variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {t('pwa.copyLink')}
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
                    <h3 className="font-bold text-lg">{t('pwa.androidTitle')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'Chrome ব্রাউজার ব্যবহার করুন' : 'Use Chrome browser'}
                    </p>
                  </div>
                </div>
                
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">{language === 'bn' ? '১' : '1'}</span>
                    <span className="text-muted-foreground">{t('pwa.androidStep1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">{language === 'bn' ? '২' : '2'}</span>
                    <span className="text-muted-foreground">{t('pwa.androidStep2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">{language === 'bn' ? '৩' : '3'}</span>
                    <span className="text-muted-foreground">{t('pwa.androidStep3')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">{language === 'bn' ? '৪' : '4'}</span>
                    <span className="text-muted-foreground">
                      {language === 'bn' ? '"Install" বা "Add" বাটনে ট্যাপ করুন' : 'Tap "Install" or "Add" button'}
                    </span>
                  </li>
                </ol>

                {isAndroid && (
                  <Button onClick={handleInstall} className="w-full mt-4 gap-2">
                    <Download className="h-4 w-4" />
                    {t('pwa.installButton')}
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
                    <h3 className="font-bold text-lg">{t('pwa.iosTitle')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'Safari ব্রাউজার ব্যবহার করুন' : 'Use Safari browser'}
                    </p>
                  </div>
                </div>
                
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">{language === 'bn' ? '১' : '1'}</span>
                    <span className="text-muted-foreground">{t('pwa.iosStep1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">{language === 'bn' ? '২' : '2'}</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {t('pwa.iosStep2')} <Share2 className="h-4 w-4 inline" />
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">{language === 'bn' ? '৩' : '3'}</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <PlusSquare className="h-4 w-4 inline" /> {t('pwa.iosStep3')}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">{language === 'bn' ? '৪' : '4'}</span>
                    <span className="text-muted-foreground">
                      {language === 'bn' ? 'উপরের ডানদিকে "Add" ট্যাপ করুন' : 'Tap "Add" at top right'}
                    </span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Smartphone, textBn: 'হোম স্ক্রিনে আইকন', textEn: 'Home screen icon' },
              { icon: CheckCircle2, textBn: 'দ্রুত অ্যাক্সেস', textEn: 'Quick access' },
              { icon: Monitor, textBn: 'ফুল স্ক্রিন মোড', textEn: 'Full screen mode' },
              { icon: Download, textBn: 'কোনো স্টোর লাগবে না', textEn: 'No store needed' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <item.icon className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-semibold">{language === 'bn' ? item.textBn : item.textEn}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
