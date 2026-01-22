import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User, LogOut, Settings, Store, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bn } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface AppHeaderProps {
  onMenuClick: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { profile, currentStore, stores, role, signOut, switchStore } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getRoleBadge = () => {
    if (!role) return null;
    const roleColors = {
      owner: 'bg-primary/10 text-primary',
      manager: 'bg-info/10 text-info',
      staff: 'bg-muted text-muted-foreground',
    };
    return (
      <Badge variant="secondary" className={roleColors[role]}>
        {bn.roles[role]}
      </Badge>
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Store Switcher (if multiple stores) */}
      {stores.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
              <Store className="h-4 w-4" />
              <span className="max-w-[120px] truncate">{currentStore?.store?.name}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>স্টোর পরিবর্তন</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {stores.map((membership) => (
              <DropdownMenuItem
                key={membership.store_id}
                onClick={() => switchStore(membership.store_id)}
                className={membership.store_id === currentStore?.store_id ? 'bg-accent' : ''}
              >
                <Store className="h-4 w-4 mr-2" />
                {membership.store.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={bn.common.search}
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Role Badge */}
        <div className="hidden md:block">
          {getRoleBadge()}
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>বিজ্ঞপ্তি</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">কম স্টক সতর্কতা</span>
              <span className="text-xs text-muted-foreground">৫টি পণ্যের স্টক কম আছে</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">ওয়ারেন্টি মেয়াদ</span>
              <span className="text-xs text-muted-foreground">৩টি পণ্যের ওয়ারেন্টি শেষ হতে যাচ্ছে</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">নতুন অর্ডার</span>
              <span className="text-xs text-muted-foreground">আজ ২টি নতুন অর্ডার এসেছে</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <User className="h-4 w-4 text-primary" />
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{profile?.full_name || 'ব্যবহারকারী'}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {currentStore?.store?.name}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              {bn.nav.settings}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              {bn.nav.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
