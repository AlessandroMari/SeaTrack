import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Anchor, ScanLine } from 'lucide-react';
import SeaTrackHeader from '@/app/(components)/sea-track-header';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <SeaTrackHeader />
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <Anchor size={32} />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to SeaTrack</CardTitle>
          <CardDescription className="text-md">
            Help us understand ocean currents and track objects at sea.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            If you've found an object with a SeaTrack QR code, please scan it to log its current location.
            Your contribution is valuable to our research.
          </p>
          <p className="text-sm text-muted-foreground">
            This application is designed to receive location data from scanned QR codes.
            Example URL: <code>/log_location?id=OBJECT_ID_HERE</code>
          </p>
          <Button asChild className="w-full" variant="outline">
            <Link href="/log_location?id=DEMO123">
              <ScanLine className="mr-2 h-5 w-5" />
              View Example Log Page
            </Link>
          </Button>
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SeaTrack Project. All rights reserved.</p>
      </footer>
    </div>
  );
}
