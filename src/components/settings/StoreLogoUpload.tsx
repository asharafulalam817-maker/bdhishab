import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StoreLogoUploadProps {
  currentLogoUrl?: string | null;
  storeId: string;
  onLogoChange: (url: string | null) => void;
}

const MAX_FILE_SIZE = 512 * 1024; // 512KB

export function StoreLogoUpload({ currentLogoUrl, storeId, onLogoChange }: StoreLogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('শুধুমাত্র ছবি ফাইল আপলোড করুন');
      return;
    }

    // Validate file size (512KB max for small logos)
    if (file.size > MAX_FILE_SIZE) {
      toast.error('ফাইল সাইজ ৫১২KB এর কম হতে হবে');
      return;
    }

    setIsUploading(true);
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${storeId}-logo-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('store-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('আপলোড করতে সমস্যা হয়েছে');
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('store-logos')
        .getPublicUrl(fileName);

      // Update store record
      const { error: updateError } = await supabase
        .from('stores')
        .update({ logo_url: publicUrl })
        .eq('id', storeId);

      if (updateError) {
        console.error('Update error:', updateError);
        toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
        return;
      }

      setPreviewUrl(publicUrl);
      onLogoChange(publicUrl);
      toast.success('লোগো আপলোড হয়েছে');
    } catch (error) {
      console.error('Error:', error);
      toast.error('আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = async () => {
    setIsUploading(true);
    try {
      // Update store record to remove logo
      const { error } = await supabase
        .from('stores')
        .update({ logo_url: null })
        .eq('id', storeId);

      if (error) {
        toast.error('মুছতে সমস্যা হয়েছে');
        return;
      }

      setPreviewUrl(null);
      onLogoChange(null);
      toast.success('লোগো মুছে ফেলা হয়েছে');
    } catch (error) {
      toast.error('মুছতে সমস্যা হয়েছে');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label>স্টোর লোগো/আইকন (সর্বোচ্চ ৫১২KB)</Label>
      
      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden bg-muted/30">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Store logo" 
              className="w-full h-full object-contain"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="logo-upload"
          />
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {previewUrl ? 'পরিবর্তন করুন' : 'আপলোড করুন'}
          </Button>

          {previewUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveLogo}
              disabled={isUploading}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
              মুছুন
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        PNG, JPG বা WebP ফরম্যাট। ওয়ারেন্টি কার্ড এবং চালানে দেখাবে।
      </p>
    </div>
  );
}
