
"use client";

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Copy, QrCode as QrCodeIcon, Loader2 } from 'lucide-react';
import SeaTrackHeader from '@/app/(components)/sea-track-header';
import { useToast } from "@/hooks/use-toast";

export default function GenerateQrPage() {
  const [objectId, setObjectId] = useState<string>('');
  const [qrValue, setQrValue] = useState<string | null>(null);
  const qrCanvasContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [isLoadingBaseUrl, setIsLoadingBaseUrl] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
      setIsLoadingBaseUrl(false);
    }
  }, []);

  const handleGenerateQr = (e: FormEvent) => {
    e.preventDefault();
    if (isLoadingBaseUrl || !baseUrl) {
        toast({ title: "Error", description: "Base URL not available yet. Please wait a moment.", variant: "destructive" });
        setQrValue(null);
        return;
    }
    if (!objectId.trim()) {
      toast({ title: "Error", description: "Object ID cannot be empty.", variant: "destructive" });
      setQrValue(null);
      return;
    }
    const fullUrl = `${baseUrl}/log_location?id=${encodeURIComponent(objectId.trim())}`;
    setQrValue(fullUrl);
    toast({ title: "Success", description: "QR Code generated!" });
  };

  const handleDownloadQr = () => {
    if (!qrValue || !qrCanvasContainerRef.current) {
      toast({ title: "Error", description: "No QR code generated to download.", variant: "destructive" });
      return;
    }
    const canvas = qrCanvasContainerRef.current.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream'); // Force download
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${objectId.trim() || 'qrcode'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast({ title: "Success", description: "QR Code download started." });
    } else {
      toast({ title: "Error", description: "Could not find QR code canvas element.", variant: "destructive" });
    }
  };

  const handleCopyUrl = () => {
    if (!qrValue) {
      toast({ title: "Error", description: "No URL to copy.", variant: "destructive" });
      return;
    }
    navigator.clipboard.writeText(qrValue)
      .then(() => toast({ title: "Success", description: "URL copied to clipboard!" }))
      .catch(() => toast({ title: "Error", description: "Failed to copy URL.", variant: "destructive" }));
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8">
      <SeaTrackHeader />
      <Card className="w-full max-w-lg mt-8 shadow-xl">
        <CardHeader className="text-center">
          <QrCodeIcon className="mx-auto h-10 w-10 text-primary mb-2" />
          <CardTitle className="text-3xl font-bold">Generate QR Code</CardTitle>
          <CardDescription>
            Enter an Object ID to generate a trackable QR code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleGenerateQr} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="objectId" className="text-base">Object ID</Label>
              <Input
                id="objectId"
                type="text"
                value={objectId}
                onChange={(e) => setObjectId(e.target.value)}
                placeholder="e.g., buoy-001, sensor-alpha-7"
                className="text-base"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full text-lg py-3" 
              disabled={isLoadingBaseUrl || !objectId.trim()}
            >
              {isLoadingBaseUrl ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <QrCodeIcon className="mr-2 h-5 w-5" />
              )}
              Generate QR Code
            </Button>
          </form>

          {qrValue && (
            <div className="mt-6 p-4 border rounded-md shadow-inner bg-muted/20 flex flex-col items-center space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Generated QR Code:</h3>
              <div ref={qrCanvasContainerRef} className="p-3 bg-white rounded-md inline-block shadow-md">
                <QRCodeCanvas 
                  value={qrValue} 
                  size={256} 
                  level="H" // High error correction level
                  bgColor="#ffffff" 
                  fgColor="#000000" 
                />
              </div>
              <p className="text-xs text-muted-foreground break-all text-center px-2" aria-label="Generated QR Code URL">
                URL: {qrValue}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                <Button onClick={handleDownloadQr} variant="outline" className="flex-1 text-base py-2.5">
                  <Download className="mr-2 h-5 w-5" /> Download PNG
                </Button>
                <Button onClick={handleCopyUrl} variant="outline" className="flex-1 text-base py-2.5">
                  <Copy className="mr-2 h-5 w-5" /> Copy URL
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SeaTrack Project. Admin Panel.</p>
      </footer>
    </div>
  );
}
