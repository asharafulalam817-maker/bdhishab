import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, Search, User, Settings, Home, Command, Sun, Moon, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemo } from '@/contexts/DemoContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GlobalSearchDialog } from '@/components/search/GlobalSearchDialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AppHeaderProps {
  onMenuClick: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { demoProfile, demoStore } = useDemo();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isOnDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-3 lg:px-4">
        {/* Left side - Menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Home button - visible when not on dashboard */}
        {!isOnDashboard && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => navigate('/dashboard')}
            title={t('common.goToDashboard')}
          >
            <Home className="h-5 w-5" />
          </Button>
        )}

        {/* Store name - desktop only */}
        <div className="hidden md:flex items-center">
          <span className="text-sm font-medium text-muted-foreground truncate max-w-[150px]">
            {demoStore.name}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search button */}
        <Button
          variant="outline"
          className="gap-2 h-9 px-3 text-muted-foreground hover:text-foreground"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">{t('common.search')}</span>
          <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <Command className="h-3 w-3" />K
          </kbd>
        </Button>

        {/* Theme Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-warning" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {theme === 'dark' ? t('settings.lightMode') : t('settings.darkMode')}
          </TooltipContent>
        </Tooltip>

        {/* Language Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 font-bold"
              onClick={toggleLanguage}
            >
              <span className="text-sm font-semibold">
                {language === 'bn' ? 'EN' : 'বাং'}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
          </TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>{t('common.notifications')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">{t('inventory.lowStockAlerts')}</span>
              <span className="text-xs text-muted-foreground">5 items low in stock</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{demoProfile.full_name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {demoStore.name}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
              <Home className="h-4 w-4 mr-2" />
              {t('nav.dashboard')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              {t('nav.settings')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
