import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ open, onOpenChange, onScan }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScannedRef = useRef<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create beep sound
  useEffect(() => {
    // Create a simple beep using AudioContext
    const createBeep = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 1000;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
          audioContext.close();
        }, 100);
      } catch (e) {
        console.log('Audio not supported');
      }
    };

    audioRef.current = { play: createBeep } as any;
  }, []);

  const playBeep = () => {
    if (soundEnabled && audioRef.current) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 1000;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
          audioContext.close();
        }, 100);
      } catch (e) {
        // Silently fail
      }
    }
  };

  const startScanning = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setHasCamera(true);
        
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode('barcode-reader');
        }

        // Prefer back camera
        const backCamera = devices.find(d => 
          d.label.toLowerCase().includes('back') || 
          d.label.toLowerCase().includes('rear') ||
          d.label.toLowerCase().includes('environment')
        );
        const cameraId = backCamera?.id || devices[0].id;

        await scannerRef.current.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.5,
          },
          (decodedText) => {
            // Prevent duplicate scans
            if (decodedText !== lastScannedRef.current) {
              lastScannedRef.current = decodedText;
              playBeep();
              onScan(decodedText);
              
              // Reset after 2 seconds to allow rescanning same code
              setTimeout(() => {
                lastScannedRef.current = '';
              }, 2000);
            }
          },
          (errorMessage) => {
            // Ignore scanning errors (no QR code detected)
          }
        );

        setIsScanning(true);
      } else {
        setHasCamera(false);
        toast.error('কোনো ক্যামেরা পাওয়া যায়নি');
      }
    } catch (err) {
      console.error('Camera error:', err);
      setHasCamera(false);
      toast.error('ক্যামেরা অ্যাক্সেস করতে সমস্যা হয়েছে');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          await scannerRef.current.stop();
        }
      } catch (e) {
        // Ignore stop errors
      }
    }
    setIsScanning(false);
  };

  // Start scanning when dialog opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startScanning();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      stopScanning();
    }
  }, [open]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
          scannerRef.current.clear();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const handleClose = async () => {
    await stopScanning();
    onOpenChange(false);
  };

  const handleRetry = async () => {
    await stopScanning();
    await startScanning();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            বারকোড স্ক্যান করুন
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Scanner Container */}
          <div className="relative">
            <div
              id="barcode-reader"
              className="w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden"
            />
            
            {/* Scanning overlay */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-32 border-2 border-primary rounded-lg relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
                  
                  {/* Scanning line animation */}
                  <div className="absolute inset-x-2 h-0.5 bg-primary/70 animate-scan" />
                </div>
              </div>
            )}

            {!hasCamera && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted rounded-lg">
                <CameraOff className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">ক্যামেরা পাওয়া যায়নি</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-muted-foreground">
            <p>বারকোড ক্যামেরার সামনে ধরুন</p>
            <p className="text-xs mt-1">স্বয়ংক্রিয়ভাবে স্ক্যান হবে</p>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex-1"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  সাউন্ড অন
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4 mr-2" />
                  সাউন্ড অফ
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              রিট্রাই
            </Button>
          </div>

          <Button variant="outline" className="w-full" onClick={handleClose}>
            বন্ধ করুন
          </Button>
        </div>

        <style>{`
          @keyframes scan {
            0%, 100% { top: 10%; }
            50% { top: 80%; }
          }
          .animate-scan {
            animation: scan 2s ease-in-out infinite;
          }
          #barcode-reader video {
            width: 100% !important;
            border-radius: 0.5rem;
          }
          #barcode-reader__scan_region {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          #barcode-reader__dashboard {
            display: none !important;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
