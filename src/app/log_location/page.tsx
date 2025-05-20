import { Suspense } from 'react';
import LocationLogger from '@/app/(components)/location-logger';
import SeaTrackHeader from '@/app/(components)/sea-track-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface LogLocationPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Helper component to handle Suspense for searchParams
function LogLocationContent({ objectId }: { objectId: string | undefined }) {
  if (!objectId) {
    return (
      <div className="text-center text-destructive flex flex-col items-center">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="text-xl font-semibold">Object ID Missing</p>
        <p>The Object ID is missing from the URL. Please scan a valid SeaTrack QR code.</p>
        <p className="text-sm mt-2">Example: <code>/log_location?id=YOUR_OBJECT_ID</code></p>
      </div>
    );
  }
  return <LocationLogger objectId={objectId} />;
}


export default function LogLocationPage({ searchParams }: LogLocationPageProps) {
  const objectId = typeof searchParams.id === 'string' ? searchParams.id : undefined;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <SeaTrackHeader />
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Log Object Location</CardTitle>
          <CardDescription>
            Thank you for helping us track items at sea. Your current location will be recorded for the specified object ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="text-center p-8">Loading object details...</div>}>
            <LogLocationContent objectId={objectId} />
          </Suspense>
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SeaTrack Project. Ensuring data privacy and security.</p>
      </footer>
    </div>
  );
}

export const dynamic = 'force-dynamic'; // Ensure searchParams are fresh
