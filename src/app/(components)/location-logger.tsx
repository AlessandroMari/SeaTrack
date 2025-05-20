"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, MapPin, CheckCircle2, AlertTriangle, WifiOff } from 'lucide-react';
import { logLocationData } from '@/lib/actions';

interface LocationLoggerProps {
  objectId: string;
}

type Status = 'idle' | 'requesting' | 'success' | 'error' | 'denied' | 'unsupported' | 'offline';

const LocationLogger: FC<LocationLoggerProps> = ({ objectId }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
        setIsOnline(window.navigator.onLine);
    }
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setStatus('offline');
      setMessage('You are offline. Please check your internet connection to log location.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  const requestLocation = () => {
    if (!isOnline) {
      setStatus('offline');
      setMessage('You are offline. Please check your internet connection to log location.');
      return;
    }

    if (!navigator.geolocation) {
      setStatus('unsupported');
      setMessage('Geolocation is not supported by your browser.');
      return;
    }

    setStatus('requesting');
    setMessage('Acquiring your location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const result = await logLocationData({
            objectId,
            latitude,
            longitude,
            userAgent: navigator.userAgent,
          });

          if (result.success) {
            setStatus('success');
            setMessage(`Location recorded successfully for object ID: ${objectId}. Thank you!`);
          } else {
            setStatus('error');
            setMessage(result.message || 'An unknown error occurred while saving data.');
          }
        } catch (error) {
          setStatus('error');
          setMessage('Failed to submit location data. Please try again.');
          console.error("Error submitting location:", error);
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setStatus('denied');
            setMessage('Location permission denied. Please enable location services in your browser/device settings and try again.');
            break;
          case error.POSITION_UNAVAILABLE:
            setStatus('error');
            setMessage('Location information is unavailable. Please try again later or from a different location.');
            break;
          case error.TIMEOUT:
            setStatus('error');
            setMessage('The request to get user location timed out. Please try again.');
            break;
          default:
            setStatus('error');
            setMessage('An unknown error occurred while retrieving location.');
            break;
        }
      },
      { timeout: 10000, enableHighAccuracy: true } // 10 second timeout, try high accuracy
    );
  };

  const renderAlert = () => {
    if (status === 'idle') return null;

    let alertVariant: 'default' | 'destructive' = 'default';
    let IconComponent = CheckCircle2;

    if (status === 'success') {
      alertVariant = 'default'; // Or a custom success variant if defined
      IconComponent = CheckCircle2;
    } else if (status === 'error' || status === 'denied' || status === 'unsupported' || status === 'offline') {
      alertVariant = 'destructive';
      IconComponent = AlertTriangle;
      if (status === 'offline') IconComponent = WifiOff;
    } else if (status === 'requesting') {
        IconComponent = Loader2;
    }


    return (
      <Alert variant={alertVariant} className="mt-6 text-left shadow-md">
        <IconComponent className={`h-5 w-5 ${status === 'requesting' ? 'animate-spin' : ''}`} />
        <AlertTitle className="font-semibold">
          {status === 'requesting' && 'Processing...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Error'}
          {status === 'denied' && 'Permission Denied'}
          {status === 'unsupported' && 'Unsupported Browser'}
          {status === 'offline' && 'Network Offline'}
        </AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="w-full text-center">
      <p className="mb-2 text-muted-foreground">
        Object ID: <span className="font-semibold text-foreground">{objectId}</span>
      </p>
      <p className="mb-6 text-lg">
        Press the button below to log the current location of this object.
      </p>
      
      {status !== 'success' && (
        <Button
          onClick={requestLocation}
          disabled={status === 'requesting' || !isOnline}
          className="w-full max-w-xs text-lg py-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          variant="default"
        >
          {status === 'requesting' ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : (
            <MapPin className="mr-2 h-6 w-6" />
          )}
          {status === 'requesting' ? 'Acquiring Location...' : 'Log My Current Location'}
        </Button>
      )}
      
      {renderAlert()}

      {status === 'success' && (
         <Button
          onClick={() => {
            setStatus('idle');
            setMessage('');
          }}
          className="mt-4 w-full max-w-xs"
          variant="outline"
        >
          Log Another Location or Object
        </Button>
      )}
    </div>
  );
};

export default LocationLogger;
