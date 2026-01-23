import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Save } from 'lucide-react';
import { toast } from 'sonner';

export interface WarrantyClaim {
  id: string;
  warrantyId: string;
  warrantyInfo?: {
    invoiceNo: string;
    product: string;
    customer: string;
    phone: string;
  };
  claimDate: string;
  issueDescription: string;
  actionTaken?: string;
  resolution?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface WarrantyClaimDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warranty?: {
    id: string;
    invoiceNo: string;
    product: string;
    customer: string;
    phone: string;
  };
  existingClaim?: WarrantyClaim;
  onSave: (claim: Partial<WarrantyClaim>) => void;
}

export function WarrantyClaimDialog({
  open,
  onOpenChange,
  warranty,
  existingClaim,
  onSave,
}: WarrantyClaimDialogProps) {
  const [issueDescription, setIssueDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [resolution, setResolution] = useState('');
  const [status, setStatus] = useState<WarrantyClaim['status']>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingClaim) {
      setIssueDescription(existingClaim.issueDescription);
      setActionTaken(existingClaim.actionTaken || '');
      setResolution(existingClaim.resolution || '');
      setStatus(existingClaim.status);
    } else {
      setIssueDescription('');
      setActionTaken('');
      setResolution('');
      setStatus('pending');
    }
  }, [existingClaim, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!issueDescription.trim()) {
      toast.error('সমস্যার বিবরণ দিন');
      return;
    }

    setIsSubmitting(true);
    try {
      onSave({
        id: existingClaim?.id,
        warrantyId: warranty?.id || existingClaim?.warrantyId,
        issueDescription,
        actionTaken: actionTaken || undefined,
        resolution: resolution || undefined,
        status,
        claimDate: existingClaim?.claimDate || new Date().toISOString().split('T')[0],
      });
      
      toast.success(existingClaim ? 'ক্লেম আপডেট হয়েছে' : 'নতুন ক্লেম যোগ হয়েছে');
      onOpenChange(false);
    } catch (error) {
      toast.error('ক্লেম সেভ করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusLabel = (s: WarrantyClaim['status']) => {
    switch (s) {
      case 'pending': return 'অপেক্ষমাণ';
      case 'in_progress': return 'প্রক্রিয়াধীন';
      case 'resolved': return 'সমাধান হয়েছে';
      case 'rejected': return 'প্রত্যাখ্যাত';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            {existingClaim ? 'ক্লেম আপডেট করুন' : 'নতুন ক্লেম রেজিস্টার করুন'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Warranty Info (read-only) */}
          {(warranty || existingClaim?.warrantyInfo) && (
            <div className="p-3 rounded-lg bg-muted/50 space-y-1 text-sm">
              <p><span className="text-muted-foreground">পণ্য:</span> {warranty?.product || existingClaim?.warrantyInfo?.product}</p>
              <p><span className="text-muted-foreground">গ্রাহক:</span> {warranty?.customer || existingClaim?.warrantyInfo?.customer}</p>
              <p><span className="text-muted-foreground">ফোন:</span> {warranty?.phone || existingClaim?.warrantyInfo?.phone}</p>
              <p><span className="text-muted-foreground">চালান:</span> {warranty?.invoiceNo || existingClaim?.warrantyInfo?.invoiceNo}</p>
            </div>
          )}

          {/* Issue Description */}
          <div className="space-y-2">
            <Label htmlFor="issue">সমস্যার বিবরণ *</Label>
            <Textarea
              id="issue"
              placeholder="গ্রাহকের অভিযোগ বা সমস্যা লিখুন..."
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>স্ট্যাটাস</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as WarrantyClaim['status'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">{getStatusLabel('pending')}</SelectItem>
                <SelectItem value="in_progress">{getStatusLabel('in_progress')}</SelectItem>
                <SelectItem value="resolved">{getStatusLabel('resolved')}</SelectItem>
                <SelectItem value="rejected">{getStatusLabel('rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Taken */}
          <div className="space-y-2">
            <Label htmlFor="action">গৃহীত পদক্ষেপ</Label>
            <Textarea
              id="action"
              placeholder="কী কী পদক্ষেপ নেওয়া হয়েছে..."
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              rows={2}
            />
          </div>

          {/* Resolution */}
          <div className="space-y-2">
            <Label htmlFor="resolution">সমাধান</Label>
            <Textarea
              id="resolution"
              placeholder="চূড়ান্ত সমাধান বা ফলাফল..."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              বাতিল
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {existingClaim ? 'আপডেট করুন' : 'সেভ করুন'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
