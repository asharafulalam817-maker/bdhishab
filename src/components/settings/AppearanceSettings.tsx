import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sun, Moon, Monitor, Globe } from 'lucide-react';

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('settings.language')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={language}
            onValueChange={(value) => setLanguage(value as 'bn' | 'en')}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="bn"
                id="lang-bn"
                className="peer sr-only"
              />
              <Label
                htmlFor="lang-bn"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <span className="text-2xl mb-2">🇧🇩</span>
                <span className="font-medium">বাংলা</span>
                <span className="text-xs text-muted-foreground">Bengali</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="en"
                id="lang-en"
                className="peer sr-only"
              />
              <Label
                htmlFor="lang-en"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <span className="text-2xl mb-2">🇬🇧</span>
                <span className="font-medium">English</span>
                <span className="text-xs text-muted-foreground">ইংরেজি</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            {t('settings.theme')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem
                value="light"
                id="theme-light"
                className="peer sr-only"
              />
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Sun className="h-6 w-6 mb-2" />
                <span className="font-medium">{t('settings.lightMode')}</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="dark"
                id="theme-dark"
                className="peer sr-only"
              />
              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Moon className="h-6 w-6 mb-2" />
                <span className="font-medium">{t('settings.darkMode')}</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="system"
                id="theme-system"
                className="peer sr-only"
              />
              <Label
                htmlFor="theme-system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Monitor className="h-6 w-6 mb-2" />
                <span className="font-medium">{t('settings.system')}</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
